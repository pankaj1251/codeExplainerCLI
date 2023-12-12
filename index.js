const fs = require('fs');
const { TextServiceClient } =
  require("@google-ai/generativelanguage").v1beta2;

const { GoogleAuth } = require("google-auth-library");

// Initialize Google PALM API client
const MODEL_NAME = "models/text-bison-001";
const API_KEY = 'AIzaSyCQYy6AiOqOzfgCBq4HcpdwjGLYkemPlTo';

const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

function getCodeFromActiveFile() {
  // Get the file path from command line arguments
  const filePath = process.argv[2];
  
  // Check if a file path is provided
  if (!filePath) {
    console.error('Please provide a file path');
    process.exit(1);
  }

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    console.error('File does not exist');
    process.exit(1);
  }

  // Read the file contents
  const code = fs.readFileSync(filePath, 'utf8');
  return code;
}

async function explainCode(code) {
const prompt = `Explain the following code:\n${code}`;
    client
    .generateText({
        model: MODEL_NAME,
        prompt: {
        text: prompt,
        },
    })
    .then((result) => {
        // Display the explanation in the terminal
        console.log('Code Explanation:');
        console.log(result[0].candidates[0].output);
    })
    .catch((err) => {
        console.error('Error fetching code explanation:', err);
    });
}

// Run the CLI app
async function runCLI() {
  const code = getCodeFromActiveFile();
  if (!code) {
    console.error('Unable to fetch code from the active file.');
    return;
  }

  explainCode(code);
}

runCLI();
