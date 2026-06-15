import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as vm from 'vm';

const execPromise = promisify(exec);

async function isDockerRunning(): Promise<boolean> {
  try {
    await execPromise('docker info');
    return true;
  } catch {
    return false;
  }
}

export async function runCode(
  code: string,
  language: string
): Promise<{ success: boolean; output: string; error?: string }> {
  const normalizedLang = language.toLowerCase();

  // 1. JavaScript / TypeScript (Local VM Sandbox)
  if (normalizedLang === 'javascript' || normalizedLang === 'typescript') {
    try {
      const logs: string[] = [];
      const sandbox = {
        console: {
          log: (...args: any[]) => {
            logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
          },
          error: (...args: any[]) => {
            logs.push('[ERROR] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
          }
        },
        Buffer,
        process: { env: {} },
        setTimeout,
        clearTimeout
      };

      const script = new vm.Script(code);
      const context = vm.createContext(sandbox);
      
      script.runInContext(context, { timeout: 2000 });

      return {
        success: true,
        output: logs.join('\n') || 'Code executed successfully (no stdout).'
      };
    } catch (err: any) {
      return {
        success: false,
        output: '',
        error: err.message || 'Execution error'
      };
    }
  }

  // 2. Python Execution (Docker if active, Subprocess fallback)
  if (normalizedLang === 'python') {
    const tempDir = path.join(__dirname, '..', '..', 'temp');
    await fs.mkdir(tempDir, { recursive: true });
    
    const fileName = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}.py`;
    const filePath = path.join(tempDir, fileName);
    
    // Write code to temp file
    await fs.writeFile(filePath, code, 'utf-8');

    try {
      const useDocker = await isDockerRunning();

      if (useDocker) {
        // Run code in containerized python env
        const containerPath = `/app/${fileName}`;
        const cmd = `docker run --rm -v "${tempDir}:/app" python:alpine python "${containerPath}"`;
        
        try {
          const { stdout, stderr } = await execPromise(cmd, { timeout: 2500 });
          return {
            success: !stderr,
            output: stdout || stderr || 'Executed successfully (no stdout).',
            error: stderr || undefined
          };
        } catch (execErr: any) {
          return {
            success: false,
            output: execErr.stdout || '',
            error: execErr.stderr || execErr.message || 'Execution timeout/error'
          };
        }
      } else {
        // Fallback: Run using local python3 subprocess with timeout
        return new Promise((resolve) => {
          const process = spawn('python3', [filePath]);
          let stdout = '';
          let stderr = '';

          const timer = setTimeout(() => {
            process.kill('SIGKILL');
            resolve({
              success: false,
              output: '',
              error: 'Execution Timeout: Limit of 2 seconds exceeded.'
            });
          }, 2000);

          process.stdout.on('data', (data) => {
            stdout += data.toString();
          });

          process.stderr.on('data', (data) => {
            stderr += data.toString();
          });

          process.on('close', (code) => {
            clearTimeout(timer);
            resolve({
              success: code === 0,
              output: stdout || (code === 0 ? 'Executed successfully (no stdout).' : ''),
              error: stderr || (code !== 0 ? `Process exited with code ${code}` : undefined)
            });
          });
        });
      }
    } catch (err: any) {
      return {
        success: false,
        output: '',
        error: err.message || 'Execution failed.'
      };
    } finally {
      // Clean up the temp file
      try {
        await fs.unlink(filePath);
      } catch (cleanupErr) {
        console.error('Failed to clean up temp file:', cleanupErr);
      }
    }
  }

  return {
    success: false,
    output: '',
    error: `Language '${language}' is not supported for execution yet.`
  };
}
