import { db } from '@/db';
import { user } from '@/db/schema';

async function main() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const fortyFiveDaysAgo = new Date();
    fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);
    
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const sampleUsers = [
        {
            id: 'user_1',
            name: 'Maria Garcia',
            email: 'maria@example.com',
            emailVerified: true,
            image: null,
            createdAt: thirtyDaysAgo,
            updatedAt: thirtyDaysAgo,
        },
        {
            id: 'user_2',
            name: 'John Smith',
            email: 'john@example.com',
            emailVerified: true,
            image: null,
            createdAt: fortyFiveDaysAgo,
            updatedAt: fortyFiveDaysAgo,
        },
        {
            id: 'user_3',
            name: 'Yuki Tanaka',
            email: 'yuki@example.com',
            emailVerified: true,
            image: null,
            createdAt: sixtyDaysAgo,
            updatedAt: sixtyDaysAgo,
        },
    ];

    await db.insert(user).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});