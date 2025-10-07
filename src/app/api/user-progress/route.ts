import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userProgress } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const languageCode = searchParams.get('languageCode');

    // Validate userId is provided
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    // Get progress for specific user and optional language filter
    if (languageCode) {
      const progress = await db
        .select()
        .from(userProgress)
        .where(
          and(
            eq(userProgress.userId, userId),
            eq(userProgress.languageCode, languageCode)
          )
        )
        .limit(1);

      if (progress.length === 0) {
        return NextResponse.json(
          { error: 'Progress record not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(progress[0], { status: 200 });
    }

    // Get all progress records for user
    const allProgress = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    if (allProgress.length === 0) {
      return NextResponse.json(
        { error: 'No progress records found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(allProgress, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, languageCode, wordsLearned, lessonsCompleted, quizzesPassed, currentStreak, lastPracticeDate } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (!languageCode) {
      return NextResponse.json(
        { error: 'Language code is required', code: 'MISSING_LANGUAGE_CODE' },
        { status: 400 }
      );
    }

    // Check if record exists for this user and language combination
    const existingProgress = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.languageCode, languageCode)
        )
      )
      .limit(1);

    if (existingProgress.length > 0) {
      // Update existing record
      const updateData: Record<string, any> = {
        updatedAt: new Date(),
      };

      if (wordsLearned !== undefined) updateData.wordsLearned = wordsLearned;
      if (lessonsCompleted !== undefined) updateData.lessonsCompleted = lessonsCompleted;
      if (quizzesPassed !== undefined) updateData.quizzesPassed = quizzesPassed;
      if (currentStreak !== undefined) updateData.currentStreak = currentStreak;
      if (lastPracticeDate !== undefined) updateData.lastPracticeDate = new Date(lastPracticeDate);

      const updated = await db
        .update(userProgress)
        .set(updateData)
        .where(
          and(
            eq(userProgress.userId, userId),
            eq(userProgress.languageCode, languageCode)
          )
        )
        .returning();

      return NextResponse.json(updated[0], { status: 200 });
    } else {
      // Create new record
      const newProgress = await db
        .insert(userProgress)
        .values({
          userId,
          languageCode,
          wordsLearned: wordsLearned ?? 0,
          lessonsCompleted: lessonsCompleted ?? 0,
          quizzesPassed: quizzesPassed ?? 0,
          currentStreak: currentStreak ?? 0,
          lastPracticeDate: lastPracticeDate ? new Date(lastPracticeDate) : null,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      return NextResponse.json(newProgress[0], { status: 201 });
    }
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Check if record exists
    const existing = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Progress record not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const { languageCode, wordsLearned, lessonsCompleted, quizzesPassed, currentStreak, lastPracticeDate } = body;

    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (languageCode !== undefined) updateData.languageCode = languageCode;
    if (wordsLearned !== undefined) updateData.wordsLearned = wordsLearned;
    if (lessonsCompleted !== undefined) updateData.lessonsCompleted = lessonsCompleted;
    if (quizzesPassed !== undefined) updateData.quizzesPassed = quizzesPassed;
    if (currentStreak !== undefined) updateData.currentStreak = currentStreak;
    if (lastPracticeDate !== undefined) updateData.lastPracticeDate = new Date(lastPracticeDate);

    const updated = await db
      .update(userProgress)
      .set(updateData)
      .where(eq(userProgress.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if record exists
    const existing = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Progress record not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(userProgress)
      .where(eq(userProgress.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Progress record deleted successfully',
        deletedRecord: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}