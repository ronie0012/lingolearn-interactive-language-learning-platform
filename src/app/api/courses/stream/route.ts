import { NextRequest } from 'next/server';
import { db } from '@/db';
import { courses } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest) {
  const encoder = new TextEncoder();
  const pollingMs = parseInt(process.env.COURSE_SSE_POLL_MS || '5000');

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const write = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Initial send
      let lastVersion = await currentVersion();
      write({ type: 'init', version: lastVersion, now: Date.now() });

      const interval = setInterval(async () => {
        try {
          const v = await currentVersion();
          if (v !== lastVersion) {
            lastVersion = v;
            write({ type: 'update', version: v, at: Date.now() });
          } else {
            // heartbeat
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
      // On close is not standardized here but Next will dispose on client disconnect
      // We'll ensure we clear intervals when stream is canceled
      // eslint-disable-next-line @typescript-eslint/no-empty-function
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

async function currentVersion() {
  const row = await db.select().from(courses).orderBy(desc(courses.updatedAt)).limit(1);
  return row.length ? new Date(row[0].updatedAt as unknown as string).getTime() : 0;
}
