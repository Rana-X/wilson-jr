# Wilson Jr - Email Integration Guide

**Service**: Resend (https://resend.com)
**Domain**: go2irl.com
**Provider**: IONOS DNS
**Status**: ⏳ DNS Propagating (Configuration completed October 31, 2025)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Domain Configuration](#domain-configuration)
3. [DNS Records](#dns-records)
4. [Email Workflow](#email-workflow)
5. [Implementation Plan](#implementation-plan)
6. [Environment Variables](#environment-variables)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Wilson Jr uses **Resend** for all email operations - both sending and receiving emails. The system supports a complete email-driven workflow for freight coordination.

### Email Addresses

| Address | Purpose | Type |
|---------|---------|------|
| `wilson@go2irl.com` | Main AI agent address | Inbound + Outbound |
| `rfq@go2irl.com` | RFQ carrier replies | Inbound |
| `quotes@go2irl.com` | Carrier quote submissions | Inbound |
| `support@go2irl.com` | Customer support | Inbound + Outbound |

### Capabilities

✅ **Outbound Email**
- Send RFQs to carriers
- Send recommendations to customers
- Send booking confirmations
- Send tracking updates
- Send receipts/invoices

✅ **Inbound Email**
- Receive customer requests
- Receive carrier quote responses
- Receive confirmation replies
- Parse email content automatically
- Save to PostgreSQL database

---

## 🌐 Domain Configuration

### Domain Details
- **Domain**: `go2irl.com`
- **Registrar**: IONOS
- **DNS Management**: IONOS DNS Manager
- **Previous Email**: iCloud Mail (replaced with Resend)

### Configuration Date
- **Added to Resend**: October 31, 2025
- **DNS Records Added**: October 31, 2025
- **Verification Status**: ⏳ Pending (10-30 min propagation)

---

## 📝 DNS Records

### Complete DNS Configuration (IONOS)

All records below were added to IONOS DNS on October 31, 2025:

#### 1. DKIM Verification (Domain Authentication)
```
Type: TXT
Host name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDFyQO4I35BEKj/NUiuAfck6vi4xcqFXfv9qCbWWaV5XPH7oGFY+NzZTvmuVTCwVbiwwyMxH8nQVHHwk/n0zkejEhRQHSKN94G9Y//Rsupcq4z+l91sxGuF11EcB5S1WzkNHQMlaFyHbAKSHG8I2PnkQLHG6F0wwYLhKnawVQ7ECwIDAQAB
TTL: 3600
Status: ✅ Added
```

#### 2. SPF Record (Sending Authorization)
```
Type: TXT
Host name: @
Value: v=spf1 include:amazonses.com ~all
TTL: 3600
Status: ✅ Added (replaced iCloud SPF)
```

#### 3. DMARC Policy (Email Authentication)
```
Type: TXT
Host name: _dmarc
Value: v=DMARC1; p=none;
TTL: 3600
Status: ✅ Added
```

#### 4. MX Record - Primary Inbound
```
Type: MX
Host name: @
Value: mx1.resend.com
Priority: 10
TTL: 3600
Status: ✅ Added (replaced iCloud MX)
```

#### 5. MX Record - Backup Inbound
```
Type: MX
Host name: @
Value: mx2.resend.com
Priority: 20
TTL: 3600
Status: ✅ Added (replaced iCloud MX)
```

#### 6. MX Record - Bounce Handling
```
Type: MX
Host name: send
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10
TTL: 3600
Status: ✅ Added
```

#### 7. SPF for Send Subdomain
```
Type: TXT
Host name: send
Value: v=spf1 include:amazonses.com ~all
TTL: 3600
Status: ✅ Added
```

### Removed Records (iCloud Email)

The following iCloud email records were **removed** to enable Resend:

```
❌ MX @ → mx01.mail.icloud.com
❌ MX @ → mx02.mail.icloud.com
❌ TXT @ → "apple-domain=SSFTUGLvOcUOCAn7"
❌ CNAME sig1._domainkey → sig1.dkim.try-irl.com.at.icloudmailadmin.com
```

**Note:** `rana@go2irl.com` no longer routes to iCloud Mail. All email now flows through Resend.

---

## 🔄 Email Workflow

### Complete Email-Driven Freight Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: Customer Sends Request                                  │
│ customer@company.com → wilson@go2irl.com                        │
│ "Need to ship 15 pallets Dallas → Chicago"                     │
└─────────────────────┬───────────────────────────────────────────┘
                      ↓
         ┌────────────────────────┐
         │ Resend Webhook Fires   │
         │ POST /api/webhooks/    │
         │      resend            │
         └────────┬───────────────┘
                  ↓
         ┌────────────────────────┐
         │ Parse Customer Request │
         │ - Extract origin/dest  │
         │ - Extract cargo details│
         │ - Create shipment in DB│
         └────────┬───────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: Wilson Sends RFQs to Carriers                          │
│ wilson@go2irl.com → [5 carrier emails]                         │
│ "Request for Quote: Shipment CART-2025-00123"                  │
└─────────────────────┬───────────────────────────────────────────┘
                      ↓
         ┌────────────────────────┐
         │ resend.emails.send()   │
         │ - XPO Logistics        │
         │ - FedEx Freight        │
         │ - Old Dominion         │
         │ - ABC Trucking         │
         │ - Reliable Freight     │
         └────────┬───────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: Carriers Reply with Quotes (30 min - 4 hours)          │
│ quotes@xpo.com → rfq@go2irl.com                                 │
│ "Our quote: $2,773 for 2-day transit"                          │
└─────────────────────┬───────────────────────────────────────────┘
                      ↓
         ┌────────────────────────┐
         │ Resend Webhook Fires   │
         │ POST /api/webhooks/    │
         │      resend            │
         └────────┬───────────────┘
                  ↓
         ┌────────────────────────┐
         │ Parse Carrier Quote    │
         │ - Extract price        │
         │ - Extract transit days │
         │ - Save to quotes table │
         │ - Save email to DB     │
         └────────┬───────────────┘
                  ↓
         ┌────────────────────────┐
         │ Wilson AI Analyzes     │
         │ - Compare all quotes   │
         │ - Calculate best value │
         │ - Generate recommend.  │
         └────────┬───────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 4: Wilson Sends Recommendation to Customer                │
│ wilson@go2irl.com → customer@company.com                        │
│ "I recommend XPO Logistics ($2,773, 96% OTIF)"                 │
└─────────────────────┬───────────────────────────────────────────┘
                      ↓
         ┌────────────────────────┐
         │ resend.emails.send()   │
         │ - Quote comparison     │
         │ - Risk analysis        │
         │ - Recommendation       │
         └────────┬───────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 5: Customer Confirms Booking                              │
│ customer@company.com → wilson@go2irl.com                        │
│ "Yes, book XPO"                                                 │
└─────────────────────┬───────────────────────────────────────────┘
                      ↓
         ┌────────────────────────┐
         │ Resend Webhook Fires   │
         │ POST /api/webhooks/    │
         │      resend            │
         └────────┬───────────────┘
                  ↓
         ┌────────────────────────┐
         │ Process Confirmation   │
         │ - Update shipment      │
         │ - Book carrier         │
         │ - Generate BOL         │
         │ - Create tracking      │
         └────────┬───────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 6: Wilson Sends Receipt to Customer                       │
│ wilson@go2irl.com → customer@company.com                        │
│ "Booking confirmed! BOL-2025-00123, Tracking: XPO-TRK-789456"  │
└─────────────────────────────────────────────────────────────────┘
                      ↓
         ┌────────────────────────┐
         │ resend.emails.send()   │
         │ - Booking confirmation │
         │ - BOL number           │
         │ - Tracking link        │
         │ - Invoice              │
         └────────────────────────┘
```

### Workflow Timing

| Step | Trigger | Typical Duration |
|------|---------|------------------|
| 1. Customer request | Customer sends email | Instant |
| 2. Wilson sends RFQs | Auto (parse complete) | 5-30 seconds |
| 3. Carriers reply | Manual (carrier staff) | 30 min - 4 hours |
| 4. Wilson recommendation | Auto (all quotes in) | 10-30 seconds |
| 5. Customer confirmation | Customer replies | Minutes - hours |
| 6. Wilson receipt | Auto (confirmation parsed) | 5-10 seconds |

**Total workflow**: 1-8 hours (depending on carrier response time)

---

## 🛠️ Implementation Plan

### Phase 1: Setup (30 minutes)

#### 1.1 Install Dependencies
```bash
npm install resend react-email @react-email/components
```

#### 1.2 Create Resend Client
**File**: `src/lib/resend.ts`
```typescript
import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is required');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Email addresses
export const FROM_EMAIL = process.env.FROM_EMAIL || 'wilson@go2irl.com';
export const RFQ_EMAIL = process.env.RFQ_EMAIL || 'rfq@go2irl.com';
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@go2irl.com';
```

---

### Phase 2: Email Templates (2-3 hours)

#### Directory Structure
```
src/emails/
├── rfq-template.tsx              # RFQ to carriers
├── quote-recommendation.tsx       # Analysis to customer
├── booking-confirmation.tsx       # Confirmation to customer
├── tracking-update.tsx            # Tracking notifications
├── receipt-template.tsx           # Final receipt/BOL
└── components/
    ├── email-layout.tsx           # Shared wrapper
    ├── email-header.tsx           # Wilson Jr branding
    ├── email-button.tsx           # CTA buttons
    └── email-footer.tsx           # Contact info
```

#### Example: RFQ Template
**File**: `src/emails/rfq-template.tsx`
```typescript
import { Html, Head, Body, Container, Heading, Text, Button, Section } from '@react-email/components';

interface RfqTemplateProps {
  carrierName: string;
  shipmentId: string;
  pickupAddress: string;
  deliveryAddress: string;
  pickupDate: string;
  cargoWeight: number;
  cargoPallets: number;
  quoteDeadline: string;
}

export default function RfqTemplate({
  carrierName,
  shipmentId,
  pickupAddress,
  deliveryAddress,
  pickupDate,
  cargoWeight,
  cargoPallets,
  quoteDeadline,
}: RfqTemplateProps) {
  return (
    <Html>
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.h1}>Request for Quote</Heading>

          <Text style={styles.text}>
            Hi {carrierName},
          </Text>

          <Text style={styles.text}>
            Wilson Jr is requesting a freight quote for the following shipment:
          </Text>

          <Section style={styles.infoBox}>
            <Text style={styles.label}>Shipment ID</Text>
            <Text style={styles.value}>{shipmentId}</Text>

            <Text style={styles.label}>Pickup</Text>
            <Text style={styles.value}>{pickupAddress}</Text>
            <Text style={styles.value}>Date: {pickupDate}</Text>

            <Text style={styles.label}>Delivery</Text>
            <Text style={styles.value}>{deliveryAddress}</Text>

            <Text style={styles.label}>Cargo</Text>
            <Text style={styles.value}>
              {cargoWeight} lbs | {cargoPallets} pallets
            </Text>
          </Section>

          <Text style={styles.text}>
            <strong>Quote Deadline:</strong> {quoteDeadline}
          </Text>

          <Button
            href={`https://go2irl.com/quote/${shipmentId}`}
            style={styles.button}
          >
            Submit Quote Online
          </Button>

          <Text style={styles.footer}>
            Or reply to this email with your quote details.
          </Text>

          <Text style={styles.footer}>
            Best regards,<br />
            Wilson Jr Freight Coordination
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: '#f6f9fc',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
  },
  container: {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    maxWidth: '600px',
  },
  h1: {
    color: '#000000',
    fontSize: '24px',
    fontWeight: '600',
    padding: '0 48px',
  },
  text: {
    color: '#333',
    fontSize: '16px',
    lineHeight: '26px',
    padding: '0 48px',
  },
  infoBox: {
    backgroundColor: '#f4f4f5',
    borderRadius: '8px',
    padding: '24px',
    margin: '16px 48px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '4px',
  },
  value: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '12px',
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '12px 24px',
    margin: '16px 48px',
  },
  footer: {
    color: '#666',
    fontSize: '14px',
    lineHeight: '24px',
    padding: '0 48px',
  },
};
```

---

### Phase 3: API Routes (3-4 hours)

#### 3.1 Send RFQ Endpoint
**File**: `src/app/api/emails/send-rfq/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { resend, RFQ_EMAIL } from '@/lib/resend';
import RfqTemplate from '@/emails/rfq-template';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: NextRequest) {
  try {
    const { shipmentId, carriers } = await request.json();

    // Fetch shipment from database
    const [shipment] = await sql`
      SELECT * FROM shipments WHERE id = ${shipmentId}
    `;

    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 });
    }

    // Send emails to all carriers
    const results = await Promise.allSettled(
      carriers.map(async (carrier: any) => {
        const { data, error } = await resend.emails.send({
          from: `Wilson Jr <${RFQ_EMAIL}>`,
          to: carrier.email,
          subject: `RFQ: ${shipment.id} - ${shipment.pickup_address} to ${shipment.delivery_address}`,
          react: RfqTemplate({
            carrierName: carrier.name,
            shipmentId: shipment.id,
            pickupAddress: shipment.pickup_address,
            deliveryAddress: shipment.delivery_address,
            pickupDate: shipment.pickup_date,
            cargoWeight: shipment.cargo_details.weight,
            cargoPallets: shipment.cargo_details.pallets,
            quoteDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          }),
          replyTo: RFQ_EMAIL,
        });

        if (error) throw error;

        // Save email to database
        await sql`
          INSERT INTO emails (
            shipment_id, type, from_email, from_name, to_email, to_name,
            subject, body, preview, badge
          ) VALUES (
            ${shipment.id}, 'wilson_rfq', ${RFQ_EMAIL}, 'Wilson Jr',
            ${carrier.email}, ${carrier.name}, 'RFQ sent',
            'Request for Quote email', 'RFQ sent to carrier', 'QUOTE'
          )
        `;

        return { carrier: carrier.name, emailId: data?.id };
      })
    );

    // Update shipment status
    await sql`
      UPDATE shipments SET status = 'quoted', updated_at = CURRENT_TIMESTAMP
      WHERE id = ${shipmentId}
    `;

    return NextResponse.json({
      success: true,
      message: `RFQs sent to ${carriers.length} carriers`,
      results,
    });
  } catch (error) {
    console.error('Error sending RFQs:', error);
    return NextResponse.json({ error: 'Failed to send RFQs' }, { status: 500 });
  }
}
```

#### 3.2 Webhook Handler
**File**: `src/app/api/webhooks/resend/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    // Handle different event types
    switch (payload.type) {
      case 'email.received':
        return handleInboundEmail(payload.data);

      case 'email.delivered':
        return handleEmailDelivered(payload.data);

      case 'email.bounced':
        return handleEmailBounced(payload.data);

      default:
        console.log('Unhandled event:', payload.type);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}

async function handleInboundEmail(data: any) {
  const { from, to, subject, text, html } = data;

  // Extract shipment ID from subject
  const shipmentIdMatch = subject.match(/CART-\d{4}-\d{5}/);
  const shipmentId = shipmentIdMatch ? shipmentIdMatch[0] : null;

  if (!shipmentId) {
    console.error('No shipment ID in subject');
    return NextResponse.json({ error: 'Missing shipment ID' }, { status: 400 });
  }

  // Determine email type
  const isQuote = subject.toLowerCase().includes('quote');
  const isConfirmation = subject.toLowerCase().includes('confirm') ||
                         text.toLowerCase().includes('book') ||
                         text.toLowerCase().includes('yes');

  // Save email to database
  await sql`
    INSERT INTO emails (
      shipment_id, type, from_email, from_name, to_email,
      subject, body, preview, badge
    ) VALUES (
      ${shipmentId},
      ${isQuote ? 'carrier_quote' : isConfirmation ? 'customer_confirmation' : 'customer_request'},
      ${from.email},
      ${from.name || from.email},
      ${to[0]?.email},
      ${subject},
      ${html || text},
      ${(text || '').substring(0, 100)},
      ${isQuote ? 'QUOTE' : 'NEW'}
    )
  `;

  // If it's a quote, parse and save to quotes table
  if (isQuote) {
    const quoteData = parseQuoteFromEmail(text || html);
    if (quoteData) {
      await sql`
        INSERT INTO quotes (
          id, shipment_id, carrier_name, carrier_email,
          total_cost, transit_days
        ) VALUES (
          ${`quote-${Date.now()}`},
          ${shipmentId},
          ${from.name || from.email},
          ${from.email},
          ${quoteData.totalCost},
          ${quoteData.transitDays}
        )
      `;
    }
  }

  return NextResponse.json({ success: true });
}

function parseQuoteFromEmail(body: string): any {
  // Simple regex parsing (can be enhanced with AI/LLM)
  const totalMatch = body.match(/total[:\s]+\$?([\d,]+\.?\d*)/i);
  const transitMatch = body.match(/transit[:\s]+(\d+)\s*days?/i);

  if (!totalMatch) return null;

  return {
    totalCost: parseFloat(totalMatch[1].replace(/,/g, '')),
    transitDays: transitMatch ? parseInt(transitMatch[1]) : 5,
  };
}

async function handleEmailDelivered(data: any) {
  console.log('Email delivered:', data.email_id);
  // Could update email status in database
}

async function handleEmailBounced(data: any) {
  console.error('Email bounced:', data.email_id);
  // Could log bounce, notify admin
}
```

---

## 🔐 Environment Variables

### Required Variables

Create/update `.env.local`:

```bash
# ============================================================================
# RESEND EMAIL (Required)
# ============================================================================
RESEND_API_KEY=re_9e6mVPt9_FfeDHVoLN97DzPSCTCTvi6ro
RESEND_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx  # Get from Resend dashboard

# Email addresses
FROM_EMAIL=wilson@go2irl.com
RFQ_EMAIL=rfq@go2irl.com
SUPPORT_EMAIL=support@go2irl.com

# ============================================================================
# NEON DATABASE (Required)
# ============================================================================
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# ============================================================================
# NEXT.JS (Optional)
# ============================================================================
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### Vercel Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

1. `RESEND_API_KEY` - Your Resend API key
2. `RESEND_WEBHOOK_SECRET` - From Resend webhook settings
3. `FROM_EMAIL` - wilson@go2irl.com
4. `RFQ_EMAIL` - rfq@go2irl.com
5. `DATABASE_URL` - Your Neon connection string

Select: **Production**, **Preview**, **Development** for all

---

## 🧪 Testing

### Local Testing

#### Test Email Sending
```bash
# Start dev server
npm run dev

# Test send RFQ (use curl or Postman)
curl -X POST http://localhost:3000/api/emails/send-rfq \
  -H "Content-Type: application/json" \
  -d '{
    "shipmentId": "CART-2025-00123",
    "carriers": [
      {"name": "Test Carrier", "email": "your-test-email@gmail.com"}
    ]
  }'
```

#### Test Webhook (Manual Trigger)
```bash
curl -X POST http://localhost:3000/api/webhooks/resend \
  -H "Content-Type: application/json" \
  -d '{
    "type": "email.received",
    "data": {
      "from": {"email": "test@carrier.com", "name": "Test Carrier"},
      "to": [{"email": "rfq@go2irl.com"}],
      "subject": "Re: RFQ CART-2025-00123",
      "text": "Our quote is $2,500 for 3 days transit"
    }
  }'
```

### Production Testing

1. **Send test email to wilson@go2irl.com**
2. **Check Resend dashboard** for webhook events
3. **Verify database** - Check `emails` table for new entry
4. **Test reply** - Reply to email, check webhook fires

---

## 🐛 Troubleshooting

### DNS Not Verified in Resend

**Problem**: Resend dashboard shows "DNS records not found"

**Solutions**:
1. Wait 10-30 minutes for DNS propagation
2. Check IONOS DNS records are exactly as shown above
3. Use https://dnschecker.org to verify MX records worldwide
4. Click "Verify Records" button in Resend dashboard
5. Contact IONOS support if records not propagating after 24 hours

---

### Email Not Received

**Problem**: Sent email via Resend but not received

**Solutions**:
1. Check spam folder
2. Check Resend dashboard → Emails → Click email → See delivery status
3. Verify recipient email address is correct
4. Check SPF/DKIM records are verified in Resend
5. Wait a few minutes (email delivery can take 1-5 minutes)

---

### Webhook Not Firing

**Problem**: Email sent to wilson@go2irl.com but webhook not triggered

**Solutions**:
1. Verify webhook URL in Resend dashboard: `https://your-app.vercel.app/api/webhooks/resend`
2. Check webhook secret matches `RESEND_WEBHOOK_SECRET` env var
3. Test webhook manually with curl (see Testing section)
4. Check Vercel logs for webhook errors
5. Ensure webhook endpoint is deployed (not just local)

---

### Quote Parsing Fails

**Problem**: Carrier sends quote but price not extracted

**Solutions**:
1. Check carrier email format - may need custom parsing logic
2. Use AI/LLM (OpenAI) for better parsing:
   ```typescript
   import OpenAI from 'openai';
   const openai = new OpenAI();

   const response = await openai.chat.completions.create({
     model: 'gpt-4',
     messages: [{
       role: 'system',
       content: 'Extract quote details from email. Return JSON with: totalCost, transitDays',
     }, {
       role: 'user',
       content: emailBody,
     }],
     response_format: { type: 'json_object' },
   });
   ```
3. Log unparsed emails for manual review
4. Add fallback to manual quote entry

---

## 📚 Additional Resources

- **Resend Docs**: https://resend.com/docs
- **React Email Docs**: https://react.email/docs
- **Vercel Logs**: https://vercel.com/your-project/logs
- **IONOS DNS**: https://my.ionos.com
- **Neon Dashboard**: https://console.neon.tech

---

## ✅ Verification Checklist

Before going live, verify:

- [ ] Domain verified in Resend dashboard (green checkmarks)
- [ ] All 7 DNS records added to IONOS
- [ ] Webhook URL configured in Resend
- [ ] Environment variables added to Vercel
- [ ] Test email sent and received successfully
- [ ] Webhook test passes (check Vercel logs)
- [ ] Database connection works (run `npm run db:test`)
- [ ] Email templates look correct (send test to yourself)

---

**Status**: ⏳ **DNS Propagating** - Check back in 10-30 minutes
**Last Updated**: October 31, 2025
**Next Action**: Verify domain in Resend dashboard after DNS propagation
