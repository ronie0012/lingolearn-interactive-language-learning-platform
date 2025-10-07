import { db } from '@/db';
import { learnedVocabulary } from '@/db/schema';

async function main() {
    const now = new Date();
    
    // Helper function to get date X days ago
    const daysAgo = (days: number) => {
        const date = new Date(now);
        date.setDate(date.getDate() - days);
        return date;
    };

    const sampleVocabulary = [
        // Maria Garcia (user_1) - Spanish (20 words, last 30 days)
        { userId: 'user_1', languageCode: 'es', word: 'hola', translation: 'hello', learnedAt: daysAgo(30), timesReviewed: 5 },
        { userId: 'user_1', languageCode: 'es', word: 'gracias', translation: 'thank you', learnedAt: daysAgo(28), timesReviewed: 5 },
        { userId: 'user_1', languageCode: 'es', word: 'adiós', translation: 'goodbye', learnedAt: daysAgo(27), timesReviewed: 4 },
        { userId: 'user_1', languageCode: 'es', word: 'por favor', translation: 'please', learnedAt: daysAgo(25), timesReviewed: 4 },
        { userId: 'user_1', languageCode: 'es', word: 'ordenador', translation: 'computer', learnedAt: daysAgo(23), timesReviewed: 4 },
        { userId: 'user_1', languageCode: 'es', word: 'trabajo', translation: 'work', learnedAt: daysAgo(21), timesReviewed: 3 },
        { userId: 'user_1', languageCode: 'es', word: 'desarrollar', translation: 'to develop', learnedAt: daysAgo(19), timesReviewed: 3 },
        { userId: 'user_1', languageCode: 'es', word: 'imprescindible', translation: 'essential', learnedAt: daysAgo(17), timesReviewed: 3 },
        { userId: 'user_1', languageCode: 'es', word: 'proyecto', translation: 'project', learnedAt: daysAgo(15), timesReviewed: 2 },
        { userId: 'user_1', languageCode: 'es', word: 'empresa', translation: 'company', learnedAt: daysAgo(13), timesReviewed: 2 },
        { userId: 'user_1', languageCode: 'es', word: 'reunión', translation: 'meeting', learnedAt: daysAgo(12), timesReviewed: 2 },
        { userId: 'user_1', languageCode: 'es', word: 'documento', translation: 'document', learnedAt: daysAgo(10), timesReviewed: 2 },
        { userId: 'user_1', languageCode: 'es', word: 'aplicación', translation: 'application', learnedAt: daysAgo(8), timesReviewed: 1 },
        { userId: 'user_1', languageCode: 'es', word: 'tecnología', translation: 'technology', learnedAt: daysAgo(7), timesReviewed: 1 },
        { userId: 'user_1', languageCode: 'es', word: 'colaborar', translation: 'to collaborate', learnedAt: daysAgo(6), timesReviewed: 1 },
        { userId: 'user_1', languageCode: 'es', word: 'innovación', translation: 'innovation', learnedAt: daysAgo(5), timesReviewed: 1 },
        { userId: 'user_1', languageCode: 'es', word: 'estrategia', translation: 'strategy', learnedAt: daysAgo(4), timesReviewed: 0 },
        { userId: 'user_1', languageCode: 'es', word: 'objetivo', translation: 'objective', learnedAt: daysAgo(3), timesReviewed: 0 },
        { userId: 'user_1', languageCode: 'es', word: 'resultado', translation: 'result', learnedAt: daysAgo(2), timesReviewed: 0 },
        { userId: 'user_1', languageCode: 'es', word: 'eficiencia', translation: 'efficiency', learnedAt: daysAgo(1), timesReviewed: 0 },

        // Maria Garcia (user_1) - French (15 words, last 20 days)
        { userId: 'user_1', languageCode: 'fr', word: 'bonjour', translation: 'hello', learnedAt: daysAgo(20), timesReviewed: 3 },
        { userId: 'user_1', languageCode: 'fr', word: 'merci', translation: 'thank you', learnedAt: daysAgo(19), timesReviewed: 3 },
        { userId: 'user_1', languageCode: 'fr', word: 'au revoir', translation: 'goodbye', learnedAt: daysAgo(18), timesReviewed: 3 },
        { userId: 'user_1', languageCode: 'fr', word: 'ordinateur', translation: 'computer', learnedAt: daysAgo(16), timesReviewed: 2 },
        { userId: 'user_1', languageCode: 'fr', word: 'apprendre', translation: 'to learn', learnedAt: daysAgo(15), timesReviewed: 2 },
        { userId: 'user_1', languageCode: 'fr', word: 'difficile', translation: 'difficult', learnedAt: daysAgo(13), timesReviewed: 2 },
        { userId: 'user_1', languageCode: 'fr', word: 'travail', translation: 'work', learnedAt: daysAgo(12), timesReviewed: 2 },
        { userId: 'user_1', languageCode: 'fr', word: 'projet', translation: 'project', learnedAt: daysAgo(10), timesReviewed: 1 },
        { userId: 'user_1', languageCode: 'fr', word: 'équipe', translation: 'team', learnedAt: daysAgo(9), timesReviewed: 1 },
        { userId: 'user_1', languageCode: 'fr', word: 'réunion', translation: 'meeting', learnedAt: daysAgo(8), timesReviewed: 1 },
        { userId: 'user_1', languageCode: 'fr', word: 'important', translation: 'important', learnedAt: daysAgo(6), timesReviewed: 1 },
        { userId: 'user_1', languageCode: 'fr', word: 'comprendre', translation: 'to understand', learnedAt: daysAgo(5), timesReviewed: 0 },
        { userId: 'user_1', languageCode: 'fr', word: 'solution', translation: 'solution', learnedAt: daysAgo(4), timesReviewed: 0 },
        { userId: 'user_1', languageCode: 'fr', word: 'développer', translation: 'to develop', learnedAt: daysAgo(2), timesReviewed: 0 },
        { userId: 'user_1', languageCode: 'fr', word: 'efficace', translation: 'efficient', learnedAt: daysAgo(1), timesReviewed: 0 },

        // John Smith (user_2) - Japanese (12 words, last 15 days)
        { userId: 'user_2', languageCode: 'ja', word: 'konnichiwa', translation: 'hello', learnedAt: daysAgo(15), timesReviewed: 2 },
        { userId: 'user_2', languageCode: 'ja', word: 'arigatou', translation: 'thank you', learnedAt: daysAgo(14), timesReviewed: 2 },
        { userId: 'user_2', languageCode: 'ja', word: 'sayounara', translation: 'goodbye', learnedAt: daysAgo(13), timesReviewed: 2 },
        { userId: 'user_2', languageCode: 'ja', word: 'sensei', translation: 'teacher', learnedAt: daysAgo(12), timesReviewed: 2 },
        { userId: 'user_2', languageCode: 'ja', word: 'benkyou', translation: 'study', learnedAt: daysAgo(10), timesReviewed: 1 },
        { userId: 'user_2', languageCode: 'ja', word: 'nihongo', translation: 'Japanese language', learnedAt: daysAgo(9), timesReviewed: 1 },
        { userId: 'user_2', languageCode: 'ja', word: 'hon', translation: 'book', learnedAt: daysAgo(8), timesReviewed: 1 },
        { userId: 'user_2', languageCode: 'ja', word: 'gakkou', translation: 'school', learnedAt: daysAgo(7), timesReviewed: 1 },
        { userId: 'user_2', languageCode: 'ja', word: 'tomodachi', translation: 'friend', learnedAt: daysAgo(5), timesReviewed: 0 },
        { userId: 'user_2', languageCode: 'ja', word: 'taberu', translation: 'to eat', learnedAt: daysAgo(4), timesReviewed: 0 },
        { userId: 'user_2', languageCode: 'ja', word: 'neru', translation: 'to sleep', learnedAt: daysAgo(2), timesReviewed: 0 },
        { userId: 'user_2', languageCode: 'ja', word: 'shigoto', translation: 'work', learnedAt: daysAgo(1), timesReviewed: 0 },

        // John Smith (user_2) - Spanish (18 words, last 25 days)
        { userId: 'user_2', languageCode: 'es', word: 'casa', translation: 'house', learnedAt: daysAgo(25), timesReviewed: 4 },
        { userId: 'user_2', languageCode: 'es', word: 'trabajo', translation: 'work', learnedAt: daysAgo(24), timesReviewed: 4 },
        { userId: 'user_2', languageCode: 'es', word: 'amigo', translation: 'friend', learnedAt: daysAgo(22), timesReviewed: 3 },
        { userId: 'user_2', languageCode: 'es', word: 'estudiar', translation: 'to study', learnedAt: daysAgo(21), timesReviewed: 3 },
        { userId: 'user_2', languageCode: 'es', word: 'importante', translation: 'important', learnedAt: daysAgo(19), timesReviewed: 3 },
        { userId: 'user_2', languageCode: 'es', word: 'familia', translation: 'family', learnedAt: daysAgo(18), timesReviewed: 3 },
        { userId: 'user_2', languageCode: 'es', word: 'comida', translation: 'food', learnedAt: daysAgo(16), timesReviewed: 2 },
        { userId: 'user_2', languageCode: 'es', word: 'escuela', translation: 'school', learnedAt: daysAgo(15), timesReviewed: 2 },
        { userId: 'user_2', languageCode: 'es', word: 'libro', translation: 'book', learnedAt: daysAgo(13), timesReviewed: 2 },
        { userId: 'user_2', languageCode: 'es', word: 'aprender', translation: 'to learn', learnedAt: daysAgo(12), timesReviewed: 2 },
        { userId: 'user_2', languageCode: 'es', word: 'nuevo', translation: 'new', learnedAt: daysAgo(10), timesReviewed: 1 },
        { userId: 'user_2', languageCode: 'es', word: 'viejo', translation: 'old', learnedAt: daysAgo(9), timesReviewed: 1 },
        { userId: 'user_2', languageCode: 'es', word: 'grande', translation: 'big', learnedAt: daysAgo(8), timesReviewed: 1 },
        { userId: 'user_2', languageCode: 'es', word: 'pequeño', translation: 'small', learnedAt: daysAgo(7), timesReviewed: 1 },
        { userId: 'user_2', languageCode: 'es', word: 'ciudad', translation: 'city', learnedAt: daysAgo(5), timesReviewed: 0 },
        { userId: 'user_2', languageCode: 'es', word: 'país', translation: 'country', learnedAt: daysAgo(4), timesReviewed: 0 },
        { userId: 'user_2', languageCode: 'es', word: 'mundo', translation: 'world', learnedAt: daysAgo(2), timesReviewed: 0 },
        { userId: 'user_2', languageCode: 'es', word: 'vida', translation: 'life', learnedAt: daysAgo(1), timesReviewed: 0 },

        // Yuki Tanaka (user_3) - French (20 words, last 40 days)
        { userId: 'user_3', languageCode: 'fr', word: 'développement', translation: 'development', learnedAt: daysAgo(40), timesReviewed: 6 },
        { userId: 'user_3', languageCode: 'fr', word: 'nécessaire', translation: 'necessary', learnedAt: daysAgo(38), timesReviewed: 6 },
        { userId: 'user_3', languageCode: 'fr', word: 'entreprise', translation: 'company', learnedAt: daysAgo(36), timesReviewed: 5 },
        { userId: 'user_3', languageCode: 'fr', word: 'comprendre', translation: 'to understand', learnedAt: daysAgo(34), timesReviewed: 5 },
        { userId: 'user_3', languageCode: 'fr', word: 'efficace', translation: 'efficient', learnedAt: daysAgo(32), timesReviewed: 5 },
        { userId: 'user_3', languageCode: 'fr', word: 'stratégie', translation: 'strategy', learnedAt: daysAgo(30), timesReviewed: 4 },
        { userId: 'user_3', languageCode: 'fr', word: 'innovation', translation: 'innovation', learnedAt: daysAgo(28), timesReviewed: 4 },
        { userId: 'user_3', languageCode: 'fr', word: 'collaboration', translation: 'collaboration', learnedAt: daysAgo(26), timesReviewed: 4 },
        { userId: 'user_3', languageCode: 'fr', word: 'processus', translation: 'process', learnedAt: daysAgo(24), timesReviewed: 3 },
        { userId: 'user_3', languageCode: 'fr', word: 'analyse', translation: 'analysis', learnedAt: daysAgo(22), timesReviewed: 3 },
        { userId: 'user_3', languageCode: 'fr', word: 'résultat', translation: 'result', learnedAt: daysAgo(20), timesReviewed: 3 },
        { userId: 'user_3', languageCode: 'fr', word: 'objectif', translation: 'objective', learnedAt: daysAgo(18), timesReviewed: 3 },
        { userId: 'user_3', languageCode: 'fr', word: 'amélioration', translation: 'improvement', learnedAt: daysAgo(16), timesReviewed: 2 },
        { userId: 'user_3', languageCode: 'fr', word: 'méthodologie', translation: 'methodology', learnedAt: daysAgo(14), timesReviewed: 2 },
        { userId: 'user_3', languageCode: 'fr', word: 'ressources', translation: 'resources', learnedAt: daysAgo(12), timesReviewed: 2 },
        { userId: 'user_3', languageCode: 'fr', word: 'compétence', translation: 'skill', learnedAt: daysAgo(10), timesReviewed: 2 },
        { userId: 'user_3', languageCode: 'fr', word: 'performance', translation: 'performance', learnedAt: daysAgo(8), timesReviewed: 1 },
        { userId: 'user_3', languageCode: 'fr', word: 'croissance', translation: 'growth', learnedAt: daysAgo(6), timesReviewed: 1 },
        { userId: 'user_3', languageCode: 'fr', word: 'planification', translation: 'planning', learnedAt: daysAgo(4), timesReviewed: 1 },
        { userId: 'user_3', languageCode: 'fr', word: 'évaluation', translation: 'evaluation', learnedAt: daysAgo(2), timesReviewed: 1 },

        // Yuki Tanaka (user_3) - Spanish (15 words, last 30 days)
        { userId: 'user_3', languageCode: 'es', word: 'ciudad', translation: 'city', learnedAt: daysAgo(30), timesReviewed: 4 },
        { userId: 'user_3', languageCode: 'es', word: 'familia', translation: 'family', learnedAt: daysAgo(28), timesReviewed: 4 },
        { userId: 'user_3', languageCode: 'es', word: 'hablar', translation: 'to speak', learnedAt: daysAgo(26), timesReviewed: 3 },
        { userId: 'user_3', languageCode: 'es', word: 'tiempo', translation: 'time', learnedAt: daysAgo(24), timesReviewed: 3 },
        { userId: 'user_3', languageCode: 'es', word: 'conocer', translation: 'to know', learnedAt: daysAgo(22), timesReviewed: 3 },
        { userId: 'user_3', languageCode: 'es', word: 'persona', translation: 'person', learnedAt: daysAgo(20), timesReviewed: 3 },
        { userId: 'user_3', languageCode: 'es', word: 'lugar', translation: 'place', learnedAt: daysAgo(18), timesReviewed: 2 },
        { userId: 'user_3', languageCode: 'es', word: 'momento', translation: 'moment', learnedAt: daysAgo(16), timesReviewed: 2 },
        { userId: 'user_3', languageCode: 'es', word: 'manera', translation: 'way', learnedAt: daysAgo(14), timesReviewed: 2 },
        { userId: 'user_3', languageCode: 'es', word: 'año', translation: 'year', learnedAt: daysAgo(12), timesReviewed: 2 },
        { userId: 'user_3', languageCode: 'es', word: 'día', translation: 'day', learnedAt: daysAgo(10), timesReviewed: 1 },
        { userId: 'user_3', languageCode: 'es', word: 'parte', translation: 'part', learnedAt: daysAgo(8), timesReviewed: 1 },
        { userId: 'user_3', languageCode: 'es', word: 'ejemplo', translation: 'example', learnedAt: daysAgo(6), timesReviewed: 0 },
        { userId: 'user_3', languageCode: 'es', word: 'problema', translation: 'problem', learnedAt: daysAgo(4), timesReviewed: 0 },
        { userId: 'user_3', languageCode: 'es', word: 'solución', translation: 'solution', learnedAt: daysAgo(2), timesReviewed: 0 },

        // Yuki Tanaka (user_3) - German (10 words, last 10 days)
        { userId: 'user_3', languageCode: 'de', word: 'hallo', translation: 'hello', learnedAt: daysAgo(10), timesReviewed: 2 },
        { userId: 'user_3', languageCode: 'de', word: 'danke', translation: 'thank you', learnedAt: daysAgo(9), timesReviewed: 2 },
        { userId: 'user_3', languageCode: 'de', word: 'auf wiedersehen', translation: 'goodbye', learnedAt: daysAgo(8), timesReviewed: 1 },
        { userId: 'user_3', languageCode: 'de', word: 'haus', translation: 'house', learnedAt: daysAgo(7), timesReviewed: 1 },
        { userId: 'user_3', languageCode: 'de', word: 'lernen', translation: 'to learn', learnedAt: daysAgo(6), timesReviewed: 1 },
        { userId: 'user_3', languageCode: 'de', word: 'wasser', translation: 'water', learnedAt: daysAgo(5), timesReviewed: 1 },
        { userId: 'user_3', languageCode: 'de', word: 'brot', translation: 'bread', learnedAt: daysAgo(4), timesReviewed: 0 },
        { userId: 'user_3', languageCode: 'de', word: 'buch', translation: 'book', learnedAt: daysAgo(3), timesReviewed: 0 },
        { userId: 'user_3', languageCode: 'de', word: 'schule', translation: 'school', learnedAt: daysAgo(2), timesReviewed: 0 },
        { userId: 'user_3', languageCode: 'de', word: 'arbeit', translation: 'work', learnedAt: daysAgo(1), timesReviewed: 0 },
    ];

    await db.insert(learnedVocabulary).values(sampleVocabulary);
    
    console.log('✅ Learned vocabulary seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});