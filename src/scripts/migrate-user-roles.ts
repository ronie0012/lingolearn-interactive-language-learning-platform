import dotenv from 'dotenv';
dotenv.config();

import { db } from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';

async function migrateUserRoles() {
  try {
    console.log('🔄 Migrating user roles...');
    
    // First, let's add the columns with ALTER TABLE statements
    // Since we can't modify the schema directly, we'll use raw SQL
    
    // Check if columns exist and add them if they don't
    try {
      await db.run(`ALTER TABLE user ADD COLUMN role TEXT DEFAULT 'user' NOT NULL`);
      console.log('✅ Added role column');
    } catch (error) {
      console.log('ℹ️ Role column already exists');
    }
    
    try {
      await db.run(`ALTER TABLE user ADD COLUMN is_active INTEGER DEFAULT 1 NOT NULL`);
      console.log('✅ Added is_active column');
    } catch (error) {
      console.log('ℹ️ is_active column already exists');
    }
    
    // Update all existing users to have default role and active status
    const result = await db.run(`
      UPDATE user 
      SET role = 'user', is_active = 1 
      WHERE role IS NULL OR is_active IS NULL
    `);
    
    console.log(`✅ Updated ${result.changes} existing users with default values`);
    
    // Let's also make the first user an admin if there are any users
    const users = await db.select().from(user).limit(1);
    if (users.length > 0) {
      await db.update(user)
        .set({ role: 'admin' })
        .where(eq(user.id, users[0].id));
      console.log(`✅ Made first user (${users[0].email}) an admin`);
    }
    
    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  migrateUserRoles().then(() => process.exit(0));
}

export { migrateUserRoles };