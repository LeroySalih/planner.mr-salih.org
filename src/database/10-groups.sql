-- ==============================================
-- Profile Table to store user attributes
-- ==============================================

CREATE TABLE groups (
    group_id text PRIMARY KEY DEFAULT gen_random_uuid(), 
    title       TEXT NOT NULL,   
    

    active      BOOLEAN DEFAULT true,
    created     TIMESTAMP DEFAULT now(),
    created_by  TEXT DEFAULT 'auto',
    order_by    INT
);