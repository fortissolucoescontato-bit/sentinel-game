
import { execSync } from "child_process";

const testFiles = [
    "test_moderation.ts",
    "test_daily_reward.ts",
    "test_safe_management.ts",
    "test_hack_mechanics.ts",
    "test_leaderboard.ts",
    "test_read_actions.ts",
    "test_history_and_rank.ts",
    "test_official_safes.ts",
    "test_tier_upgrades.ts",
    "test_ratelimit.ts",
    "test_shop.ts"
];

console.log("🚀 RUNNING ALL SYSTEM TESTS...\n");

let passed = 0;
let failed = 0;

for (const file of testFiles) {
    process.stdout.write(`Running ${file}... `);
    try {
        execSync(`npx tsx tests/${file}`, { stdio: 'pipe' });
        console.log("✅ PASS");
        passed++;
    } catch (e) {
        console.log("❌ FAIL");
        failed++;
    }
}

console.log(`\nDONE. Passed: ${passed}, Failed: ${failed}`);
if (failed > 0) process.exit(1);
process.exit(0);
