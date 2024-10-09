'use server'

import { db } from '@/lib/db';
import { programs } from '@/lib/schema';
import { revalidatePath } from 'next/cache';

export async function addProgram(data: any) {
        try {
                await db.insert(programs).values(data);
                revalidatePath('/add-program');
                return { success: true };
        } catch (error) {
                console.error('Error adding program:', error);
                return { success: false, error: 'Failed to add program' };
        }
}
