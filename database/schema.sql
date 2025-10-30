-- ============================================================================
-- WILSON JR DATABASE SCHEMA
-- PostgreSQL schema for Neon database
-- Created: October 29, 2025
-- ============================================================================

-- Enable UUID extension (optional, if you want to use UUIDs)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. SHIPMENTS TABLE
-- Main table storing all shipment information
-- ============================================================================

CREATE TABLE shipments (
    id VARCHAR(50) PRIMARY KEY,  -- e.g., "CART-2025-00123"
    customer_email VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    pickup_address TEXT NOT NULL,
    pickup_date TIMESTAMP WITH TIME ZONE,
    delivery_address TEXT NOT NULL,
    delivery_date TIMESTAMP WITH TIME ZONE,
    cargo_details JSONB NOT NULL,  -- {weight, pallets, commodity, dimensions, etc.}
    selected_carrier VARCHAR(100),
    total_cost DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT status_check CHECK (
        status IN ('pending', 'quoted', 'booked', 'in_transit', 'delivered', 'cancelled')
    )
);

-- Indexes for shipments
CREATE INDEX idx_shipments_customer_email ON shipments(customer_email);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_created_at ON shipments(created_at DESC);
CREATE INDEX idx_shipments_pickup_date ON shipments(pickup_date);
CREATE INDEX idx_shipments_delivery_date ON shipments(delivery_date);

-- ============================================================================
-- 2. EMAILS TABLE
-- All email communications related to shipments
-- ============================================================================

CREATE TABLE emails (
    id SERIAL PRIMARY KEY,
    shipment_id VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    from_email VARCHAR(255) NOT NULL,
    from_name VARCHAR(255),
    to_email VARCHAR(255) NOT NULL,
    to_name VARCHAR(255),
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    preview TEXT,  -- First 100 chars for inbox preview
    badge VARCHAR(20),  -- NEW, QUOTE, RECOMMEND, BOOKED, URGENT
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key
    CONSTRAINT fk_emails_shipment
        FOREIGN KEY (shipment_id)
        REFERENCES shipments(id)
        ON DELETE CASCADE,

    -- Constraints
    CONSTRAINT type_check CHECK (
        type IN ('customer_request', 'wilson_rfq', 'carrier_quote', 'wilson_analysis',
                 'booking_confirmation', 'tracking_update', 'wilson_notification')
    ),
    CONSTRAINT badge_check CHECK (
        badge IN ('NEW', 'QUOTE', 'RECOMMEND', 'BOOKED', 'URGENT', NULL)
    )
);

-- Indexes for emails
CREATE INDEX idx_emails_shipment_id ON emails(shipment_id);
CREATE INDEX idx_emails_type ON emails(type);
CREATE INDEX idx_emails_created_at ON emails(created_at DESC);
CREATE INDEX idx_emails_from_email ON emails(from_email);

-- ============================================================================
-- 3. QUOTES TABLE
-- Carrier quotes for shipments
-- ============================================================================

CREATE TABLE quotes (
    id VARCHAR(100) PRIMARY KEY,  -- e.g., "quote-xpo-001"
    shipment_id VARCHAR(50) NOT NULL,
    carrier_name VARCHAR(100) NOT NULL,
    carrier_email VARCHAR(255),
    total_cost DECIMAL(10, 2) NOT NULL,
    base_rate DECIMAL(10, 2) NOT NULL,
    fuel_surcharge DECIMAL(10, 2) DEFAULT 0,
    transit_days INTEGER NOT NULL,
    otif_score INTEGER,  -- On-Time-In-Full score (0-100)
    service_type VARCHAR(100),  -- e.g., "LTL", "FTL", "Expedited"
    is_selected BOOLEAN DEFAULT FALSE,
    is_recommended BOOLEAN DEFAULT FALSE,  -- Wilson's recommendation
    quote_valid_until TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key
    CONSTRAINT fk_quotes_shipment
        FOREIGN KEY (shipment_id)
        REFERENCES shipments(id)
        ON DELETE CASCADE,

    -- Constraints
    CONSTRAINT otif_score_check CHECK (otif_score >= 0 AND otif_score <= 100),
    CONSTRAINT transit_days_check CHECK (transit_days > 0)
);

-- Indexes for quotes
CREATE INDEX idx_quotes_shipment_id ON quotes(shipment_id);
CREATE INDEX idx_quotes_carrier_name ON quotes(carrier_name);
CREATE INDEX idx_quotes_is_selected ON quotes(is_selected) WHERE is_selected = TRUE;
CREATE INDEX idx_quotes_is_recommended ON quotes(is_recommended) WHERE is_recommended = TRUE;
CREATE INDEX idx_quotes_total_cost ON quotes(total_cost);

-- ============================================================================
-- 4. CHAT_MESSAGES TABLE
-- Chat history between user and Wilson AI
-- ============================================================================

CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    shipment_id VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    metadata JSONB,  -- Optional: store additional context, sources, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key
    CONSTRAINT fk_chat_messages_shipment
        FOREIGN KEY (shipment_id)
        REFERENCES shipments(id)
        ON DELETE CASCADE,

    -- Constraints
    CONSTRAINT role_check CHECK (role IN ('user', 'assistant', 'system'))
);

-- Indexes for chat_messages
CREATE INDEX idx_chat_messages_shipment_id ON chat_messages(shipment_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX idx_chat_messages_role ON chat_messages(role);

-- ============================================================================
-- 5. TRACKING_EVENTS TABLE
-- Real-time shipment tracking updates
-- ============================================================================

CREATE TABLE tracking_events (
    id SERIAL PRIMARY KEY,
    shipment_id VARCHAR(50) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    location_lat DECIMAL(10, 7),  -- Optional: latitude for mapping
    location_lng DECIMAL(10, 7),  -- Optional: longitude for mapping
    description TEXT NOT NULL,
    carrier_tracking_number VARCHAR(100),
    driver_name VARCHAR(255),
    occurred_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    -- Foreign key
    CONSTRAINT fk_tracking_events_shipment
        FOREIGN KEY (shipment_id)
        REFERENCES shipments(id)
        ON DELETE CASCADE,

    -- Constraints
    CONSTRAINT event_type_check CHECK (
        event_type IN ('pickup_scheduled', 'picked_up', 'departed_origin',
                       'in_transit', 'arrived_terminal', 'out_for_delivery',
                       'delivered', 'delayed', 'exception')
    )
);

-- Indexes for tracking_events
CREATE INDEX idx_tracking_events_shipment_id ON tracking_events(shipment_id);
CREATE INDEX idx_tracking_events_event_type ON tracking_events(event_type);
CREATE INDEX idx_tracking_events_occurred_at ON tracking_events(occurred_at DESC);

-- ============================================================================
-- TRIGGERS
-- Automatically update timestamps
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for shipments table
CREATE TRIGGER update_shipments_updated_at
    BEFORE UPDATE ON shipments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS (Optional)
-- Useful queries as views
-- ============================================================================

-- View: Active shipments with latest status
CREATE VIEW active_shipments AS
SELECT
    s.*,
    COUNT(DISTINCT e.id) as email_count,
    COUNT(DISTINCT q.id) as quote_count,
    COUNT(DISTINCT t.id) as tracking_event_count,
    MAX(t.occurred_at) as last_tracking_update
FROM shipments s
LEFT JOIN emails e ON s.id = e.shipment_id
LEFT JOIN quotes q ON s.id = q.shipment_id
LEFT JOIN tracking_events t ON s.id = t.shipment_id
WHERE s.status IN ('pending', 'quoted', 'booked', 'in_transit')
GROUP BY s.id;

-- View: Shipment inbox (emails with metadata)
CREATE VIEW shipment_inbox AS
SELECT
    e.id,
    e.shipment_id,
    e.type,
    e.from_email,
    e.from_name,
    e.subject,
    e.preview,
    e.badge,
    e.created_at,
    s.customer_name,
    s.status as shipment_status
FROM emails e
INNER JOIN shipments s ON e.shipment_id = s.id
ORDER BY e.created_at DESC;

-- ============================================================================
-- COMMENTS
-- Document the schema
-- ============================================================================

COMMENT ON TABLE shipments IS 'Main shipments table containing all freight coordination requests';
COMMENT ON TABLE emails IS 'Email communication history for each shipment';
COMMENT ON TABLE quotes IS 'Carrier quotes received for shipments';
COMMENT ON TABLE chat_messages IS 'Chat conversation history between user and Wilson AI';
COMMENT ON TABLE tracking_events IS 'Real-time tracking updates for shipments in transit';

COMMENT ON COLUMN shipments.cargo_details IS 'JSON field storing weight, pallets, dimensions, commodity, value, etc.';
COMMENT ON COLUMN quotes.otif_score IS 'On-Time-In-Full performance score (0-100), higher is better';
COMMENT ON COLUMN chat_messages.metadata IS 'Optional JSON field for storing context, sources, or additional data';

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
