import * as cricketApiFixed from './server/cricketApi-fixed.ts';
import * as cricketApiEnhanced from './server/cricketApi-enhanced.ts';

// Mock process.env
process.env.CRIC_API_KEY = "1a822521-d7e0-46ff-98d3-3e51020863f3";

async function verify() {
    console.log("--- Verifying Fixed API ---");
    try {
        const matches = await cricketApiFixed.getAllMatches();
        console.log(`Fixed API matches count: ${matches.length}`);
        if (matches.length > 0) {
            console.log("Sample match:", JSON.stringify(matches[0]).substring(0, 200));
        }
    } catch (e) {
        console.error("Fixed API error:", e.message);
    }

    console.log("\n--- Verifying Enhanced API ---");
    try {
        const matches = await cricketApiEnhanced.getAllMatchesComprehensive();
        console.log(`Enhanced API matches count: ${matches.length}`);
        if (matches.length > 0) {
            console.log("Sample match:", JSON.stringify(matches[0]).substring(0, 200));
        }
    } catch (e) {
        console.error("Enhanced API error:", e.message);
    }
}

// Since we are in a node environment and the files are .ts, we might need ts-node or similar.
// But for now, let's just check if the logic is sound.
verify().then(() => console.log("\nVerification complete."));
