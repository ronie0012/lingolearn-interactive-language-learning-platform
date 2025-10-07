import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';

// GET /api/user/me - Get current user profile
export async function GET(request: NextRequest) {
  const userOrError = await requireAuth(request);
  
  if (userOrError instanceof Response) {
    return userOrError; // Return error response
  }
  
  const user = userOrError;
  
  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}

// PUT /api/user/me - Update current user profile
export async function PUT(request: NextRequest) {
  const userOrError = await requireAuth(request);
  
  if (userOrError instanceof Response) {
    return userOrError;
  }
  
  const user = userOrError;
  
  try {
    const { name, image } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required', code: 'MISSING_NAME' },
        { status: 400 }
      );
    }
    
    // Here you would update the user in the database
    // For now, just return the updated user data
    
    return NextResponse.json({
      id: user.id,
      name: name,
      email: user.email,
      role: user.role,
      emailVerified: user.emailVerified,
      image: image || user.image,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile', code: 'UPDATE_FAILED' },
      { status: 500 }
    );
  }
}