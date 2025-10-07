import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { and, desc, eq, like, or } from 'drizzle-orm';
import { courses } from '@/db/schema';

// GET /api/courses
// Supports: search, level, category, languageCode, limit, offset
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim();
    const level = searchParams.get('level')?.trim();
    const category = searchParams.get('category')?.trim();
    const languageCode = searchParams.get('languageCode')?.trim();
    const limit = Math.min(parseInt(searchParams.get('limit') || '30'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    let whereClauses: any[] = [];

    if (search) {
      const s = `%${search}%`;
      whereClauses.push(
        or(
          // Search across multiple fields with OR logic
          like(courses.title, s),
          like(courses.description, s),
          like(courses.category, s),
          like(courses.level, s)
        )
      );
    }

    if (level && level !== 'all') whereClauses.push(eq(courses.level, level));
    if (category && category !== 'all') whereClauses.push(eq(courses.category, category));
    if (languageCode) whereClauses.push(eq(courses.languageCode, languageCode));

    const rows = await db
      .select()
      .from(courses)
      .where(whereClauses.length ? and(...whereClauses) : undefined as any)
      .orderBy(desc(courses.updatedAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('GET /api/courses error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}

// POST /api/courses
// Create or upsert a course by id (slug)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      languageCode,
      title,
      description,
      level,
      category,
      flag,
      duration,
      students,
      ratingTenths,
      totalLessons,
    } = body;

    if (!id || !languageCode || !title || !description || !level || !category) {
      return NextResponse.json(
        { error: 'Missing required fields', code: 'MISSING_FIELDS' },
        { status: 400 }
      );
    }

    // Upsert behavior: try update first, else insert
    const updated = await db
      .update(courses)
      .set({
        languageCode,
        title,
        description,
        level,
        category,
        flag,
        duration,
        students: students ?? 0,
        ratingTenths: ratingTenths ?? 0,
        totalLessons: totalLessons ?? 0,
        updatedAt: new Date(),
      })
      .where(eq(courses.id, id))
      .returning();

    if (updated.length > 0) {
      return NextResponse.json(updated[0], { status: 200 });
    }

    const inserted = await db
      .insert(courses)
      .values({
        id,
        languageCode,
        title,
        description,
        level,
        category,
        flag,
        duration,
        students: students ?? 0,
        ratingTenths: ratingTenths ?? 0,
        totalLessons: totalLessons ?? 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json(inserted[0], { status: 201 });
  } catch (error) {
    console.error('POST /api/courses error:', error);
    return NextResponse.json({ error: 'Internal server error: ' + error }, { status: 500 });
  }
}
