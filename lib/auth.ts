import { auth, currentUser } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

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
    const { data: existingUser, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('clerk_id', clerkId)
        .single();

    if (findError && findError.code !== 'PGRST116') { // PGRST116 is "Relation expected 1 row, but got 0" (Not Found)
        console.error("Error finding user by Clerk ID:", findError);
    }

    // Helper to map DB user to App user (camelCase)
    const mapUser = (u: any) => ({
        ...u,
        clerkId: u.clerk_id,
        stylePoints: u.style_points,
        unlockedThemes: u.unlocked_themes,
        currentTheme: u.current_theme,
        createdAt: u.created_at,
        updatedAt: u.updated_at,
    });

    if (existingUser) {
        return mapUser(existingUser);
    }

    // 2. Also check if user exists by email (for legacy users or manual creations)
    const email = user.emailAddresses[0]?.emailAddress;
    if (email) {
        const { data: existingUserByEmail, error: emailFindError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (existingUserByEmail) {
            // Link the existing user to this Clerk ID
            const { error: updateError } = await supabase
                .from('users')
                .update({ clerk_id: clerkId })
                .eq('id', existingUserByEmail.id);

            if (updateError) {
                console.error("Error linking user to Clerk ID:", updateError);
            }

            return mapUser({ ...existingUserByEmail, clerk_id: clerkId });
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

        const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
                clerk_id: clerkId,
                email: email || `no-email-${clerkId}@example.com`,
                username: username.slice(0, 99), // Ensure it fits
                credits: 1000,
                tier: "free",
                unlocked_themes: ['dracula'],
                current_theme: 'dracula',
                style_points: 0, // Explicit initialization
            })
            .select()
            .single();

        if (createError) {
            console.error("Error creating user:", createError);
            return null;
        }

        return mapUser(newUser);
    } catch (error) {
        console.error("Error creating user in DB:", error);
        return null;
    }
}
