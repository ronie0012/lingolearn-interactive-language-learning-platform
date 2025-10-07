import dotenv from 'dotenv';
dotenv.config();

import { db } from '@/db';
import { user } from '@/db/schema';
import { UserRole } from '@/lib/auth-utils';
import { eq } from 'drizzle-orm';

async function testAuthSystem() {
  try {
    console.log('🧪 Testing Authentication System...\n');
    
    // Test 1: Check user roles in database
    console.log('1️⃣ Testing User Roles in Database:');
    const users = await db.select().from(user);
    
    console.log(`   Found ${users.length} users:`);
    users.forEach((u, index) => {
      console.log(`   ${index + 1}. ${u.name} (${u.email}) - Role: ${u.role}, Active: ${u.isActive}`);
    });
    
    // Test 2: Verify role enum values
    console.log('\n2️⃣ Testing Role Enum Values:');
    console.log('   Available roles:', Object.values(UserRole));
    
    // Test 3: Test permission system
    console.log('\n3️⃣ Testing Permission System:');
    const testRoles = [UserRole.USER, UserRole.PREMIUM, UserRole.INSTRUCTOR, UserRole.ADMIN];
    const testPermissions = ['COURSES_READ', 'AI_CHATBOT', 'ANALYTICS', 'ADMIN_PANEL'] as const;
    
    testRoles.forEach(role => {
      console.log(`   ${role} permissions:`);
      testPermissions.forEach(permission => {
        const hasPermission = require('@/lib/auth-utils').hasPermission(role, permission);
        console.log(`     - ${permission}: ${hasPermission ? '✅' : '❌'}`);
      });
      console.log('');
    });
    
    // Test 4: Check if first user is admin
    console.log('4️⃣ Admin User Test:');
    const adminUsers = users.filter(u => u.role === 'admin');
    if (adminUsers.length > 0) {
      console.log(`   ✅ Found ${adminUsers.length} admin user(s):`);
      adminUsers.forEach(admin => {
        console.log(`      - ${admin.name} (${admin.email})`);
      });
    } else {
      console.log('   ❌ No admin users found! Creating one...');
      if (users.length > 0) {
        await db.update(user)
          .set({ role: 'admin' })
          .where(eq(user.id, users[0].id));
        console.log(`   ✅ Made ${users[0].name} an admin`);
      }
    }
    
    // Test 5: Validate database schema
    console.log('\n5️⃣ Database Schema Validation:');
    if (users.length > 0) {
      const sampleUser = users[0];
      const requiredFields = ['id', 'name', 'email', 'role', 'isActive', 'emailVerified'];
      
      requiredFields.forEach(field => {
        const hasField = field in sampleUser;
        console.log(`   ${field}: ${hasField ? '✅' : '❌'}`);
      });
    }
    
    console.log('\n✅ Authentication system test completed!');
    console.log('\n📋 Summary:');
    console.log(`   - Total users: ${users.length}`);
    console.log(`   - Admin users: ${users.filter(u => u.role === 'admin').length}`);
    console.log(`   - Active users: ${users.filter(u => u.isActive).length}`);
    console.log(`   - Available roles: ${Object.values(UserRole).length}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  testAuthSystem().then(() => process.exit(0));
}

export { testAuthSystem };