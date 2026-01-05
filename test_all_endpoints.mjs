const API_KEY = "1a822521-d7e0-46ff-98d3-3e51020863f3";
const API_BASE_URL = "https://api.cricapi.com/v1";

async function testEndpoints() {
    const endpoints = [
        "currentMatches",
        "matches",
        "series",
        "cricScore"
    ];

    for (const endpoint of endpoints) {
        console.log(`\n--- Testing endpoint: ${endpoint} ---`);
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}?apikey=${API_KEY}`);
            const data = await response.json();
            console.log(`Status: ${data.status}`);
            
            if (data.data) {
                console.log(`Data length: ${data.data.length}`);
                if (data.data.length > 0) {
                    // Check for fantasyEnabled in currentMatches or matches
                    if (endpoint === "currentMatches" || endpoint === "matches") {
                        const fantasyEnabledCount = data.data.filter(m => m.fantasyEnabled).length;
                        console.log(`Matches with fantasyEnabled: ${fantasyEnabledCount}`);
                        
                        const matchStartedCount = data.data.filter(m => m.matchStarted).length;
                        console.log(`Matches started: ${matchStartedCount}`);
                    }
                    
                    console.log('First item sample:', JSON.stringify(data.data[0]).substring(0, 300));
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
