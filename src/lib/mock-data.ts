import { EmailThread, ChatMessage } from "./types";

export const mockEmails: EmailThread[] = [
  {
    id: 1,
    type: "customer",
    from: "David Martinez",
    email: "david.martinez@furniturepro.com",
    subject: "Shipment Request - Dallas to Chicago",
    preview: "Need to ship 15 pallets of office furniture...",
    body: `Hi Wilson,

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
David`,
    timestamp: "May 15, 9:42am",
    badge: "NEW"
  },
  {
    id: 2,
    type: "wilson",
    from: "Wilson AI",
    email: "wilson@cartage.ai",
    subject: "RFQ Sent to 5 Carriers",
    preview: "Requesting quotes from XPO, FedEx, Old Dominion...",
    body: `Analyzing your request...

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

Wilson`,
    timestamp: "May 15, 10:16am"
  },
  {
    id: 3,
    type: "carrier",
    from: "XPO Logistics",
    email: "quotes.central@xpofreight.com",
    subject: "Quote: $2,773 | 2 days | 96% OTIF",
    preview: "Transit: 2 days | OTIF: 96% | Delivers May 22",
    body: `Good morning Wilson,

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
XPO Logistics`,
    timestamp: "May 15, 10:18am",
    badge: "QUOTE"
  },
  {
    id: 4,
    type: "carrier",
    from: "FedEx Freight",
    email: "national.quotes@fedexfreight.com",
    subject: "Quote: $3,167 | 2 days | 97% OTIF",
    preview: "Premium service with guarantee",
    body: `FedEx Freight Quote:

- Line Haul: $2,650.00
- Fuel Surcharge (19.5%): $516.75
- Total: $3,167.00

Service: FedEx Freight Priority (2 days, guaranteed)
OTIF: 97%

Quote expires May 16, 5pm CST.

FedEx Freight Quote Team`,
    timestamp: "May 15, 10:19am",
    badge: "QUOTE"
  },
  {
    id: 5,
    type: "carrier",
    from: "Old Dominion",
    email: "ltl.quotes@odfl.com",
    subject: "Quote: $2,900 | 2 days",
    preview: "Direct LTL service",
    body: `Wilson,

We can handle this.

Rate: $2,900 all-in (includes fuel)
Transit: 2 days
Service: Direct LTL
OTIF: 95%

Let me know if you want to book.

Marcus Williams
Old Dominion Freight Line`,
    timestamp: "May 15, 10:20am",
    badge: "QUOTE"
  },
  {
    id: 6,
    type: "carrier",
    from: "ABC Trucking",
    email: "dispatch@abctrucking.net",
    subject: "Quote: $2,200 | 3-4 days",
    preview: "Budget option",
    body: `hey wilson

we can do dallas to chicago for $2200. thats our best price. will take about 3 days maybe 4 depends on other pickups we got.

pickup anytime that week is fine.

u want it let me know asap we filling up.

tony
ABC Trucking`,
    timestamp: "May 15, 11:42am",
    badge: "QUOTE"
  },
  {
    id: 7,
    type: "wilson",
    from: "Wilson AI",
    email: "wilson@cartage.ai",
    subject: "Analysis Complete - XPO Recommended",
    preview: "Analyzed 5 quotes. Best value: XPO Logistics",
    body: `Analysis complete. Here's my recommendation:

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

Wilson`,
    timestamp: "May 15, 12:03pm",
    badge: "RECOMMEND"
  },
  {
    id: 8,
    type: "wilson",
    from: "Wilson AI",
    email: "wilson@cartage.ai",
    subject: "✅ Booking Confirmed - XPO Logistics",
    preview: "Booked with XPO | BOL-2025-00123 | Tracking active",
    body: `Booking confirmed!

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

I'll monitor tracking and send updates.

Wilson`,
    timestamp: "May 15, 12:25pm",
    badge: "BOOKED"
  },
  {
    id: 9,
    type: "tracking",
    from: "XPO Tracking",
    email: "tracking@xpofreight.com",
    subject: "Pickup Complete",
    preview: "✓ Picked up from Dallas warehouse",
    body: `Shipment XPO-TRK-789456

Status: Picked up
Time: May 20, 2025 8:15am CDT
Location: Dallas, TX

Driver: Carlos M. (XPO-DR-4521)
Next stop: Dallas Terminal
Expected arrival Chicago: May 22, 11:00am

BOL signed by: Jake R.
Pieces: 15 pallets
Weight confirmed: 18,200 lbs

Tracking: https://xpo.com/track/789456`,
    timestamp: "May 20, 8:15am"
  },
  {
    id: 10,
    type: "tracking",
    from: "XPO Tracking",
    email: "tracking@xpofreight.com",
    subject: "In Transit - Chicago Bound",
    preview: "🚚 Departed Dallas terminal, en route Chicago",
    body: `Shipment XPO-TRK-789456

Status: In Transit
Time: May 20, 2025 2:30pm CDT
Location: Departed Dallas Terminal

Current position: I-35N, Oklahoma
Next checkpoint: Chicago Terminal
ETA Chicago: May 21, 6:00am

On schedule for May 22 delivery.`,
    timestamp: "May 20, 2:30pm"
  }
];

export const mockChatHistory: ChatMessage[] = [
  {
    role: "user",
    message: "Why did you choose XPO over ABC Trucking?"
  },
  {
    role: "assistant",
    message: "XPO costs $573 more but has 96% OTIF vs ABC's 78%. For your $45k cargo, ABC's 22% failure rate means expected penalty costs of $297. XPO is worth the premium for reliability. Your customer is important, so the extra $276 buys peace of mind."
  },
  {
    role: "user",
    message: "What's the current delivery ETA?"
  },
  {
    role: "assistant",
    message: "Tracking shows pickup completed May 20 at 8:15am. Currently in transit from Dallas terminal. ETA Chicago delivery: May 22, 11:00am. Shipment is on schedule."
  },
];
