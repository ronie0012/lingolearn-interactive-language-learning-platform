import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { quizResults } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const languageCode = searchParams.get('languageCode');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Single quiz result by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        }, { status: 400 });
      }

      const result = await db.select()
        .from(quizResults)
        .where(eq(quizResults.id, parseInt(id)))
        .limit(1);

      if (result.length === 0) {
        return NextResponse.json({ 
          error: 'Quiz result not found',
          code: 'NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(result[0], { status: 200 });
    }

    // List quiz results with filters
    if (!userId) {
      return NextResponse.json({ 
        error: 'User ID is required',
        code: 'MISSING_USER_ID' 
      }, { status: 400 });
    }

    let query = db.select().from(quizResults);
    const conditions = [eq(quizResults.userId, userId)];

    // Add languageCode filter if provided
    if (languageCode) {
      conditions.push(eq(quizResults.languageCode, languageCode));
    }

    // Apply filters and sorting
    const results = await query
      .where(and(...conditions))
      .orderBy(desc(quizResults.completedAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, languageCode, quizType, score, totalQuestions } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ 
        error: 'User ID is required',
        code: 'MISSING_USER_ID' 
      }, { status: 400 });
    }

    if (!languageCode || languageCode.trim() === '') {
      return NextResponse.json({ 
        error: 'Language code is required',
        code: 'MISSING_LANGUAGE_CODE' 
      }, { status: 400 });
    }

    if (!quizType || quizType.trim() === '') {
      return NextResponse.json({ 
        error: 'Quiz type is required',
        code: 'MISSING_QUIZ_TYPE' 
      }, { status: 400 });
    }

    if (score === undefined || score === null) {
      return NextResponse.json({ 
        error: 'Score is required',
        code: 'MISSING_SCORE' 
      }, { status: 400 });
    }

    if (totalQuestions === undefined || totalQuestions === null) {
      return NextResponse.json({ 
        error: 'Total questions is required',
        code: 'MISSING_TOTAL_QUESTIONS' 
      }, { status: 400 });
    }

    // Validate score and totalQuestions are positive integers
    const scoreInt = parseInt(score);
    const totalQuestionsInt = parseInt(totalQuestions);

    if (isNaN(scoreInt) || scoreInt < 0) {
      return NextResponse.json({ 
        error: 'Score must be a positive integer',
        code: 'INVALID_SCORE' 
      }, { status: 400 });
    }

    if (isNaN(totalQuestionsInt) || totalQuestionsInt <= 0) {
      return NextResponse.json({ 
        error: 'Total questions must be a positive integer',
        code: 'INVALID_TOTAL_QUESTIONS' 
      }, { status: 400 });
    }

    // Validate score <= totalQuestions
    if (scoreInt > totalQuestionsInt) {
      return NextResponse.json({ 
        error: 'Score cannot exceed total questions',
        code: 'SCORE_EXCEEDS_TOTAL' 
      }, { status: 400 });
    }

    // Insert new quiz result
    const newQuizResult = await db.insert(quizResults)
      .values({
        userId,
        languageCode: languageCode.trim(),
        quizType: quizType.trim(),
        score: scoreInt,
        totalQuestions: totalQuestionsInt,
        completedAt: new Date()
      })
      .returning();

    return NextResponse.json(newQuizResult[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const body = await request.json();

    // Check if quiz result exists
    const existing = await db.select()
      .from(quizResults)
      .where(eq(quizResults.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Quiz result not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    const updates: Record<string, any> = {};

    // Validate and prepare updates
    if (body.score !== undefined) {
      const scoreInt = parseInt(body.score);
      if (isNaN(scoreInt) || scoreInt < 0) {
        return NextResponse.json({ 
          error: 'Score must be a positive integer',
          code: 'INVALID_SCORE' 
        }, { status: 400 });
      }
      updates.score = scoreInt;
    }

    if (body.totalQuestions !== undefined) {
      const totalQuestionsInt = parseInt(body.totalQuestions);
      if (isNaN(totalQuestionsInt) || totalQuestionsInt <= 0) {
        return NextResponse.json({ 
          error: 'Total questions must be a positive integer',
          code: 'INVALID_TOTAL_QUESTIONS' 
        }, { status: 400 });
      }
      updates.totalQuestions = totalQuestionsInt;
    }

    if (body.quizType !== undefined) {
      if (!body.quizType || body.quizType.trim() === '') {
        return NextResponse.json({ 
          error: 'Quiz type cannot be empty',
          code: 'INVALID_QUIZ_TYPE' 
        }, { status: 400 });
      }
      updates.quizType = body.quizType.trim();
    }

    // Validate score <= totalQuestions
    const finalScore = updates.score !== undefined ? updates.score : existing[0].score;
    const finalTotal = updates.totalQuestions !== undefined ? updates.totalQuestions : existing[0].totalQuestions;

    if (finalScore > finalTotal) {
      return NextResponse.json({ 
        error: 'Score cannot exceed total questions',
        code: 'SCORE_EXCEEDS_TOTAL' 
      }, { status: 400 });
    }

    // Perform update
    const updated = await db.update(quizResults)
      .set(updates)
      .where(eq(quizResults.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    // Check if quiz result exists
    const existing = await db.select()
      .from(quizResults)
      .where(eq(quizResults.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Quiz result not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    // Delete the quiz result
    const deleted = await db.delete(quizResults)
      .where(eq(quizResults.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Quiz result deleted successfully',
      deletedRecord: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}