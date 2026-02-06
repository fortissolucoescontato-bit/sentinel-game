
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../db";
import { users, safes, unlockedSafes } from "../db/schema";
import { eq } from "drizzle-orm";

async function testOfficialSafes() {
    console.log("🏢 TESTING OFFICIAL SAFES LOGIC...\n");

    const now = Date.now();
    const systemUser = (await db.insert(users).values({
        clerkId: `sys_${now}`,
        email: `sys_${now}@sentinel.game`,
        username: `sys_${now}`,
        tier: 'system',
        credits: 999999
    }).returning())[0];

    const player = (await db.insert(users).values({
        clerkId: `player_${now}`,
        email: `player_${now}@test.com`,
        username: `player_${now}`,
        tier: 'novato',
        credits: 100
    }).returning())[0];

    const officialSafe = (await db.insert(safes).values({
        userId: systemUser.id,
        secretWord: "official",
        systemPrompt: "Official desc",
        defenseLevel: 1
    }).returning())[0];

    console.log(`Created: Official Safe(${officialSafe.id}) owned by System User(${systemUser.username})`);

    try {
        const { getAvailableSafes, hackSafeCore } = await import("../actions/hack");

        // 1. Initial State: Should be visible
        console.log("\n1. Checking visibility for player...");
        const available1 = await getAvailableSafes(player.id);
        const seesSafe1 = available1.some(s => s.id === officialSafe.id);
        console.log(`   Player sees safe: ${seesSafe1}`);

        // 2. Player cracks the safe
        console.log("   Cracking safe...");
        await db.insert(unlockedSafes).values({ userId: player.id, safeId: officialSafe.id });

        // 3. Check visibility again: Should STILL be visible because it's Official
        console.log("\n2. Checking visibility after cracking (Should stay visible)...");
        const available2 = await getAvailableSafes(player.id);
        const safeRecord = available2.find(s => s.id === officialSafe.id);

        if (safeRecord) {
            console.log(`   ✅ Correct: Official safe is still visible. isUnlocked: ${safeRecord.isUnlocked}`);
        } else {
            console.log("   ❌ ERROR: Official safe disappeared after cracking!");
        }

        // 4. Test re-hacking logic
        console.log("\n3. Testing re-hacking logic...");
        // Re-fetch player to avoid cache/integrity if any
        const currentPlayer = await db.query.users.findFirst({ where: eq(users.id, player.id) });
        const result = await hackSafeCore(currentPlayer!, officialSafe.id, "Testing re-hack");

        if (result.error !== "Cofre já invadido") {
            console.log("   ✅ Correct: Re-hack permitted (or failed with normal error, not 'Already Cracked').");
        } else {
            console.log("   ❌ ERROR: Re-hack blocked for official safe!");
        }

    } catch (e) {
        console.error("Test Error:", e);
    } finally {
        // Cleanup
        await db.delete(unlockedSafes).where(eq(unlockedSafes.userId, player.id));
        await db.delete(safes).where(eq(safes.userId, systemUser.id));
        await db.delete(users).where(eq(users.id, systemUser.id));
        await db.delete(users).where(eq(users.id, player.id));
        console.log("\n🧹 Cleanup done.");
        process.exit(0);
    }
}

testOfficialSafes();
