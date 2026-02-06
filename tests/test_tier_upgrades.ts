
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { GAME_CONFIG } from "../lib/game-config";

async function testTierUpgrades() {
    console.log("🆙 TESTING TIER UPGRADE LOGIC...\n");

    const now = Date.now();
    const [user] = await db.insert(users).values({
        clerkId: `tieruser_${now}`,
        email: `tier_${now}@test.com`,
        username: `tieruser_${now}`,
        credits: 4950, // Just below Novato limit (5000)
        tier: 'novato'
    }).returning();

    console.log(`User created with ${user.credits} credits, tier: ${user.tier}`);

    try {
        const { hackSafeCore } = await import("../actions/hack");

        // We'll mock a success manually or just assume we want to see if tier changes
        // after credits pass 5000.
        // Actually, let's create a fake success log directly or call the core action
        // with a simple mock if needed, but the core action calls Groq.

        // Let's just update credits manually and see if we HAVE a function to check/update tier.
        // If not, this test proves we need one.

        console.log("\nClaiming Daily Reward (50 credits)... Should push user to 5000 (PRO)...");
        const { claimDailyReward } = await import("../actions/user");
        await claimDailyReward(user.id);

        const updatedUser = await db.query.users.findFirst({ where: eq(users.id, user.id) });
        console.log(`Updated User: Credits=${updatedUser?.credits}, Tier=${updatedUser?.tier}`);

        if (updatedUser?.tier === 'pro') {
            console.log("   ✅ Tier upgraded to PRO automatically.");
        } else {
            console.log(`   ❌ Tier remained ${updatedUser?.tier}. Automatic upgrade failed!`);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await db.delete(users).where(eq(users.id, user.id));
        console.log("\n🧹 Cleanup done.");
        process.exit(0);
    }
}

testTierUpgrades();
