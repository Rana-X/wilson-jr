#!/usr/bin/env node

/**
 * Test Database Connection
 *
 * Quick script to verify your Neon database connection is working
 *
 * Usage:
 *   node database/test-connection.js
 */

require('dotenv').config({ path: '.env.local' });

if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL not found in .env.local');
  console.error('');
  console.error('Create a .env.local file with:');
  console.error('DATABASE_URL="postgresql://user:password@host/database?sslmode=require"');
  process.exit(1);
}

const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function testConnection() {
  console.log('');
  console.log('🔌 Testing database connection...');
  console.log('');

  try {
    // Test basic query
    const result = await sql`SELECT NOW() as current_time, version() as pg_version`;
    console.log('✅ Connection successful!');
    console.log('');
    console.log(`⏰ Server time: ${result[0].current_time}`);
    console.log(`📦 PostgreSQL: ${result[0].pg_version.split(' ')[0]} ${result[0].pg_version.split(' ')[1]}`);
    console.log('');

    // Check tables
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;

    if (tables.length === 0) {
      console.log('⚠️  No tables found');
      console.log('');
      console.log('Run migration to create tables:');
      console.log('   node database/migrate.js --seed');
    } else {
      console.log(`✅ Found ${tables.length} table(s):`);
      tables.forEach(t => console.log(`   - ${t.table_name}`));
      console.log('');

      // Count records
      try {
        const counts = await sql`
          SELECT
            (SELECT COUNT(*) FROM shipments) as shipments,
            (SELECT COUNT(*) FROM emails) as emails,
            (SELECT COUNT(*) FROM quotes) as quotes,
            (SELECT COUNT(*) FROM chat_messages) as chat_messages,
            (SELECT COUNT(*) FROM tracking_events) as tracking_events
        `;

        console.log('📊 Record counts:');
        console.log(`   Shipments:       ${counts[0].shipments}`);
        console.log(`   Emails:          ${counts[0].emails}`);
        console.log(`   Quotes:          ${counts[0].quotes}`);
        console.log(`   Chat Messages:   ${counts[0].chat_messages}`);
        console.log(`   Tracking Events: ${counts[0].tracking_events}`);
      } catch (err) {
        console.log('⚠️  Could not count records (tables may be empty)');
      }
    }

    console.log('');
    console.log('✅ All tests passed!');
    console.log('');

  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('');
    console.error('Error:', error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('1. Check your DATABASE_URL in .env.local');
    console.error('2. Verify your Neon project is active (not suspended)');
    console.error('3. Ensure connection string includes ?sslmode=require');
    console.error('4. Check firewall/network settings');
    console.error('');
    process.exit(1);
  }
}

testConnection();
