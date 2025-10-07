import { NextRequest, NextResponse } from 'next/server';
import { requirePermission, UserRole } from '@/lib/auth-utils';
import { db } from '@/db';
import { user } from '@/db/schema';
import { eq, desc, like, or } from 'drizzle-orm';

// GET /api/admin/users - Get all users (admin only)
export async function GET(request: NextRequest) {
  const userOrError = await requirePermission(request, 'USERS_READ');
  
  if (userOrError instanceof Response) {
    return userOrError;
  }
  
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search')?.trim();
  const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
  const offset = parseInt(searchParams.get('offset') || '0');
  
  try {
    let whereClause;
    
    if (search) {
      const searchPattern = `%${search}%`;
      whereClause = or(
        like(user.name, searchPattern),
        like(user.email, searchPattern)
      );
    }
    
    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        image: user.image,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .from(user)
      .where(whereClause)
      .orderBy(desc(user.createdAt))
      .limit(limit)
      .offset(offset);
    
    return NextResponse.json({
      users,
      pagination: {
        limit,
        offset,
        total: users.length,
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', code: 'FETCH_FAILED' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/users/[userId] - Update user role/status (admin only)
export async function PUT(request: NextRequest) {
  const userOrError = await requirePermission(request, 'USERS_WRITE');
  
  if (userOrError instanceof Response) {
    return userOrError;
  }
  
  try {
    const { userId, role, isActive } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }
    
    // Validate role
    if (role && !Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role', code: 'INVALID_ROLE', validRoles: Object.values(UserRole) },
        { status: 400 }
      );
    }
    
    const updateData: any = {};
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    updateData.updatedAt = new Date();
    
    const updatedUser = await db
      .update(user)
      .set(updateData)
      .where(eq(user.id, userId))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        updatedAt: user.updatedAt,
      });
    
    if (updatedUser.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedUser[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user', code: 'UPDATE_FAILED' },
      { status: 500 }
    );
  }
}