const dotenv = require('dotenv');
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('No GEMINI_API_KEY found in .env file!');
  process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

fetch(url)
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then(data => {
    console.log('\n--- Supported Models for your API Key ---');
    if (data.models && data.models.length > 0) {
      data.models.forEach(model => {
        if (model.supportedGenerationMethods.includes('generateContent')) {
          console.log(`- ${model.name.replace('models/', '')} (${model.displayName})`);
        }
      });
    } else {
      console.log('No models returned!');
    }
    console.log('-----------------------------------------\n');
  })
  .catch(err => {
    console.error('Error fetching models:', err.message);
  });
