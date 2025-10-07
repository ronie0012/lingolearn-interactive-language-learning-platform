import { db } from '@/db';
import { quizResults } from '@/db/schema';

async function main() {
    const now = new Date();
    
    const getDateDaysAgo = (daysAgo: number): Date => {
        const date = new Date(now);
        date.setDate(date.getDate() - daysAgo);
        return date;
    };

    const sampleQuizResults = [
        // Maria Garcia (user_1) - Spanish quizzes (14 total)
        // Vocabulary quizzes (8)
        {
            userId: 'user_1',
            languageCode: 'es',
            quizType: 'vocabulary',
            score: 10,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(28),
        },
        {
            userId: 'user_1',
            languageCode: 'es',
            quizType: 'vocabulary',
            score: 9,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(25),
        },
        {
            userId: 'user_1',
            languageCode: 'es',
            quizType: 'vocabulary',
            score: 10,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(22),
        },
        {
            userId: 'user_1',
            languageCode: 'es',
            quizType: 'vocabulary',
            score: 8,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(19),
        },
        {
            userId: 'user_1',
            languageCode: 'es',
            quizType: 'vocabulary',
            score: 9,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(16),
        },
        {
            userId: 'user_1',
            languageCode: 'es',
            quizType: 'vocabulary',
            score: 10,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(13),
        },
        {
            userId: 'user_1',
            languageCode: 'es',
            quizType: 'vocabulary',
            score: 9,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(8),
        },
        {
            userId: 'user_1',
            languageCode: 'es',
            quizType: 'vocabulary',
            score: 10,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(3),
        },
        // Grammar quizzes (4)
        {
            userId: 'user_1',
            languageCode: 'es',
            quizType: 'grammar',
            score: 8,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(26),
        },
        {
            userId: 'user_1',
            languageCode: 'es',
            quizType: 'grammar',
            score: 7,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(20),
        },
        {
            userId: 'user_1',
            languageCode: 'es',
            quizType: 'grammar',
            score: 9,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(12),
        },
        {
            userId: 'user_1',
            languageCode: 'es',
            quizType: 'grammar',
            score: 8,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(5),
        },
        // Listening quizzes (2)
        {
            userId: 'user_1',
            languageCode: 'es',
            quizType: 'listening',
            score: 9,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(15),
        },
        {
            userId: 'user_1',
            languageCode: 'es',
            quizType: 'listening',
            score: 8,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(7),
        },

        // Maria Garcia (user_1) - French quizzes (7 total)
        // Vocabulary quizzes (4)
        {
            userId: 'user_1',
            languageCode: 'fr',
            quizType: 'vocabulary',
            score: 7,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(18),
        },
        {
            userId: 'user_1',
            languageCode: 'fr',
            quizType: 'vocabulary',
            score: 8,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(14),
        },
        {
            userId: 'user_1',
            languageCode: 'fr',
            quizType: 'vocabulary',
            score: 6,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(9),
        },
        {
            userId: 'user_1',
            languageCode: 'fr',
            quizType: 'vocabulary',
            score: 7,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(4),
        },
        // Grammar quizzes (2)
        {
            userId: 'user_1',
            languageCode: 'fr',
            quizType: 'grammar',
            score: 6,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(16),
        },
        {
            userId: 'user_1',
            languageCode: 'fr',
            quizType: 'grammar',
            score: 7,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(6),
        },
        // Listening quiz (1)
        {
            userId: 'user_1',
            languageCode: 'fr',
            quizType: 'listening',
            score: 6,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(11),
        },

        // John Smith (user_2) - Japanese quizzes (5 total)
        // Vocabulary quizzes (3)
        {
            userId: 'user_2',
            languageCode: 'ja',
            quizType: 'vocabulary',
            score: 6,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(13),
        },
        {
            userId: 'user_2',
            languageCode: 'ja',
            quizType: 'vocabulary',
            score: 7,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(9),
        },
        {
            userId: 'user_2',
            languageCode: 'ja',
            quizType: 'vocabulary',
            score: 5,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(4),
        },
        // Grammar quizzes (2)
        {
            userId: 'user_2',
            languageCode: 'ja',
            quizType: 'grammar',
            score: 5,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(11),
        },
        {
            userId: 'user_2',
            languageCode: 'ja',
            quizType: 'grammar',
            score: 6,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(6),
        },

        // John Smith (user_2) - Spanish quizzes (10 total)
        // Vocabulary quizzes (6)
        {
            userId: 'user_2',
            languageCode: 'es',
            quizType: 'vocabulary',
            score: 8,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(24),
        },
        {
            userId: 'user_2',
            languageCode: 'es',
            quizType: 'vocabulary',
            score: 7,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(21),
        },
        {
            userId: 'user_2',
            languageCode: 'es',
            quizType: 'vocabulary',
            score: 9,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(18),
        },
        {
            userId: 'user_2',
            languageCode: 'es',
            quizType: 'vocabulary',
            score: 8,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(14),
        },
        {
            userId: 'user_2',
            languageCode: 'es',
            quizType: 'vocabulary',
            score: 7,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(10),
        },
        {
            userId: 'user_2',
            languageCode: 'es',
            quizType: 'vocabulary',
            score: 8,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(5),
        },
        // Grammar quizzes (3)
        {
            userId: 'user_2',
            languageCode: 'es',
            quizType: 'grammar',
            score: 7,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(22),
        },
        {
            userId: 'user_2',
            languageCode: 'es',
            quizType: 'grammar',
            score: 8,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(16),
        },
        {
            userId: 'user_2',
            languageCode: 'es',
            quizType: 'grammar',
            score: 6,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(8),
        },
        // Listening quiz (1)
        {
            userId: 'user_2',
            languageCode: 'es',
            quizType: 'listening',
            score: 7,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(12),
        },

        // Yuki Tanaka (user_3) - French quizzes (12 total)
        // Vocabulary quizzes (7)
        {
            userId: 'user_3',
            languageCode: 'fr',
            quizType: 'vocabulary',
            score: 9,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(38),
        },
        {
            userId: 'user_3',
            languageCode: 'fr',
            quizType: 'vocabulary',
            score: 10,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(34),
        },
        {
            userId: 'user_3',
            languageCode: 'fr',
            quizType: 'vocabulary',
            score: 8,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(29),
        },
        {
            userId: 'user_3',
            languageCode: 'fr',
            quizType: 'vocabulary',
            score: 10,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(24),
        },
        {
            userId: 'user_3',
            languageCode: 'fr',
            quizType: 'vocabulary',
            score: 9,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(18),
        },
        {
            userId: 'user_3',
            languageCode: 'fr',
            quizType: 'vocabulary',
            score: 8,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(11),
        },
        {
            userId: 'user_3',
            languageCode: 'fr',
            quizType: 'vocabulary',
            score: 10,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(5),
        },
        // Grammar quizzes (3)
        {
            userId: 'user_3',
            languageCode: 'fr',
            quizType: 'grammar',
            score: 8,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(32),
        },
        {
            userId: 'user_3',
            languageCode: 'fr',
            quizType: 'grammar',
            score: 9,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(21),
        },
        {
            userId: 'user_3',
            languageCode: 'fr',
            quizType: 'grammar',
            score: 7,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(9),
        },
        // Listening quizzes (2)
        {
            userId: 'user_3',
            languageCode: 'fr',
            quizType: 'listening',
            score: 9,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(26),
        },
        {
            userId: 'user_3',
            languageCode: 'fr',
            quizType: 'listening',
            score: 8,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(14),
        },

        // Yuki Tanaka (user_3) - Spanish quizzes (8 total)
        // Vocabulary quizzes (5)
        {
            userId: 'user_3',
            languageCode: 'es',
            quizType: 'vocabulary',
            score: 8,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(27),
        },
        {
            userId: 'user_3',
            languageCode: 'es',
            quizType: 'vocabulary',
            score: 7,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(23),
        },
        {
            userId: 'user_3',
            languageCode: 'es',
            quizType: 'vocabulary',
            score: 8,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(19),
        },
        {
            userId: 'user_3',
            languageCode: 'es',
            quizType: 'vocabulary',
            score: 7,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(13),
        },
        {
            userId: 'user_3',
            languageCode: 'es',
            quizType: 'vocabulary',
            score: 8,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(6),
        },
        // Grammar quizzes (2)
        {
            userId: 'user_3',
            languageCode: 'es',
            quizType: 'grammar',
            score: 7,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(20),
        },
        {
            userId: 'user_3',
            languageCode: 'es',
            quizType: 'grammar',
            score: 8,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(10),
        },
        // Listening quiz (1)
        {
            userId: 'user_3',
            languageCode: 'es',
            quizType: 'listening',
            score: 7,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(15),
        },

        // Yuki Tanaka (user_3) - German quizzes (4 total)
        // Vocabulary quizzes (3)
        {
            userId: 'user_3',
            languageCode: 'de',
            quizType: 'vocabulary',
            score: 6,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(9),
        },
        {
            userId: 'user_3',
            languageCode: 'de',
            quizType: 'vocabulary',
            score: 7,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(6),
        },
        {
            userId: 'user_3',
            languageCode: 'de',
            quizType: 'vocabulary',
            score: 5,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(2),
        },
        // Grammar quiz (1)
        {
            userId: 'user_3',
            languageCode: 'de',
            quizType: 'grammar',
            score: 5,
            totalQuestions: 10,
            completedAt: getDateDaysAgo(4),
        },
    ];

    await db.insert(quizResults).values(sampleQuizResults);
    
    console.log('✅ Quiz results seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});