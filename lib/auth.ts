import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Gets the current authenticated user from the database.
 * If the user exists in Clerk but not in DB, creates the user in DB.
 */
export async function getServerSideUser() {
    const { userId: clerkId } = await auth();
    const user = await currentUser();

    if (!clerkId || !user) {
        return null;
    }

    // 1. Check if user exists in DB by Clerk ID
    const existingUser = await db.query.users.findFirst({
        where: eq(users.clerkId, clerkId),
    });

    if (existingUser) {
        return existingUser;
    }

    // 2. Also check if user exists by email (for legacy users or manual creations)
    const email = user.emailAddresses[0]?.emailAddress;
    if (email) {
        const existingUserByEmail = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUserByEmail) {
            // Link the existing user to this Clerk ID
            await db.update(users)
                .set({ clerkId: clerkId })
                .where(eq(users.id, existingUserByEmail.id));

            return { ...existingUserByEmail, clerkId };
        }
    }

    // 3. Create new user if not found
    try {
        let username = user.username;
        if (!username) {
            // Generate username from email or random
            const base = email ? email.split("@")[0] : "Hacker";
            username = `${base}_${Math.floor(Math.random() * 1000)}`;
        }

        const [newUser] = await db
            .insert(users)
            .values({
                clerkId,
                email: email || `no-email-${clerkId}@example.com`,
                username: username.slice(0, 99), // Ensure it fits
                credits: 1000,
                tier: "free",
            })
            .returning();

        return newUser;
    } catch (error) {
        console.error("Error creating user in DB:", error);
        return null;
    }
}
