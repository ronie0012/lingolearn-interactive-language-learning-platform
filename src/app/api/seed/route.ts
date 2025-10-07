import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { courses, courseModules, lessons, courseVocabulary, courseGrammar, culturalContent, quizQuestions } from '@/db/schema';
import { eq } from 'drizzle-orm';

// Simple protected seeding endpoint. Set SEED_SECRET in env and pass header x-seed-secret to use.
export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-seed-secret');
  if (!process.env.SEED_SECRET || secret !== process.env.SEED_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Example: Spanish Beginners
    const seedCourses = [
      {
        id: 'spanish-beginners',
        languageCode: 'es',
        title: 'Spanish for Beginners',
        description: 'Master the basics of Spanish with interactive lessons and real-world conversations',
        level: 'Beginner',
        category: 'Romance Languages',
        flag: '🇪🇸',
        duration: '8 weeks',
        students: 120000,
        ratingTenths: 48,
        totalLessons: 0,
        modules: [
          {
            index: 0,
            title: 'Introduction to Spanish',
            description: 'Alphabet, pronunciation, greetings',
            lessons: [
              { index: 0, title: 'Spanish Alphabet and Pronunciation', duration: '15 min' },
              { index: 1, title: 'Basic Greetings and Introductions', duration: '20 min' },
              { index: 2, title: 'Numbers 1-100', duration: '18 min' },
              { index: 3, title: 'Days of the Week and Months', duration: '15 min' },
            ],
          },
          {
            index: 1,
            title: 'Essential Grammar',
            description: 'Pronouns, present tense, gender & articles, questions',
            lessons: [
              { index: 0, title: 'Personal Pronouns', duration: '25 min' },
              { index: 1, title: 'Present Tense - Regular Verbs', duration: '30 min' },
              { index: 2, title: 'Gender and Articles', duration: '20 min' },
              { index: 3, title: 'Question Formation', duration: '22 min' },
            ],
          },
        ],
        vocabulary: [
          { word: 'hello', translation: 'hola', partOfSpeech: 'interjection' },
          { word: 'thank you', translation: 'gracias', partOfSpeech: 'expression' },
          { word: 'water', translation: 'agua', partOfSpeech: 'noun' },
        ],
        grammar: [
          { title: 'Subject Pronouns', content: 'Yo, tú, él/ella, nosotros, vosotros, ellos/ellas', example: 'Yo hablo, tú hablas' },
          { title: 'Present Tense Regular Verbs', content: '-ar, -er, -ir conjugations', example: 'hablar: hablo, hablas, habla...' },
        ],
        culture: [
          { title: 'Spanish Tapas Culture', description: 'Social dining and small plates tradition', url: 'https://en.wikipedia.org/wiki/Tapas' },
        ],
        quiz: [
          { question: 'How do you say "hello" in Spanish?', options: ['hola', 'adiós', 'gracias', 'por favor'], correctIndex: 0 },
          { question: 'What is "thank you" in Spanish?', options: ['agua', 'gracias', 'hola', 'día'], correctIndex: 1 },
        ],
      },
      {
        id: 'french-basics',
        languageCode: 'fr',
        title: 'French Basics',
        description: 'Learn essential French phrases and grammar for everyday conversations',
        level: 'Beginner',
        category: 'Romance Languages',
        flag: '🇫🇷',
        duration: '6 weeks',
        students: 95000,
        ratingTenths: 47,
        totalLessons: 0,
        modules: [
          {
            index: 0,
            title: 'French Fundamentals',
            description: 'Pronunciation, greetings, numbers',
            lessons: [
              { index: 0, title: 'French Pronunciation Guide', duration: '18 min' },
              { index: 1, title: 'Essential Greetings', duration: '15 min' },
              { index: 2, title: 'Numbers and Counting', duration: '20 min' },
            ],
          },
        ],
        vocabulary: [
          { word: 'hello', translation: 'bonjour' },
          { word: 'please', translation: 's’il vous plaît' },
        ],
        grammar: [
          { title: 'Articles', content: 'le, la, les; un, une', example: 'le livre, la table' },
        ],
        culture: [
          { title: 'French Café Culture', description: 'Cafés as social hubs', url: 'https://en.wikipedia.org/wiki/Caf%C3%A9' },
        ],
        quiz: [
          { question: 'Translate "hello" to French', options: ['hola', 'bonjour', 'ciao', 'hallo'], correctIndex: 1 },
        ],
      },
      {
        id: 'japanese-hiragana',
        languageCode: 'ja',
        title: 'Japanese Hiragana',
        description: 'Master Japanese writing system and basic conversational skills',
        level: 'Beginner',
        category: 'East Asian Languages',
        flag: '🇯🇵',
        duration: '10 weeks',
        students: 80000,
        ratingTenths: 49,
        totalLessons: 0,
        modules: [
          {
            index: 0,
            title: 'Hiragana Basics',
            description: 'Vowels and K-row',
            lessons: [
              { index: 0, title: 'Introduction to Hiragana', duration: '15 min' },
              { index: 1, title: 'Vowels: あ、い、う、え、お', duration: '20 min' },
              { index: 2, title: 'K-row: か、き、く、け、こ', duration: '20 min' },
            ],
          },
        ],
        vocabulary: [
          { word: 'water', translation: 'みず' },
          { word: 'friend', translation: 'ともだち' },
        ],
        grammar: [
          { title: 'Particles Intro', content: 'は、が、を basics', example: '私は学生です。' },
        ],
        culture: [
          { title: 'Omotenashi', description: 'Japanese hospitality concept', url: 'https://en.wikipedia.org/wiki/Omotenashi' },
        ],
        quiz: [
          { question: 'あ stands for which vowel?', options: ['a', 'i', 'u', 'e'], correctIndex: 0 },
        ],
      },
    ];

    for (const c of seedCourses) {
      // upsert course
      const updated = await db.update(courses).set({
        languageCode: c.languageCode,
        title: c.title,
        description: c.description,
        level: c.level,
        category: c.category,
        flag: c.flag,
        duration: c.duration,
        students: c.students,
        ratingTenths: c.ratingTenths,
        totalLessons: c.totalLessons,
        updatedAt: new Date(),
      }).where(eq(courses.id, c.id)).returning();

      if (updated.length === 0) {
        await db.insert(courses).values({
          id: c.id,
          languageCode: c.languageCode,
          title: c.title,
          description: c.description,
          level: c.level,
          category: c.category,
          flag: c.flag,
          duration: c.duration,
          students: c.students,
          ratingTenths: c.ratingTenths,
          totalLessons: c.totalLessons,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();
      }

      // Modules and lessons
      for (const m of c.modules) {
        const mod = await db.insert(courseModules).values({
          courseId: c.id,
          index: m.index,
          title: m.title,
          description: m.description,
          createdAt: new Date(),
          updatedAt: new Date(),
        }).returning();
        const modId = mod[0].id;
        for (const l of m.lessons) {
          await db.insert(lessons).values({
            moduleId: modId,
            index: l.index,
            title: l.title,
            duration: l.duration,
            lessonType: 'general',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      // Vocabulary
      for (const v of c.vocabulary) {
        await db.insert(courseVocabulary).values({
          courseId: c.id,
          word: v.word,
          translation: v.translation,
          partOfSpeech: v.partOfSpeech,
          createdAt: new Date(),
        });
      }

      // Grammar
      for (const g of c.grammar) {
        await db.insert(courseGrammar).values({
          courseId: c.id,
          title: g.title,
          content: g.content,
          example: g.example,
          createdAt: new Date(),
        });
      }

      // Culture
      for (const cu of c.culture) {
        await db.insert(culturalContent).values({
          courseId: c.id,
          title: cu.title,
          description: cu.description,
          url: cu.url,
          createdAt: new Date(),
        });
      }

      // Quiz
      for (const q of c.quiz) {
        await db.insert(quizQuestions).values({
          courseId: c.id,
          question: q.question,
          optionsJson: JSON.stringify(q.options),
          correctIndex: q.correctIndex,
          type: 'vocabulary',
          createdAt: new Date(),
        });
      }

      // Update totalLessons based on inserted lessons
      const totalLessonsCount = c.modules.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0);
      await db.update(courses).set({ totalLessons: totalLessonsCount, updatedAt: new Date() }).where(eq(courses.id, c.id));
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error('Seed error', error)
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 })
  }
}
