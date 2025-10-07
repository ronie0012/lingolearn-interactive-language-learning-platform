import { db } from '@/db';
import { userProgress } from '@/db/schema';

async function main() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const fortyFiveDaysAgo = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const sampleUserProgress = [
        {
            userId: 'user_1',
            languageCode: 'es',
            wordsLearned: 185,
            lessonsCompleted: 28,
            quizzesPassed: 14,
            currentStreak: 12,
            lastPracticeDate: oneDayAgo,
            createdAt: sixtyDaysAgo,
            updatedAt: oneDayAgo,
        },
        {
            userId: 'user_1',
            languageCode: 'fr',
            wordsLearned: 92,
            lessonsCompleted: 15,
            quizzesPassed: 7,
            currentStreak: 5,
            lastPracticeDate: twoDaysAgo,
            createdAt: fortyFiveDaysAgo,
            updatedAt: twoDaysAgo,
        },
        {
            userId: 'user_2',
            languageCode: 'ja',
            wordsLearned: 67,
            lessonsCompleted: 12,
            quizzesPassed: 5,
            currentStreak: 3,
            lastPracticeDate: oneDayAgo,
            createdAt: thirtyDaysAgo,
            updatedAt: oneDayAgo,
        },
        {
            userId: 'user_2',
            languageCode: 'es',
            wordsLearned: 134,
            lessonsCompleted: 22,
            quizzesPassed: 10,
            currentStreak: 8,
            lastPracticeDate: now,
            createdAt: fortyFiveDaysAgo,
            updatedAt: now,
        },
        {
            userId: 'user_3',
            languageCode: 'fr',
            wordsLearned: 156,
            lessonsCompleted: 25,
            quizzesPassed: 12,
            currentStreak: 15,
            lastPracticeDate: now,
            createdAt: sixtyDaysAgo,
            updatedAt: now,
        },
        {
            userId: 'user_3',
            languageCode: 'es',
            wordsLearned: 98,
            lessonsCompleted: 18,
            quizzesPassed: 8,
            currentStreak: 6,
            lastPracticeDate: oneDayAgo,
            createdAt: fortyFiveDaysAgo,
            updatedAt: oneDayAgo,
        },
        {
            userId: 'user_3',
            languageCode: 'de',
            wordsLearned: 52,
            lessonsCompleted: 10,
            quizzesPassed: 4,
            currentStreak: 2,
            lastPracticeDate: threeDaysAgo,
            createdAt: thirtyDaysAgo,
            updatedAt: threeDaysAgo,
        },
    ];

    await db.insert(userProgress).values(sampleUserProgress);
    
    console.log('✅ User progress seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});