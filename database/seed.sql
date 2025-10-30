-- ============================================================================
-- WILSON JR SEED DATA
-- Sample data matching the mock data from the frontend
-- Shipment: CART-2025-00123 (Dallas → Chicago furniture shipment)
-- ============================================================================

-- ============================================================================
-- 1. INSERT SHIPMENT
-- ============================================================================

INSERT INTO shipments (
    id,
    customer_email,
    customer_name,
    status,
    pickup_address,
    pickup_date,
    delivery_address,
    delivery_date,
    cargo_details,
    selected_carrier,
    total_cost,
    created_at
) VALUES (
    'CART-2025-00123',
    'david.martinez@furniturepro.com',
    'David Martinez',
    'in_transit',
    '4521 Industrial Blvd, Dallas, TX 75207',
    '2025-05-20 08:00:00-05',
    '328 W Monroe St, Chicago, IL 60606',
    '2025-05-22 17:00:00-05',
    '{
        "weight": 18000,
        "weight_unit": "lbs",
        "pallets": 15,
        "pallet_type": "48x40",
        "max_height": 6,
        "commodity": "office furniture",
        "items": ["desks", "filing cabinets"],
        "value": 45000,
        "freight_class": 150,
        "stackable": true,
        "hazmat": false
    }'::jsonb,
    'XPO Logistics',
    2773.00,
    '2025-05-15 09:42:00-05'
);

-- ============================================================================
-- 2. INSERT EMAILS (10 emails matching mock data)
-- ============================================================================

INSERT INTO emails (shipment_id, type, from_email, from_name, to_email, to_name, subject, body, preview, badge, created_at) VALUES

-- Email 1: Customer Request
('CART-2025-00123', 'customer_request', 'david.martinez@furniturepro.com', 'David Martinez', 'wilson@cartage.ai', 'Wilson AI',
'Shipment Request - Dallas to Chicago',
'Hi Wilson,

Need to get a shipment to one of our Chicago customers ASAP.

PICKUP:
- Location: Our Dallas warehouse, 4521 Industrial Blvd, Dallas, TX 75207
- Date: May 20th (Monday morning, anytime after 8am)
- Contact: Jake in shipping - (214) 555-0182
- Loading dock available

DELIVERY:
- Location: Midtown Office Supply, 328 W Monroe St, Chicago, IL 60606
- Deliver by: May 23rd (Thursday)
- Contact: Sarah Chen - (312) 555-0194
- They have a loading dock, business hours 7am-4pm

CARGO:
- 15 pallets of office furniture (desks and filing cabinets)
- Total weight: approximately 18,000 lbs
- Dimensions: Standard 48x40 pallets, tallest is about 6 feet
- Value: ~$45,000
- Needs standard dry van, nothing fragile

Please get me a few quotes and book the best option. Customer is important, so reliability matters more than saving $100.

Thanks,
David',
'Need to ship 15 pallets of office furniture...',
'NEW',
'2025-05-15 09:42:00-05'),

-- Email 2: Wilson RFQ
('CART-2025-00123', 'wilson_rfq', 'wilson@cartage.ai', 'Wilson AI', 'david.martinez@furniturepro.com', 'David Martinez',
'RFQ Sent to 5 Carriers',
'Analyzing your request...

Shipment Details:
- Type: LTL (18,000 lbs - under 20k threshold)
- Route: Dallas, TX → Chicago, IL (925 miles)
- Freight Class: 150 (furniture)
- Timeline: 3 days available

Sending RFQs to 5 carriers:
✓ XPO Logistics
✓ Old Dominion
✓ FedEx Freight
✓ ABC Trucking
✓ Reliable Freight

Expected response time: 10-30 minutes

Wilson',
'Requesting quotes from XPO, FedEx, Old Dominion...',
NULL,
'2025-05-15 10:16:00-05'),

-- Email 3: XPO Quote
('CART-2025-00123', 'carrier_quote', 'quotes.central@xpofreight.com', 'XPO Logistics', 'wilson@cartage.ai', 'Wilson AI',
'Quote: $2,773 | 2 days | 96% OTIF',
'Good morning Wilson,

Quote Details:
- Base Rate: $2,350.00
- Fuel Surcharge (18%): $423.00
- Total: $2,773.00

Service:
- Transit Time: 2 business days
- Service: LTL via Chicago terminal
- Delivery: May 22 (Wednesday)
- OTIF Score: 96% on this lane

Quote valid 48 hours.

Jennifer Morrison
XPO Logistics',
'Transit: 2 days | OTIF: 96% | Delivers May 22',
'QUOTE',
'2025-05-15 10:18:00-05'),

-- Email 4: FedEx Quote
('CART-2025-00123', 'carrier_quote', 'national.quotes@fedexfreight.com', 'FedEx Freight', 'wilson@cartage.ai', 'Wilson AI',
'Quote: $3,167 | 2 days | 97% OTIF',
'FedEx Freight Quote:

- Line Haul: $2,650.00
- Fuel Surcharge (19.5%): $516.75
- Total: $3,167.00

Service: FedEx Freight Priority (2 days, guaranteed)
OTIF: 97%

Quote expires May 16, 5pm CST.

FedEx Freight Quote Team',
'Premium service with guarantee',
'QUOTE',
'2025-05-15 10:19:00-05'),

-- Email 5: Old Dominion Quote
('CART-2025-00123', 'carrier_quote', 'ltl.quotes@odfl.com', 'Old Dominion', 'wilson@cartage.ai', 'Wilson AI',
'Quote: $2,900 | 2 days',
'Wilson,

We can handle this.

Rate: $2,900 all-in (includes fuel)
Transit: 2 days
Service: Direct LTL
OTIF: 95%

Let me know if you want to book.

Marcus Williams
Old Dominion Freight Line',
'Direct LTL service',
'QUOTE',
'2025-05-15 10:20:00-05'),

-- Email 6: ABC Trucking Quote
('CART-2025-00123', 'carrier_quote', 'dispatch@abctrucking.net', 'ABC Trucking', 'wilson@cartage.ai', 'Wilson AI',
'Quote: $2,200 | 3-4 days',
'hey wilson

we can do dallas to chicago for $2200. thats our best price. will take about 3 days maybe 4 depends on other pickups we got.

pickup anytime that week is fine.

u want it let me know asap we filling up.

tony
ABC Trucking',
'Budget option',
'QUOTE',
'2025-05-15 11:42:00-05'),

-- Email 7: Wilson Analysis
('CART-2025-00123', 'wilson_analysis', 'wilson@cartage.ai', 'Wilson AI', 'david.martinez@furniturepro.com', 'David Martinez',
'Analysis Complete - XPO Recommended',
'Analysis complete. Here''s my recommendation:

RECOMMENDATION: XPO Logistics ($2,773)

Why XPO wins:
1. Best value (2nd lowest price, high reliability)
2. 96% OTIF score (excellent)
3. Delivers May 22 (1 day early)
4. Professional carrier with good track record

Comparison:
- XPO: $2,773 | 96% OTIF | 2 days ⭐ BEST VALUE
- Old Dominion: $2,900 | 95% OTIF | 2 days
- FedEx: $3,167 | 97% OTIF | 2 days (premium)
- ABC: $2,200 | 78% OTIF | 3-4 days ⚠️ RISKY

Risk Analysis:
ABC saves $573 but has 22% failure rate. With $45k cargo value, expected penalty cost is $297. Real cost difference is only $276, but with much higher customer satisfaction risk.

Reply "BOOK XPO" to proceed.

Wilson',
'Analyzed 5 quotes. Best value: XPO Logistics',
'RECOMMEND',
'2025-05-15 12:03:00-05'),

-- Email 8: Booking Confirmation
('CART-2025-00123', 'booking_confirmation', 'wilson@cartage.ai', 'Wilson AI', 'david.martinez@furniturepro.com', 'David Martinez',
'✅ Booking Confirmed - XPO Logistics',
'Booking confirmed!

Carrier: XPO Logistics
BOL: BOL-2025-00123
Tracking: XPO-TRK-789456
Total Cost: $2,773.00

Pickup scheduled:
Date: May 20, 2025
Time: 8:00am - 12:00pm
Location: 4521 Industrial Blvd, Dallas, TX

Expected delivery:
Date: May 22, 2025
Time: By end of business day
Location: 328 W Monroe St, Chicago, IL

Invoice sent separately.

I''ll monitor tracking and send updates.

Wilson',
'Booked with XPO | BOL-2025-00123 | Tracking active',
'BOOKED',
'2025-05-15 12:25:00-05'),

-- Email 9: Pickup Complete
('CART-2025-00123', 'tracking_update', 'tracking@xpofreight.com', 'XPO Tracking', 'wilson@cartage.ai', 'Wilson AI',
'Pickup Complete',
'Shipment XPO-TRK-789456

Status: Picked up
Time: May 20, 2025 8:15am CDT
Location: Dallas, TX

Driver: Carlos M. (XPO-DR-4521)
Next stop: Dallas Terminal
Expected arrival Chicago: May 22, 11:00am

BOL signed by: Jake R.
Pieces: 15 pallets
Weight confirmed: 18,200 lbs

Tracking: https://xpo.com/track/789456',
'✓ Picked up from Dallas warehouse',
NULL,
'2025-05-20 08:15:00-05'),

-- Email 10: In Transit Update
('CART-2025-00123', 'tracking_update', 'tracking@xpofreight.com', 'XPO Tracking', 'wilson@cartage.ai', 'Wilson AI',
'In Transit - Chicago Bound',
'Shipment XPO-TRK-789456

Status: In Transit
Time: May 20, 2025 2:30pm CDT
Location: Departed Dallas Terminal

Current position: I-35N, Oklahoma
Next checkpoint: Chicago Terminal
ETA Chicago: May 21, 6:00am

On schedule for May 22 delivery.',
'🚚 Departed Dallas terminal, en route Chicago',
NULL,
'2025-05-20 14:30:00-05');

-- ============================================================================
-- 3. INSERT QUOTES (4 carrier quotes)
-- ============================================================================

INSERT INTO quotes (
    id, shipment_id, carrier_name, carrier_email, total_cost, base_rate,
    fuel_surcharge, transit_days, otif_score, service_type, is_selected,
    is_recommended, quote_valid_until, created_at
) VALUES

-- XPO Quote (Selected & Recommended)
('quote-xpo-001', 'CART-2025-00123', 'XPO Logistics', 'quotes.central@xpofreight.com',
2773.00, 2350.00, 423.00, 2, 96, 'LTL', TRUE, TRUE,
'2025-05-17 10:18:00-05', '2025-05-15 10:18:00-05'),

-- FedEx Quote
('quote-fedex-001', 'CART-2025-00123', 'FedEx Freight', 'national.quotes@fedexfreight.com',
3167.00, 2650.00, 516.75, 2, 97, 'Freight Priority', FALSE, FALSE,
'2025-05-16 17:00:00-05', '2025-05-15 10:19:00-05'),

-- Old Dominion Quote
('quote-odfl-001', 'CART-2025-00123', 'Old Dominion', 'ltl.quotes@odfl.com',
2900.00, 2900.00, 0.00, 2, 95, 'Direct LTL', FALSE, FALSE,
'2025-05-17 10:20:00-05', '2025-05-15 10:20:00-05'),

-- ABC Trucking Quote
('quote-abc-001', 'CART-2025-00123', 'ABC Trucking', 'dispatch@abctrucking.net',
2200.00, 2200.00, 0.00, 4, 78, 'LTL', FALSE, FALSE,
'2025-05-17 11:42:00-05', '2025-05-15 11:42:00-05');

-- ============================================================================
-- 4. INSERT CHAT MESSAGES (4 messages matching mock data)
-- ============================================================================

INSERT INTO chat_messages (shipment_id, role, message, created_at) VALUES

('CART-2025-00123', 'user', 'Why did you choose XPO over ABC Trucking?',
'2025-05-15 12:10:00-05'),

('CART-2025-00123', 'assistant', 'XPO costs $573 more but has 96% OTIF vs ABC''s 78%. For your $45k cargo, ABC''s 22% failure rate means expected penalty costs of $297. XPO is worth the premium for reliability. Your customer is important, so the extra $276 buys peace of mind.',
'2025-05-15 12:10:15-05'),

('CART-2025-00123', 'user', 'What''s the current delivery ETA?',
'2025-05-20 15:00:00-05'),

('CART-2025-00123', 'assistant', 'Tracking shows pickup completed May 20 at 8:15am. Currently in transit from Dallas terminal. ETA Chicago delivery: May 22, 11:00am. Shipment is on schedule.',
'2025-05-20 15:00:10-05');

-- ============================================================================
-- 5. INSERT TRACKING EVENTS (5 events)
-- ============================================================================

INSERT INTO tracking_events (
    shipment_id, event_type, location, description,
    carrier_tracking_number, driver_name, occurred_at, created_at
) VALUES

-- Pickup scheduled
('CART-2025-00123', 'pickup_scheduled', 'Dallas, TX',
'Pickup scheduled for May 20, 8:00am - 12:00pm at 4521 Industrial Blvd, Dallas, TX 75207',
'XPO-TRK-789456', NULL,
'2025-05-15 12:25:00-05', '2025-05-15 12:25:00-05'),

-- Picked up
('CART-2025-00123', 'picked_up', 'Dallas, TX',
'Picked up from Dallas warehouse. BOL signed by Jake R. 15 pallets, 18,200 lbs confirmed.',
'XPO-TRK-789456', 'Carlos M.',
'2025-05-20 08:15:00-05', '2025-05-20 08:15:00-05'),

-- Departed origin terminal
('CART-2025-00123', 'departed_origin', 'Dallas Terminal, TX',
'Departed Dallas terminal, en route to Chicago',
'XPO-TRK-789456', 'Carlos M.',
'2025-05-20 14:30:00-05', '2025-05-20 14:30:00-05'),

-- In transit checkpoint
('CART-2025-00123', 'in_transit', 'I-35N, Oklahoma',
'In transit, on schedule. Current position: I-35N, Oklahoma',
'XPO-TRK-789456', 'Carlos M.',
'2025-05-20 18:00:00-05', '2025-05-20 18:00:00-05'),

-- Arrived at destination terminal
('CART-2025-00123', 'arrived_terminal', 'Chicago Terminal, IL',
'Arrived at Chicago terminal. Preparing for final delivery.',
'XPO-TRK-789456', NULL,
'2025-05-21 06:00:00-05', '2025-05-21 06:00:00-05');

-- ============================================================================
-- VERIFICATION QUERIES
-- (Comment these out before running, they're just for testing)
-- ============================================================================

/*
-- Verify shipment
SELECT * FROM shipments;

-- Verify emails (should show 10)
SELECT id, shipment_id, type, from_name, subject, badge, created_at
FROM emails
ORDER BY created_at;

-- Verify quotes (should show 4, XPO selected)
SELECT id, carrier_name, total_cost, transit_days, otif_score, is_selected, is_recommended
FROM quotes
ORDER BY total_cost;

-- Verify chat messages (should show 4)
SELECT id, role, LEFT(message, 50) as message_preview, created_at
FROM chat_messages
ORDER BY created_at;

-- Verify tracking events (should show 5)
SELECT id, event_type, location, occurred_at
FROM tracking_events
ORDER BY occurred_at;

-- View shipment inbox
SELECT * FROM shipment_inbox ORDER BY created_at DESC;

-- View active shipments summary
SELECT * FROM active_shipments;
*/

-- ============================================================================
-- END OF SEED DATA
-- ============================================================================
