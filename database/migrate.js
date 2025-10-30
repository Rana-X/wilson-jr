#!/usr/bin/env node

/**
 * Wilson Jr - Database Migration Script
 *
 * This script runs the schema and optionally seeds the database
 *
 * Usage:
 *   node database/migrate.js               # Run schema only
 *   node database/migrate.js --seed        # Run schema + seed data
 *   node database/migrate.js --reset       # Drop all tables and recreate
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Check for DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL not found in environment variables');
  console.error('');
  console.error('Please create a .env.local file with your Neon connection string:');
  console.error('DATABASE_URL="postgresql://user:password@host/database?sslmode=require"');
  console.error('');
  process.exit(1);
}

// Import Neon serverless driver
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

// Parse command line arguments
const args = process.argv.slice(2);
const shouldSeed = args.includes('--seed');
const shouldReset = args.includes('--reset');

/**
 * Run SQL file
 */
async function runSqlFile(filename) {
  const filePath = path.join(__dirname, filename);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return false;
  }

  const sqlContent = fs.readFileSync(filePath, 'utf8');

  // Split by semicolon and filter out empty statements
  const statements = sqlContent
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('/*'));

  console.log(`📄 Running ${filename}...`);
  console.log(`   Found ${statements.length} SQL statements`);

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];

    // Skip comments and empty lines
    if (statement.startsWith('--') || statement.startsWith('/*')) {
      continue;
    }

    try {
      await sql(statement);
      process.stdout.write(`   ✓ Statement ${i + 1}/${statements.length}\r`);
    } catch (error) {
      console.error(`\n   ❌ Error in statement ${i + 1}:`);
      console.error(`   ${error.message}`);
      console.error(`   Statement: ${statement.substring(0, 100)}...`);
      return false;
    }
  }

  console.log(`\n✅ ${filename} completed successfully`);
  return true;
}

/**
 * Drop all tables (for reset)
 */
async function dropAllTables() {
  console.log('🗑️  Dropping all tables...');

  try {
    await sql`
      DROP TABLE IF EXISTS tracking_events CASCADE;
      DROP TABLE IF EXISTS chat_messages CASCADE;
      DROP TABLE IF EXISTS quotes CASCADE;
      DROP TABLE IF EXISTS emails CASCADE;
      DROP TABLE IF EXISTS shipments CASCADE;
      DROP VIEW IF EXISTS active_shipments CASCADE;
      DROP VIEW IF EXISTS shipment_inbox CASCADE;
    `;
    console.log('✅ All tables dropped');
    return true;
  } catch (error) {
    console.error('❌ Error dropping tables:', error.message);
    return false;
  }
}

/**
 * Verify tables exist
 */
async function verifyTables() {
  console.log('\n🔍 Verifying database setup...');

  try {
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `;

    console.log(`✅ Found ${tables.length} tables:`);
    tables.forEach(t => console.log(`   - ${t.table_name}`));

    // Check for expected tables
    const expectedTables = ['shipments', 'emails', 'quotes', 'chat_messages', 'tracking_events'];
    const foundTables = tables.map(t => t.table_name);
    const missingTables = expectedTables.filter(t => !foundTables.includes(t));

    if (missingTables.length > 0) {
      console.warn(`⚠️  Missing tables: ${missingTables.join(', ')}`);
    }

    return true;
  } catch (error) {
    console.error('❌ Error verifying tables:', error.message);
    return false;
  }
}

/**
 * Count records in tables
 */
async function showStats() {
  console.log('\n📊 Database Statistics:');

  try {
    const stats = await sql`
      SELECT
        (SELECT COUNT(*) FROM shipments) as shipments,
        (SELECT COUNT(*) FROM emails) as emails,
        (SELECT COUNT(*) FROM quotes) as quotes,
        (SELECT COUNT(*) FROM chat_messages) as chat_messages,
        (SELECT COUNT(*) FROM tracking_events) as tracking_events
    `;

    const counts = stats[0];
    console.log(`   Shipments:       ${counts.shipments}`);
    console.log(`   Emails:          ${counts.emails}`);
    console.log(`   Quotes:          ${counts.quotes}`);
    console.log(`   Chat Messages:   ${counts.chat_messages}`);
    console.log(`   Tracking Events: ${counts.tracking_events}`);

  } catch (error) {
    console.error('❌ Error fetching stats:', error.message);
  }
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         WILSON JR - DATABASE MIGRATION                     ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');

  // Show connection info (hide password)
  const dbUrl = process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@');
  console.log(`📡 Connecting to: ${dbUrl}`);
  console.log('');

  try {
    // Test connection
    const result = await sql`SELECT NOW() as current_time`;
    console.log(`✅ Connected successfully at ${result[0].current_time}`);
    console.log('');

    // Reset if requested
    if (shouldReset) {
      const success = await dropAllTables();
      if (!success) {
        process.exit(1);
      }
      console.log('');
    }

    // Run schema
    const schemaSuccess = await runSqlFile('schema.sql');
    if (!schemaSuccess) {
      console.error('\n❌ Schema migration failed');
      process.exit(1);
    }

    // Verify tables
    await verifyTables();

    // Run seed data if requested
    if (shouldSeed) {
      console.log('');
      const seedSuccess = await runSqlFile('seed.sql');
      if (!seedSuccess) {
        console.error('\n❌ Seed data failed');
        process.exit(1);
      }
    }

    // Show stats
    await showStats();

    console.log('');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                  ✅ MIGRATION COMPLETE                     ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');

    if (!shouldSeed) {
      console.log('💡 Tip: Run with --seed to load sample data');
      console.log('   node database/migrate.js --seed');
      console.log('');
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run migration
migrate();
