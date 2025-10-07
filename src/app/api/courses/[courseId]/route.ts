import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { and, asc, desc, eq } from 'drizzle-orm';
import { courses, courseModules, lessons, courseVocabulary, courseGrammar, culturalContent, quizQuestions } from '@/db/schema';

// GET /api/courses/[courseId]
// Returns an aggregated course payload with modules, lessons, vocabulary, grammar, cultural content, and quiz questions
export async function GET(
  _request: NextRequest,
  context: { params: { courseId: string } }
) {
  try {
    const courseId = context.params.courseId;
    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required', code: 'MISSING_COURSE_ID' }, { status: 400 });
    }

    const courseRows = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
    if (courseRows.length === 0) {
      return NextResponse.json({ error: 'Course not found', code: 'NOT_FOUND' }, { status: 404 });
    }

    const course = courseRows[0];

    const modules = await db
      .select()
      .from(courseModules)
      .where(eq(courseModules.courseId, courseId))
      .orderBy(asc(courseModules.index));

    const moduleIds = modules.map(m => m.id);

    const lessonsRows = moduleIds.length > 0
      ? await db
          .select()
          .from(lessons)
          .where(and(eq(lessons.moduleId, moduleIds[0]) as any)) // dummy and to satisfy type, we will filter below
      : [];

    // Workaround to fetch lessons for all modules while preserving order in SQLite (do multiple queries)
    const lessonsByModule: Record<number, any[]> = {};
    for (const m of modules) {
      const l = await db
        .select()
        .from(lessons)
        .where(eq(lessons.moduleId, m.id))
        .orderBy(asc(lessons.index));
      lessonsByModule[m.id] = l;
    }

    const vocab = await db
      .select()
      .from(courseVocabulary)
      .where(eq(courseVocabulary.courseId, courseId))
      .orderBy(desc(courseVocabulary.createdAt));

    const grammar = await db
      .select()
      .from(courseGrammar)
      .where(eq(courseGrammar.courseId, courseId))
      .orderBy(desc(courseGrammar.createdAt));

    const culture = await db
      .select()
      .from(culturalContent)
      .where(eq(culturalContent.courseId, courseId))
      .orderBy(desc(culturalContent.createdAt));

    const quiz = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.courseId, courseId))
      .orderBy(desc(quizQuestions.createdAt));

    // Assemble response
    const payload = {
      course,
      modules: modules.map(m => ({
        ...m,
        lessons: lessonsByModule[m.id] || []
      })),
      vocabulary: vocab,
      grammar,
      culture,
      quiz: quiz.map(q => ({ ...q, options: safeParseJsonArray(q.optionsJson) }))
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    console.error('GET /api/courses/[courseId] error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

function safeParseJsonArray(s: string | null | undefined) {
  if (!s) return [] as string[];
  try {
    const parsed = JSON.parse(s);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as string[];
  }
}
