import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { learnedVocabulary } from '@/db/schema';
import { eq, and, or, like, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const userId = searchParams.get('userId');
    const languageCode = searchParams.get('languageCode');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Single record by ID
    if (id) {
      if (isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        }, { status: 400 });
      }

      const record = await db.select()
        .from(learnedVocabulary)
        .where(eq(learnedVocabulary.id, parseInt(id)))
        .limit(1);

      if (record.length === 0) {
        return NextResponse.json({ 
          error: 'Vocabulary entry not found',
          code: 'NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(record[0], { status: 200 });
    }

    // List with filters
    if (!userId) {
      return NextResponse.json({ 
        error: 'User ID is required',
        code: 'MISSING_USER_ID' 
      }, { status: 400 });
    }

    let query = db.select().from(learnedVocabulary);

    // Build conditions array
    const conditions = [eq(learnedVocabulary.userId, userId)];

    // Filter by language code
    if (languageCode) {
      conditions.push(eq(learnedVocabulary.languageCode, languageCode));
    }

    // Search in word and translation
    if (search) {
      const searchLower = search.toLowerCase();
      conditions.push(
        or(
          like(learnedVocabulary.word, `%${searchLower}%`),
          like(learnedVocabulary.translation, `%${searchLower}%`)
        )!
      );
    }

    // Apply all conditions
    query = query.where(and(...conditions));

    // Sort by most recent first
    const results = await query
      .orderBy(desc(learnedVocabulary.learnedAt))
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
    const { userId, languageCode, word, translation } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json({ 
        error: "User ID is required",
        code: "MISSING_USER_ID" 
      }, { status: 400 });
    }

    if (!languageCode) {
      return NextResponse.json({ 
        error: "Language code is required",
        code: "MISSING_LANGUAGE_CODE" 
      }, { status: 400 });
    }

    if (!word) {
      return NextResponse.json({ 
        error: "Word is required",
        code: "MISSING_WORD" 
      }, { status: 400 });
    }

    if (!translation) {
      return NextResponse.json({ 
        error: "Translation is required",
        code: "MISSING_TRANSLATION" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedWord = word.trim();
    const sanitizedTranslation = translation.trim();
    const sanitizedLanguageCode = languageCode.trim();

    // Check if word already exists for this user+language combination
    const existing = await db.select()
      .from(learnedVocabulary)
      .where(and(
        eq(learnedVocabulary.userId, userId),
        eq(learnedVocabulary.languageCode, sanitizedLanguageCode),
        eq(learnedVocabulary.word, sanitizedWord)
      ))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json({ 
        error: "Word already learned",
        code: "WORD_ALREADY_EXISTS" 
      }, { status: 400 });
    }

    // Insert new vocabulary entry
    const newVocabulary = await db.insert(learnedVocabulary)
      .values({
        userId,
        languageCode: sanitizedLanguageCode,
        word: sanitizedWord,
        translation: sanitizedTranslation,
        learnedAt: new Date(),
        timesReviewed: 0
      })
      .returning();

    return NextResponse.json(newVocabulary[0], { status: 201 });

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
    const incrementReview = searchParams.get('incrementReview') === 'true';

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();

    // Check if record exists
    const existing = await db.select()
      .from(learnedVocabulary)
      .where(eq(learnedVocabulary.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Vocabulary entry not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    // Build update object
    const updates: any = {};

    if (body.word !== undefined) {
      updates.word = body.word.trim();
    }

    if (body.translation !== undefined) {
      updates.translation = body.translation.trim();
    }

    if (body.timesReviewed !== undefined) {
      updates.timesReviewed = parseInt(body.timesReviewed);
    }

    // Increment review count if requested
    if (incrementReview) {
      updates.timesReviewed = existing[0].timesReviewed + 1;
    }

    // Check if there are updates to apply
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(existing[0], { status: 200 });
    }

    // Update the record
    const updated = await db.update(learnedVocabulary)
      .set(updates)
      .where(eq(learnedVocabulary.id, parseInt(id)))
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

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if record exists
    const existing = await db.select()
      .from(learnedVocabulary)
      .where(eq(learnedVocabulary.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Vocabulary entry not found',
        code: 'NOT_FOUND' 
      }, { status: 404 });
    }

    // Delete the record
    const deleted = await db.delete(learnedVocabulary)
      .where(eq(learnedVocabulary.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Vocabulary entry deleted successfully',
      deleted: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}