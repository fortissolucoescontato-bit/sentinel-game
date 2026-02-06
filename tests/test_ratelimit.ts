
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../db";
import { users, logs } from "../db/schema";
import { eq } from "drizzle-orm";

async function testRateLimit() {
    // Dynamic import to avoid env issues
    const { checkRateLimit } = await import("../lib/ratelimit");

    console.log("⏳ TESTING RATE LIMITING SYSTEM...\n");

    const now = Date.now();
    const [user] = await db.insert(users).values({
        clerkId: `rate_${now}`,
        email: `rate_${now}@test.com`,
        username: `rateuser_${now}`,
        credits: 1000,
        tier: 'novato'
    }).returning();

    console.log(`Created test user: ${user.username}`);

    try {
        // 1. Initial State: Should be allowed
        console.log("1. Checking initial state...");
        const res1 = await checkRateLimit(user.id);
        if (res1.success) {
            console.log("   ✅ Allowed (0 logs)");
        } else {
            console.log("   ❌ Rejected incorrectly!");
        }

        // 2. Fill the quota (10 requests)
        console.log("2. Simulating 10 attacks...");
        // Max is 10 per minute.
        const fakeLogs = Array.from({ length: 10 }).map(() => ({
            attackerId: user.id,
            defenderId: user.id, // self-attack for logs
            inputPrompt: "rate test",
            aiResponse: "rate test",
            success: false,
            creditsSpent: 10
        }));

        await db.insert(logs).values(fakeLogs);

        // 3. Checking state after quota
        console.log("3. Checking after 10 logs...");
        const res2 = await checkRateLimit(user.id);
        if (!res2.success) {
            console.log(`   ✅ Correctly Rejected. Retry after: ${res2.retryAfter}s`);
        } else {
            console.log("   ❌ Allowed incorrectly after 10 requests!");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await db.delete(logs).where(eq(logs.attackerId, user.id));
        await db.delete(users).where(eq(users.id, user.id));
        console.log("\n🧹 Cleanup done.");
        process.exit(0);
    }
}

testRateLimit();
