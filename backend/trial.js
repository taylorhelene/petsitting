const axios = require('axios') ;

// Configuration
const API_KEY = "AuC3KHtdfEmEOZweN5ZHNAT9nEGaaoMh447KIfkSOiSzJHvt3KYtJQQJ99AJACYeBjFXJ3w3AAABACOG65XZ"; // Replace with your API key

// Set up headers
const headers = {
    "Content-Type": "application/json",
    "api-key": API_KEY,
};

// Payload for the request
const payload = {
    "messages": [
        {
            "role": "system",
            "content": [
                {
                    "type": "text",
                    "text": "You are an AI assistant that helps people find information."
                }
            ]
        }
    ],
    "temperature": 0.7,
    "top_p": 0.95,
    "max_tokens": 800
};

const ENDPOINT = "https://backenddata.openai.azure.com/openai/deployments/gpt-4/chat/completions?api-version=2024-02-15-preview";

// Send request
axios.post(ENDPOINT, payload, { headers })
    .then(response => {
        // Handle the response as needed (e.g., print or process)
        console.log(response.data);
    })
    .catch(error => {
        console.error(`Failed to make the request. Error: ${error.response ? error.response.data : error.message}`);
    });
