import { NextRequest } from 'next/server';
import { db } from '@/db';
import { courses, courseModules, lessons, courseVocabulary, courseGrammar, culturalContent, quizQuestions } from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, context: { params: { courseId: string } }) {
  const courseId = context.params.courseId;
  const encoder = new TextEncoder();
  const pollingMs = parseInt(process.env.COURSE_SSE_POLL_MS || '5000');

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const write = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      let lastVersion = await currentVersion(courseId);
      write({ type: 'init', version: lastVersion, now: Date.now() });

      const interval = setInterval(async () => {
        try {
          const v = await currentVersion(courseId);
          if (v !== lastVersion) {
            lastVersion = v;
            write({ type: 'update', version: v, at: Date.now() });
          } else {
            write({ type: 'heartbeat', at: Date.now() });
          }
        } catch (e) {
          write({ type: 'error', message: 'poll_failed' });
        }
      }, pollingMs);

      const heartbeat = setInterval(() => {
        write(':keep-alive');
      }, 15000);

      const close = () => {
        clearInterval(interval);
        clearInterval(heartbeat);
        controller.close();
      };

      // @ts-ignore
      (controller as any).onCancel = close;
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

async function currentVersion(courseId: string) {
  // Compose a version from latest timestamps across related tables
  let maxTs = 0;

  const pushMax = (d: Date | null | undefined) => {
    if (!d) return;
    const t = new Date(d as unknown as string).getTime();
    if (t > maxTs) maxTs = t;
  };

  const c = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  if (c.length) pushMax(c[0].updatedAt as any);

  const modsAll = await db.select().from(courseModules).where(eq(courseModules.courseId, courseId)).orderBy(desc(courseModules.updatedAt));
  if (modsAll.length) pushMax(modsAll[0].updatedAt as any);

  // Lessons: use updatedAt across all modules for this course
  for (const m of modsAll) {
    const latestLessonForModule = await db.select().from(lessons)
      .where(eq(lessons.moduleId, m.id))
      .orderBy(desc(lessons.updatedAt)).limit(1);
    if (latestLessonForModule.length) pushMax(latestLessonForModule[0].updatedAt as any);
  }

  // Content tables use createdAt as change indicator
  const latestVocab = await db.select().from(courseVocabulary).where(eq(courseVocabulary.courseId, courseId)).orderBy(desc(courseVocabulary.createdAt)).limit(1);
  if (latestVocab.length) pushMax(latestVocab[0].createdAt as any);

  const latestGrammar = await db.select().from(courseGrammar).where(eq(courseGrammar.courseId, courseId)).orderBy(desc(courseGrammar.createdAt)).limit(1);
  if (latestGrammar.length) pushMax(latestGrammar[0].createdAt as any);

  const latestCulture = await db.select().from(culturalContent).where(eq(culturalContent.courseId, courseId)).orderBy(desc(culturalContent.createdAt)).limit(1);
  if (latestCulture.length) pushMax(latestCulture[0].createdAt as any);

  const latestQuiz = await db.select().from(quizQuestions).where(eq(quizQuestions.courseId, courseId)).orderBy(desc(quizQuestions.createdAt)).limit(1);
  if (latestQuiz.length) pushMax(latestQuiz[0].createdAt as any);

  return maxTs;
}
