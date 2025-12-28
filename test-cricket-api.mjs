/**
 * Test script to verify Cricket API endpoints
 * Run with: node test-cricket-api.mjs
 */

const API_KEY = "1a822521-d7e0-46ff-98d3-3e51020863f3";
const API_BASE_URL = "https://api.cricapi.com/v1";

async function testEndpoint(name, endpoint, params = {}) {
  const url = new URL(`${API_BASE_URL}/${endpoint}`);
  url.searchParams.append("apikey", API_KEY);
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, String(value));
  });

  console.log(`\n${"=".repeat(60)}`);
  console.log(`Testing: ${name}`);
  console.log(`URL: ${url.toString()}`);
  console.log(`${"=".repeat(60)}`);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.status === "success") {
      console.log("✅ SUCCESS");
      console.log(`Data type: ${Array.isArray(data.data) ? 'Array' : 'Object'}`);
      if (Array.isArray(data.data)) {
        console.log(`Items count: ${data.data.length}`);
        if (data.data.length > 0) {
          console.log("First item sample:");
          console.log(JSON.stringify(data.data[0], null, 2).substring(0, 500) + "...");
        }
      } else {
        console.log("Response sample:");
        console.log(JSON.stringify(data.data, null, 2).substring(0, 500) + "...");
      }
      
      if (data.info) {
        console.log(`\nAPI Info:`);
        console.log(`- Hits today: ${data.info.hitsToday}/${data.info.hitsLimit}`);
        console.log(`- Credits: ${data.info.credits}`);
        console.log(`- Query time: ${data.info.queryTime}ms`);
      }
      
      return data.data;
    } else {
      console.log("❌ FAILED");
      console.log(`Status: ${data.status}`);
      console.log(`Response:`, JSON.stringify(data, null, 2));
      return null;
    }
  } catch (error) {
    console.log("❌ ERROR");
    console.error(error.message);
    return null;
  }
}

async function runTests() {
  console.log("\n🏏 CRICKET API ENDPOINT TESTS\n");
  console.log(`API Key: ${API_KEY.substring(0, 20)}...`);
  console.log(`Base URL: ${API_BASE_URL}`);

  // Test 1: Current Matches (most important for homepage)
  const currentMatches = await testEndpoint(
    "Current Matches",
    "currentMatches",
    { offset: 0 }
  );

  // Test 2: All Matches
  await testEndpoint(
    "All Matches",
    "matches",
    { offset: 0 }
  );

  // If we have matches, test match-specific endpoints
  if (currentMatches && currentMatches.length > 0) {
    const testMatchId = currentMatches[0].id;
    console.log(`\n📌 Using match ID for detailed tests: ${testMatchId}`);

    // Test 3: Match Info
    await testEndpoint(
      "Match Info",
      "match_info",
      { id: testMatchId }
    );

    // Test 4: Match Squad (critical for team building)
    await testEndpoint(
      "Match Squad",
      "match_squad",
      { id: testMatchId }
    );

    // Test 5: Match Points (critical for scoring)
    await testEndpoint(
      "Match Points",
      "match_points",
      { id: testMatchId, ruleset: 0 }
    );

    // Test 6: Match Scorecard
    await testEndpoint(
      "Match Scorecard",
      "match_scorecard",
      { id: testMatchId }
    );
  } else {
    console.log("\n⚠️  No matches available to test match-specific endpoints");
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log("✅ All tests completed!");
  console.log(`${"=".repeat(60)}\n`);
}

runTests().catch(console.error);
