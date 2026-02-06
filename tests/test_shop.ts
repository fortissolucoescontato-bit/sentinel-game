
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { THEMES } from "../lib/themes";

async function testShop() {
    console.log("🛒 TESTING SHOP SYSTEM...\n");

    const now = Date.now();
    const [user] = await db.insert(users).values({
        clerkId: `shopper_${now}`,
        email: `shop_${now}@test.com`,
        username: `shopper_${now}`,
        credits: 5000,
        stylePoints: 1000,
        tier: 'novato',
        unlockedThemes: ['dracula']
    }).returning();

    console.log(`Created test shopper: ${user.username} (5000 CR, 1000 SP)`);

    try {
        const { buyThemeCore, equipThemeCore } = await import("../actions/shop");

        // 1. Buy a cheap theme (assuming 'matrix' exists and is cheap enough)
        const themeId = 'matrix';
        const theme = THEMES[themeId as keyof typeof THEMES];

        if (!theme) {
            console.log("   ⚠️ Theme 'matrix' not found in config, skipping purchase test.");
        } else {
            console.log(`1. Attempting to buy '${themeId}' (Cost: ${theme.priceCredits} CR, ${theme.priceStylePoints} SP)...`);
            const res1 = await buyThemeCore(user, themeId);

            if (res1.success) {
                console.log("   ✅ Purchase successful.");
                const updated = await db.query.users.findFirst({ where: eq(users.id, user.id) });
                if (updated?.unlockedThemes.includes(themeId)) {
                    console.log("   ✅ Theme added to unlocked list.");
                } else {
                    console.log("   ❌ Theme NOT found in unlocked list!");
                }
            } else {
                console.log(`   ❌ Purchase failed: ${res1.error}`);
            }

            // 2. Buy again (should fail)
            console.log(`2. Attempting to buy '${themeId}' again...`);
            // Update user object locally for the test
            const userWithTheme = { ...user, unlockedThemes: [...user.unlockedThemes, themeId] };
            const res2 = await buyThemeCore(userWithTheme, themeId);
            if (res2.error === "Você já possui este tema") {
                console.log("   ✅ Correctly blocked duplicate purchase.");
            } else {
                console.log(`   ❌ Error mismatch: ${res2.error}`);
            }

            // 3. Equip Theme
            console.log(`3. Attempting to equip '${themeId}'...`);
            const res3 = await equipThemeCore(userWithTheme, themeId);
            if (res3.success) {
                console.log("   ✅ Equip successful.");
                const updated = await db.query.users.findFirst({ where: eq(users.id, user.id) });
                if (updated?.currentTheme === themeId) {
                    console.log("   ✅ DB updated correctly.");
                } else {
                    console.log(`   ❌ DB currentTheme mismatch: ${updated?.currentTheme}`);
                }
            } else {
                console.log(`   ❌ Equip failed: ${res3.error}`);
            }
        }

        // 4. Try to buy expensive theme (Insufficient funds)
        console.log("\n4. Testing insufficient funds...");
        // Set funds to 10
        await db.update(users).set({ credits: 10, stylePoints: 0 }).where(eq(users.id, user.id));
        const poorUser = { ...user, credits: 10, stylePoints: 0 };
        const res4 = await buyThemeCore(poorUser, 'synthwave'); // synthwave costs 1000
        if (res4.error?.includes("insuficientes")) {
            console.log("   ✅ Correctly rejected (Insufficient Credits).");
        } else {
            console.log(`   ❌ Rejection failed or wrong error: ${res4.error}`);
        }

    } catch (e) {
        console.error(e);
    } finally {
        await db.delete(users).where(eq(users.id, user.id));
        console.log("\n🧹 Cleanup done.");
        process.exit(0);
    }
}

testShop();
