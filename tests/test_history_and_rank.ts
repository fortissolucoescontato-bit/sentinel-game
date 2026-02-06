
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
console.log("TSX START");

async function testHistoryAndRank() {
    console.log("FUNCTION START");
    const { db } = await import("../db");
    const { users, safes, logs } = await import("../db/schema");
    const { eq } = await import("drizzle-orm");

    const { getAttackHistory, hackSafeCore } = await import("../actions/hack");
    console.log("IMPORT HACK DONE");
    const { getUserRank } = await import("../actions/leaderboard");
    console.log("IMPORT LEADERBOARD DONE");

    console.log("📊 TESTING HISTORY AND RANKING SYSTEM...\n");

    const now = Date.now();

    // 1. Create a set of users to test ranking
    // User A: 5000 credits
    const [userA] = await db.insert(users).values({
        clerkId: `rankA_${now}`,
        email: `rankA_${now}@test.com`,
        username: `rankA_${now}`,
        credits: 5000,
        tier: 'elite'
    }).returning();

    // User B: 3000 credits
    const [userB] = await db.insert(users).values({
        clerkId: `rankB_${now}`,
        email: `rankB_${now}@test.com`,
        username: `rankB_${now}`,
        credits: 3000,
        tier: 'novato'
    }).returning();

    // User C: 1000 credits
    const [userC] = await db.insert(users).values({
        clerkId: `rankC_${now}`,
        email: `rankC_${now}@test.com`,
        username: `rankC_${now}`,
        credits: 1000,
        tier: 'novato'
    }).returning();

    console.log(`Created Users: A(5000), B(3000), C(1000)`);

    try {
        // 2. Test getUserRank
        console.log("\n2. Checking Global Ranks...");
        console.log("   Calling rank A...");
        const rankA = await getUserRank(userA.id);
        console.log("   Calling rank B...");
        const rankB = await getUserRank(userB.id);
        console.log("   Calling rank C...");
        const rankC = await getUserRank(userC.id);

        console.log(`   Rank A: ${rankA}`);
        console.log(`   Rank B: ${rankB}`);
        console.log(`   Rank C: ${rankC}`);

        if (rankA < rankB && rankB < rankC) {
            console.log("   ✅ Ranks are correctly ordered.");
        } else {
            console.log("   ❌ Rank order fail!");
        }

        // 3. Test Attack History (Logs)
        console.log("\n3. Testing Attack History...");

        // Manually insert logs to avoid real AI calls for this test
        await db.insert(logs).values([
            {
                attackerId: userB.id,
                defenderId: userA.id,
                inputPrompt: "Test Attack 1",
                aiResponse: "Response 1",
                success: false,
                creditsSpent: 10,
                styleScore: 5
            },
            {
                attackerId: userB.id,
                defenderId: userC.id,
                inputPrompt: "Test Attack 2",
                aiResponse: "Response 2",
                success: true,
                creditsSpent: 10,
                styleScore: 8
            }
        ]);

        const history = await getAttackHistory(userB.id);

        console.log(`   Found ${history.length} history items for User B.`);
        history.forEach((item, i) => console.log(`      Item ${i}: ${item.inputPrompt}`));

        const hasAttack1 = history.some(h => h.inputPrompt === "Test Attack 1");
        const hasAttack2 = history.some(h => h.inputPrompt === "Test Attack 2");

        if (history.length === 2 && hasAttack1 && hasAttack2) {
            console.log("   ✅ History loaded correctly.");
            const attack2 = history.find(h => h.inputPrompt === "Test Attack 2");
            if (attack2?.defender && attack2.defender.username === userC.username) {
                console.log("   ✅ Relations (Defender) loaded correctly.");
            } else {
                console.log("   ❌ Relation missing or wrong.", attack2?.defender);
            }
        } else {
            console.log("   ❌ History items mismatch.");
        }

    } catch (e) {
        console.error("Test Error:", e);
    } finally {
        // Cleanup
        await db.delete(logs).where(eq(logs.attackerId, userB.id));
        await db.delete(users).where(eq(users.id, userA.id));
        await db.delete(users).where(eq(users.id, userB.id));
        await db.delete(users).where(eq(users.id, userC.id));
        console.log("\n🧹 Cleanup done.");
        process.exit(0);
    }
}

testHistoryAndRank();
