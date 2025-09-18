-- Drop all Phase 2 objects (safe order), then optionally re-run 01_schema.sql

-- Tables (children first)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS attendances CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS ticket_balances CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS webhook_events CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS lesson_schedules CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS instructors CASCADE;
DROP TABLE IF EXISTS schools CASCADE;
DROP TABLE IF EXISTS family_members CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS points_transactions CASCADE;
DROP TABLE IF EXISTS families CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Types
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_type WHERE typname='points_transaction_type') THEN DROP TYPE points_transaction_type; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_type WHERE typname='referral_status') THEN DROP TYPE referral_status; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_type WHERE typname='attendance_status') THEN DROP TYPE attendance_status; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_type WHERE typname='payment_status') THEN DROP TYPE payment_status; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_type WHERE typname='subscription_status') THEN DROP TYPE subscription_status; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_type WHERE typname='user_role') THEN DROP TYPE user_role; END IF; END $$;

-- Extension left installed intentionally (pgcrypto)


