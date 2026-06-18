// @ts-ignore
import pdfParse from 'pdf-parse';

export const parsePDF = async (buffer: Buffer): Promise<string> => {
  try {
    const data = await pdfParse(buffer);
    return data.text || '';
  } catch (err) {
    console.error('[pdf-parse error]', err);
    return '';
  }
};
