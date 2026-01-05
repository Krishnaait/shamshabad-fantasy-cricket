const API_KEY = "1a822521-d7e0-46ff-98d3-3e51020863f3";
const API_BASE_URL = "https://api.cricapi.com/v1";

async function testEndpoints() {
    const endpoints = [
        "currentMatches",
        "matches",
        "series"
    ];

    for (const endpoint of endpoints) {
        console.log(`\nTesting endpoint: ${endpoint}`);
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}?apikey=${API_KEY}`);
            const data = await response.json();
            console.log(`Status: ${data.status}`);
            if (data.data) {
                console.log(`Data length: ${data.data.length}`);
                if (data.data.length > 0) {
                    console.log('First item sample:', JSON.stringify(data.data[0]).substring(0, 200));
                }
            } else {
                console.log('No data field in response');
                console.log('Full response:', JSON.stringify(data));
            }
        } catch (error) {
            console.error(`Error testing ${endpoint}:`, error.message);
        }
    }
}

testEndpoints();
