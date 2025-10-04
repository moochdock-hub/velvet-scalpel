const fetch = require('node-fetch');
const assert = require('assert');

async function testOpenAIIntegration() {
    const userMessage = 'Test message';
    const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();
    assert(data.message, 'Response should contain a message');
    console.log('Test passed: OpenAI integration is working.');
}

testOpenAIIntegration().catch(error => console.error('Test failed:', error));