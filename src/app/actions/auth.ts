import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function checkEmailExists(email: string): Promise<boolean> {
    // Lazy load db only when function is called
    const { db } = await import('@/db');
    const existingUser = await db.select()
        .from(user)
        .where(eq(user.email, email))
        .limit(1);

    return existingUser.length > 0;
}
