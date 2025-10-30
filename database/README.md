# Wilson Jr - Database Setup Guide

This directory contains the PostgreSQL database schema and seed data for the Wilson Jr freight coordination system.

## 📋 Overview

The database consists of 5 main tables:
1. **shipments** - Main shipment records
2. **emails** - Email communication history
3. **quotes** - Carrier quotes
4. **chat_messages** - Wilson AI chat history
5. **tracking_events** - Real-time shipment tracking

## 🚀 Quick Start with Neon + Vercel

### Step 1: Create Neon Database

1. **Go to Neon Console:** https://console.neon.tech
2. **Create New Project:**
   - Name: `wilson-jr` (or your preferred name)
   - Region: Choose closest to your users (e.g., US East - Ohio)
   - PostgreSQL version: 15 or 16 (latest stable)
3. **Copy Connection String:**
   - After creation, copy the connection string
   - Format: `postgresql://[user]:[password]@[host]/[database]?sslmode=require`

### Step 2: Run Schema Migration

**Option A: Using Neon SQL Editor (Recommended)**

1. Open your Neon project → Click **SQL Editor**
2. Copy the contents of `schema.sql`
3. Paste into SQL Editor and click **Run**
4. Wait for confirmation (should see "Query executed successfully")

**Option B: Using psql Command Line**

```bash
# Install psql if you don't have it
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql-client

# Run schema
psql "postgresql://[your-connection-string]" -f database/schema.sql

# Verify tables were created
psql "postgresql://[your-connection-string]" -c "\dt"
```

**Option C: Using Node.js Script**

```bash
# Install pg package
npm install pg

# Create and run migration script
node database/migrate.js
```

### Step 3: Load Seed Data (Optional)

**Load sample data matching the frontend mock data:**

```bash
# Using Neon SQL Editor
# Copy contents of seed.sql and run in SQL Editor

# OR using psql
psql "postgresql://[your-connection-string]" -f database/seed.sql
```

**Verify seed data:**

```sql
-- Check shipments
SELECT id, customer_name, status FROM shipments;

-- Check emails count
SELECT COUNT(*) FROM emails;  -- Should return 10

-- Check quotes
SELECT carrier_name, total_cost, is_selected FROM quotes;

-- Check chat messages
SELECT role, LEFT(message, 50) FROM chat_messages;
```

### Step 4: Connect to Vercel

#### Method 1: Vercel Dashboard (Recommended)

1. **Go to Vercel Project Settings:**
   - Open your `wilson-jr` project on Vercel
   - Navigate to **Settings** → **Environment Variables**

2. **Add Neon Connection String:**
   - Key: `DATABASE_URL`
   - Value: Your Neon connection string
   - Environments: Production, Preview, Development (check all)
   - Click **Save**

3. **Trigger Redeploy:**
   - Go to **Deployments** tab
   - Click on latest deployment
   - Click **Redeploy**

#### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Add environment variable
vercel env add DATABASE_URL

# Paste your Neon connection string when prompted
# Select: Production, Preview, Development

# Pull env to local
vercel env pull .env.local
```

#### Method 3: Neon Vercel Integration (Easiest)

1. **Install Neon Integration:**
   - Go to Vercel Dashboard → **Integrations**
   - Search for "Neon"
   - Click **Add Integration**

2. **Connect Projects:**
   - Select your Vercel project
   - Select your Neon project
   - Integration will automatically add `DATABASE_URL` to Vercel

---

## 🔧 Environment Variables

Create a `.env.local` file in your project root:

```env
# Neon PostgreSQL Database
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# Optional: Separate connection strings for pooling
DATABASE_URL_POOLED="postgresql://user:password@host/database?sslmode=require&pgbouncer=true"
DATABASE_URL_UNPOOLED="postgresql://user:password@host/database?sslmode=require"
```

**Important:** Add `.env.local` to your `.gitignore` (already done)

---

## 📊 Database Schema Details

### Tables

#### 1. shipments
```sql
Primary Key: id (VARCHAR)
Status: pending | quoted | booked | in_transit | delivered | cancelled
Indexes: customer_email, status, created_at, pickup_date, delivery_date
```

#### 2. emails
```sql
Primary Key: id (SERIAL)
Foreign Key: shipment_id → shipments(id)
Types: customer_request, wilson_rfq, carrier_quote, wilson_analysis, booking_confirmation, tracking_update
Indexes: shipment_id, type, created_at, from_email
```

#### 3. quotes
```sql
Primary Key: id (VARCHAR)
Foreign Key: shipment_id → shipments(id)
Indexes: shipment_id, carrier_name, is_selected, is_recommended, total_cost
```

#### 4. chat_messages
```sql
Primary Key: id (SERIAL)
Foreign Key: shipment_id → shipments(id)
Roles: user, assistant, system
Indexes: shipment_id, created_at, role
```

#### 5. tracking_events
```sql
Primary Key: id (SERIAL)
Foreign Key: shipment_id → shipments(id)
Event Types: pickup_scheduled, picked_up, departed_origin, in_transit, arrived_terminal, out_for_delivery, delivered, delayed, exception
Indexes: shipment_id, event_type, occurred_at
```

### Views

#### active_shipments
Shows all active shipments with aggregated counts:
- email_count
- quote_count
- tracking_event_count
- last_tracking_update

#### shipment_inbox
Flattened view of all emails with shipment metadata

---

## 🔌 Connecting from Next.js

### Install Dependencies

```bash
npm install @neondatabase/serverless
# OR
npm install pg
```

### Create Database Client

**File:** `src/lib/db.ts`

```typescript
import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);

// Example usage:
export async function getShipmentEmails(shipmentId: string) {
  const emails = await sql`
    SELECT * FROM emails
    WHERE shipment_id = ${shipmentId}
    ORDER BY created_at DESC
  `;
  return emails;
}
```

### Example API Route

**File:** `src/app/api/shipments/[id]/emails/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const emails = await sql`
      SELECT * FROM emails
      WHERE shipment_id = ${params.id}
      ORDER BY created_at DESC
    `;

    return NextResponse.json(emails);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}
```

---

## 🧪 Testing the Connection

### Quick Test Script

**File:** `database/test-connection.js`

```javascript
const { neon } = require('@neondatabase/serverless');

async function testConnection() {
  const sql = neon(process.env.DATABASE_URL);

  try {
    // Test query
    const result = await sql`SELECT NOW() as current_time`;
    console.log('✅ Database connected!');
    console.log('Current time:', result[0].current_time);

    // Count tables
    const tables = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `;
    console.log(`✅ Found ${tables.length} tables:`, tables.map(t => t.table_name));

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
```

**Run test:**
```bash
node database/test-connection.js
```

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`** - Already in .gitignore ✅
2. **Use connection pooling** - Neon provides this automatically
3. **Enable SSL** - Always use `?sslmode=require` in connection string
4. **Rotate credentials** - Use Neon dashboard to rotate passwords
5. **Use least privilege** - Create separate users for read-only operations

---

## 📈 Monitoring & Maintenance

### Neon Console Features

- **Monitoring:** View query performance, connection stats
- **Branching:** Create database branches for testing
- **Backups:** Automatic point-in-time recovery
- **Scaling:** Auto-suspend during inactivity (saves costs)

### Useful Queries

```sql
-- Count records per table
SELECT
  'shipments' as table_name, COUNT(*) as count FROM shipments
UNION ALL
SELECT 'emails', COUNT(*) FROM emails
UNION ALL
SELECT 'quotes', COUNT(*) FROM quotes
UNION ALL
SELECT 'chat_messages', COUNT(*) FROM chat_messages
UNION ALL
SELECT 'tracking_events', COUNT(*) FROM tracking_events;

-- Recent activity
SELECT * FROM emails ORDER BY created_at DESC LIMIT 10;

-- Shipment summary
SELECT
  status,
  COUNT(*) as count,
  SUM(total_cost) as total_revenue
FROM shipments
GROUP BY status;
```

---

## 🐛 Troubleshooting

### Connection Issues

**Problem:** "Connection timeout"
- **Solution:** Check if `?sslmode=require` is in connection string
- **Solution:** Verify Neon project is active (not suspended)

**Problem:** "Password authentication failed"
- **Solution:** Reset password in Neon Console
- **Solution:** Copy fresh connection string

**Problem:** "Database does not exist"
- **Solution:** Verify database name in connection string
- **Solution:** Check you're using the correct Neon project

### Schema Issues

**Problem:** "Table already exists"
- **Solution:** Drop tables first: `DROP TABLE IF EXISTS [table_name] CASCADE;`
- **Solution:** Or create a new Neon branch

**Problem:** "Foreign key constraint violation"
- **Solution:** Load tables in correct order (shipments first)
- **Solution:** Use `ON DELETE CASCADE` (already in schema)

---

## 🔄 Migration Strategy

### Future Schema Changes

1. **Create migration file:** `database/migrations/001_add_column.sql`
2. **Test in Neon branch:**
   ```bash
   # Create branch in Neon Console
   # Run migration on branch
   # Test with your app
   ```
3. **Apply to production:**
   ```bash
   psql $DATABASE_URL -f database/migrations/001_add_column.sql
   ```

### Rollback Plan

Keep backup of current schema:
```bash
pg_dump $DATABASE_URL --schema-only > database/backups/schema_backup_$(date +%Y%m%d).sql
```

---

## 📚 Resources

- **Neon Docs:** https://neon.tech/docs
- **Vercel PostgreSQL Guide:** https://vercel.com/docs/storage/vercel-postgres
- **Next.js Database Guide:** https://nextjs.org/docs/app/building-your-application/data-fetching
- **PostgreSQL Docs:** https://www.postgresql.org/docs/

---

## ✅ Checklist

- [ ] Create Neon project
- [ ] Copy connection string
- [ ] Run `schema.sql` in Neon SQL Editor
- [ ] Verify tables created (`SELECT * FROM information_schema.tables`)
- [ ] Load `seed.sql` (optional)
- [ ] Add `DATABASE_URL` to Vercel environment variables
- [ ] Test connection from Next.js API route
- [ ] Update frontend to use real API instead of mock data
- [ ] Deploy to Vercel
- [ ] Verify production database connection

---

**Last Updated:** October 29, 2025
**Schema Version:** 1.0
**Compatible with:** PostgreSQL 14+, Neon, Vercel Postgres
