
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../db";
import { users, safes, unlockedSafes } from "../db/schema";
import { eq } from "drizzle-orm";

async function testReadActions() {
    // Import Actions
    const { getUserProfile, getUserSafes, getSafeById, getUserByEmail } = await import("../actions/user");
    const { getAvailableSafes } = await import("../actions/hack");

    console.log("📖 TESTING READ ACTIONS...\n");

    const now = Date.now();
    const owner = (await db.insert(users).values({
        clerkId: `owner_${now}`,
        email: `owner_${now}@test.com`,
        username: `owner_${now}`,
        tier: 'novato',
        credits: 1000
    }).returning())[0];

    const seeker = (await db.insert(users).values({
        clerkId: `seeker_${now}`,
        email: `seeker_${now}@test.com`,
        username: `seeker_${now}`,
        tier: 'novato',
        credits: 100
    }).returning())[0];

    // Create 2 safes for Owner
    const safe1 = (await db.insert(safes).values({
        userId: owner.id,
        secretWord: "alpha",
        systemPrompt: "Alpha desc",
        defenseLevel: 1
    }).returning())[0];

    // Create 1 safe for Seeker (to test exclusion)
    const safe2 = (await db.insert(safes).values({
        userId: seeker.id,
        secretWord: "beta",
        systemPrompt: "Beta desc",
        defenseLevel: 1
    }).returning())[0];

    console.log(`Created Setup: Owner(${owner.id}), Seeker(${seeker.id}), Safes: ${safe1.id}(Owner), ${safe2.id}(Seeker)`);

    try {
        // 1. Test getUserProfile
        console.log("\n1. Testing getUserProfile (Owner)...");
        const profile = await getUserProfile(owner.id);
        if (profile && profile.username === owner.username && profile.safes && profile.safes.length >= 1) {
            console.log("   ✅ Profile loaded with safes.");
        } else {
            console.log("   ❌ Profile mismatch or no safes.", profile);
        }

        // 2. Test getUserSafes
        console.log("\n2. Testing getUserSafes (Owner)...");
        const userSafes = await getUserSafes(owner.id);
        if (userSafes.length === 1 && userSafes[0].id === safe1.id) {
            console.log("   ✅ Correct safes returned.");
        } else {
            console.log(`   ❌ Mismatch. Found ${userSafes.length} safes.`);
        }

        // 3. Test getSafeById
        console.log("\n3. Testing getSafeById (Safe 1)...");
        const loadedSafe = await getSafeById(safe1.id);
        if (loadedSafe && loadedSafe.secretWord === "alpha" && loadedSafe.user!.username === owner.username) {
            console.log("   ✅ Safe loaded correctly with Owner.");
        } else {
            console.log("   ❌ Safe load failed.", loadedSafe);
        }

        // 4. Test getAvailableSafes (For Seeker)
        // Should see Safe 1 (Owner's). Should NOT see Safe 2 (Own).
        console.log("\n4. Testing getAvailableSafes (For Seeker)...");
        const available = await getAvailableSafes(seeker.id);

        const seesSafe1 = available.some(s => s.id === safe1.id);
        const seesSafe2 = available.some(s => s.id === safe2.id);

        if (seesSafe1) {
            console.log("   ✅ Correctly sees Safe 1 (Target).");
        } else {
            console.log("   ❌ Failed to see Safe 1.");
        }

        if (!seesSafe2) {
            console.log("   ✅ Correctly ignores Safe 2 (Own).");
        } else {
            console.log("   ❌ Incorrectly sees Safe 2 (Own).");
        }

        // 5. Test exclusion of cracked safes
        // Seeker cracks Safe 1
        await db.insert(unlockedSafes).values({ userId: seeker.id, safeId: safe1.id });

        const availableAfterCrack = await getAvailableSafes(seeker.id);
        const seesSafe1After = availableAfterCrack.some(s => s.id === safe1.id);

        if (!seesSafe1After) {
            console.log("   ✅ Correctly hides cracked Safe 1.");
        } else {
            console.log("   ❌ Failed to hide cracked Safe 1.");
            // Note: If RPC logic allows re-playing system safes, need to check tier. Owner is 'novato', so should be hidden.
        }

    } catch (e) {
        console.error("Test Error:", e);
    } finally {
        // Cleanup
        await db.delete(safes).where(eq(safes.userId, owner.id));
        await db.delete(safes).where(eq(safes.userId, seeker.id));
        await db.delete(users).where(eq(users.id, owner.id));
        await db.delete(users).where(eq(users.id, seeker.id));
        console.log("\n🧹 Cleanup done.");
        process.exit(0);
    }
}

testReadActions();
