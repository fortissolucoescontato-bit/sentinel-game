
import { db } from "../db";
import { users, safes } from "../db/schema";
import { createSafe, updateSafeDefense } from "../actions/user";
import { eq } from "drizzle-orm";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function testSafeManagement() {
    console.log("🛡️ TESTING SAFE MANAGEMENT...\n");

    const testTimestamp = Date.now();

    // 1. Create User with Credits (Enough for Level 1 safe = 500)
    const username = `builder_${testTimestamp}`;
    const [user] = await db.insert(users).values({
        clerkId: `builder_clerk_${testTimestamp}`,
        username: username,
        email: `builder_${testTimestamp}@example.com`,
        credits: 1000,
        tier: 'novato'
    }).returning();

    console.log(`1. Created User: ${user.username} (Credits: 1000)`);

    try {
        // 2. Create Safe (Success)
        console.log("2. Creating Safe (Level 1)...");
        const safe = await createSafe(
            user.id,
            "banana",
            "You are a minion.",
            1,
            "dracula"
        );

        console.log(`   ✅ Created Safe ID: ${safe.id}`);

        // Verify Credit Deduction
        const updatedUser = await db.query.users.findFirst({ where: eq(users.id, user.id) });
        if (updatedUser?.credits === 500) {
            console.log(`   ✅ Credits Deducted: 1000 -> 500`);
        } else {
            console.log(`   ❌ Credit Deduction Failed! Expected 500, got ${updatedUser?.credits}`);
        }

        // 3. Create Safe (Fail - Insufficient Credits)
        // User has 500. Level 2 costs 800.
        console.log("3. Creating Safe (Level 2 - Should Fail)...");
        try {
            await createSafe(
                user.id,
                "apple",
                "Startrek",
                2
            );
            console.log("   ❌ Failed to reject insufficient credits!");
        } catch (e: any) {
            if (e.message.includes("Créditos insuficientes")) {
                console.log("   ✅ Correctly rejected: Insufficient credits.");
            } else {
                console.log(`   ❌ Wrong error message: ${e.message}`);
            }
        }

        // 4. Update Safe Defense
        console.log("4. Updating Safe Defense...");
        const updatedSafe = await updateSafeDefense(safe.id, "You are a Borg.", 2);

        // Check DB
        const dbSafe = await db.query.safes.findFirst({ where: eq(safes.id, safe.id) });

        if (dbSafe?.systemPrompt === "You are a Borg." && dbSafe.defenseLevel === 2) {
            console.log("   ✅ Safe Updated Successfully.");
        } else {
            console.log("   ❌ Update Failed!");
        }

        // 5. Create Safe (Fail - Invalid Inputs)
        console.log("5. Creating Safe (Invalid Inputs)...");
        try {
            await createSafe(user.id, "", "prompt", 1);
            console.log("   ❌ Failed to reject empty password!");
        } catch (e: any) {
            console.log("   ✅ Correctly rejected empty password.");
        }

    } catch (e) {
        console.error("Test Error:", e);
    } finally {
        // Cleanup
        console.log("\n🧹 Cleanup...");
        await db.delete(safes).where(eq(safes.userId, user.id));
        await db.delete(users).where(eq(users.id, user.id));
        console.log("Done.");
        process.exit(0);
    }
}

testSafeManagement();
