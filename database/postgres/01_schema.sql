-- PostgreSQL schema for NaraiGoto Prime (Phase 2)
-- Safe to run multiple times on a clean database. Use 03_reset.sql to drop first if needed.

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- for gen_random_uuid()

-- Enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('parent', 'child', 'school_owner', 'admin');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
    CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'paused');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attendance_status') THEN
    CREATE TYPE attendance_status AS ENUM ('attended', 'absent');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'referral_status') THEN
    CREATE TYPE referral_status AS ENUM ('pending', 'accepted');
  END IF;
END$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'points_transaction_type') THEN
    CREATE TYPE points_transaction_type AS ENUM ('review', 'referral', 'redeem');
  END IF;
END$$;

-- Tables
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type          user_role NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS families (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_user_id      UUID NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE RESTRICT,
  stripe_customer_id  TEXT UNIQUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS family_members (
  family_id      UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  child_user_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (family_id, child_user_id)
);

CREATE TABLE IF NOT EXISTS schools (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  area        TEXT,
  category    TEXT,
  description TEXT,
  image_key   TEXT,
  location    POINT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS instructors (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id   UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  profile     TEXT,
  image_key   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS classes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id    UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  capacity     INTEGER NOT NULL CHECK (capacity > 0),
  duration_min INTEGER NOT NULL CHECK (duration_min > 0),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lesson_schedules (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id      UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  instructor_id UUID NOT NULL REFERENCES instructors(id) ON DELETE RESTRICT,
  start_at      TIMESTAMPTZ NOT NULL,
  end_at        TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT lesson_time_valid CHECK (end_at > start_at),
  CONSTRAINT lesson_unique_per_class_start UNIQUE (class_id, start_at)
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id              UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  plan                   TEXT NOT NULL,
  status                 subscription_status NOT NULL,
  current_period_start   TIMESTAMPTZ,
  current_period_end     TIMESTAMPTZ,
  stripe_subscription_id TEXT UNIQUE,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS payments (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id                 UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  stripe_payment_intent_id  TEXT UNIQUE,
  amount                    INTEGER NOT NULL CHECK (amount >= 0),
  currency                  TEXT NOT NULL,
  status                    payment_status NOT NULL,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now(),
  meta                      JSONB
);

CREATE TABLE IF NOT EXISTS webhook_events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_event_id TEXT NOT NULL UNIQUE,
  type          TEXT NOT NULL,
  payload       JSONB NOT NULL,
  received_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  processed_at  TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS ticket_balances (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id  UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  month      DATE NOT NULL,
  balance    INTEGER NOT NULL CHECK (balance >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT ticket_balance_unique UNIQUE (family_id, month)
);

CREATE TABLE IF NOT EXISTS bookings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  schedule_id       UUID NOT NULL REFERENCES lesson_schedules(id) ON DELETE CASCADE,
  status            TEXT NOT NULL DEFAULT 'confirmed',
  consumed_tickets  INTEGER NOT NULL DEFAULT 1 CHECK (consumed_tickets >= 0),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT booking_unique_user_schedule UNIQUE (user_id, schedule_id)
);

CREATE TABLE IF NOT EXISTS attendances (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  status      attendance_status NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID REFERENCES bookings(id) ON DELETE SET NULL,
  family_id   UUID REFERENCES families(id) ON DELETE SET NULL,
  school_id   UUID REFERENCES schools(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id   UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_user_id    UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  body              TEXT NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at           TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS points_transactions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id   UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  type        points_transaction_type NOT NULL,
  amount      INTEGER NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  meta        JSONB
);

CREATE TABLE IF NOT EXISTS referrals (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_family_id   UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  code                 TEXT NOT NULL UNIQUE,
  referred_family_id   UUID REFERENCES families(id) ON DELETE SET NULL,
  status               referral_status NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_instructors_school ON instructors(school_id);
CREATE INDEX IF NOT EXISTS idx_classes_school ON classes(school_id);
CREATE INDEX IF NOT EXISTS idx_schedules_class ON lesson_schedules(class_id);
CREATE INDEX IF NOT EXISTS idx_schedules_instructor_start ON lesson_schedules(instructor_id, start_at);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_schedule ON bookings(schedule_id);
CREATE INDEX IF NOT EXISTS idx_conversations_family ON conversations(family_id);
CREATE INDEX IF NOT EXISTS idx_conversations_school ON conversations(school_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_points_family_created ON points_transactions(family_id, created_at);
CREATE INDEX IF NOT EXISTS idx_payments_family_created ON payments(family_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ticket_balances_family_month ON ticket_balances(family_id, month);


