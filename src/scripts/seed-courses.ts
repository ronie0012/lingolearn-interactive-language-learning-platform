import dotenv from 'dotenv';
dotenv.config();

import { db } from '@/db';
import { courses } from '@/db/schema';

const sampleCourses = [
  {
    id: 'spanish-beginners',
    languageCode: 'es',
    title: 'Spanish for Beginners',
    description: 'Start your Spanish journey with basic vocabulary, pronunciation, and essential phrases.',
    level: 'Beginner',
    category: 'Romance Languages',
    flag: '🇪🇸',
    duration: '8 weeks',
    students: 12450,
    ratingTenths: 47, // 4.7
    totalLessons: 24,
  },
  {
    id: 'french-intermediate',
    languageCode: 'fr',
    title: 'Intermediate French',
    description: 'Advance your French skills with complex grammar, conversation practice, and cultural insights.',
    level: 'Intermediate',
    category: 'Romance Languages',
    flag: '🇫🇷',
    duration: '12 weeks',
    students: 8930,
    ratingTenths: 45, // 4.5
    totalLessons: 36,
  },
  {
    id: 'mandarin-beginners',
    languageCode: 'zh',
    title: 'Mandarin Chinese Basics',
    description: 'Learn Mandarin from scratch with pinyin, tones, and fundamental characters.',
    level: 'Beginner',
    category: 'East Asian Languages',
    flag: '🇨🇳',
    duration: '10 weeks',
    students: 15670,
    ratingTenths: 46, // 4.6
    totalLessons: 30,
  },
  {
    id: 'german-advanced',
    languageCode: 'de',
    title: 'Advanced German',
    description: 'Master complex German grammar, literature, and professional communication.',
    level: 'Advanced',
    category: 'Germanic Languages',
    flag: '🇩🇪',
    duration: '16 weeks',
    students: 3280,
    ratingTenths: 48, // 4.8
    totalLessons: 48,
  },
  {
    id: 'japanese-beginners',
    languageCode: 'ja',
    title: 'Japanese Fundamentals',
    description: 'Discover Japanese with hiragana, katakana, basic kanji, and everyday expressions.',
    level: 'Beginner',
    category: 'East Asian Languages',
    flag: '🇯🇵',
    duration: '12 weeks',
    students: 22100,
    ratingTenths: 49, // 4.9
    totalLessons: 40,
  },
  {
    id: 'arabic-beginners',
    languageCode: 'ar',
    title: 'Arabic for Beginners',
    description: 'Start with Arabic alphabet, pronunciation, and basic conversational phrases.',
    level: 'Beginner',
    category: 'Semitic Languages',
    flag: '🇸🇦',
    duration: '10 weeks',
    students: 5670,
    ratingTenths: 44, // 4.4
    totalLessons: 32,
  },
  {
    id: 'italian-intermediate',
    languageCode: 'it',
    title: 'Intermediate Italian',
    description: 'Enhance your Italian with advanced grammar, cultural context, and fluency practice.',
    level: 'Intermediate',
    category: 'Romance Languages',
    flag: '🇮🇹',
    duration: '10 weeks',
    students: 7890,
    ratingTenths: 46, // 4.6
    totalLessons: 28,
  },
  {
    id: 'portuguese-beginners',
    languageCode: 'pt',
    title: 'Portuguese Essentials',
    description: 'Learn Portuguese basics with focus on Brazilian pronunciation and culture.',
    level: 'Beginner',
    category: 'Romance Languages',
    flag: '🇧🇷',
    duration: '8 weeks',
    students: 4520,
    ratingTenths: 45, // 4.5
    totalLessons: 26,
  },
  {
    id: 'korean-beginners',
    languageCode: 'ko',
    title: 'Korean Language Basics',
    description: 'Master Hangul, basic grammar, and K-culture essentials in this beginner course.',
    level: 'Beginner',
    category: 'East Asian Languages',
    flag: '🇰🇷',
    duration: '12 weeks',
    students: 18340,
    ratingTenths: 47, // 4.7
    totalLessons: 35,
  },
  {
    id: 'dutch-beginners',
    languageCode: 'nl',
    title: 'Dutch for Beginners',
    description: 'Start speaking Dutch with practical vocabulary and grammar fundamentals.',
    level: 'Beginner',
    category: 'Germanic Languages',
    flag: '🇳🇱',
    duration: '8 weeks',
    students: 2140,
    ratingTenths: 43, // 4.3
    totalLessons: 24,
  },
];

async function seedCourses() {
  try {
    console.log('🌱 Seeding courses...');
    
    for (const course of sampleCourses) {
      await db.insert(courses).values({
        ...course,
        createdAt: new Date(),
        updatedAt: new Date(),
      }).onConflictDoUpdate({
        target: courses.id,
        set: {
          ...course,
          updatedAt: new Date(),
        },
      });
    }
    
    console.log(`✅ Successfully seeded ${sampleCourses.length} courses!`);
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
  }
}

if (require.main === module) {
  seedCourses().then(() => process.exit(0));
}

export { seedCourses };