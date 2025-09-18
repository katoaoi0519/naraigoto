-- Seed data for NaraiGoto Prime demo
-- Uses fixed UUIDs for deterministic relationships

-- Users
INSERT INTO users (id, type, email, name)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'parent', 'parent@example.com', 'Parent Taro')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, type, email, name)
VALUES
  ('22222222-2222-2222-2222-222222222222', 'child', 'child@example.com', 'Child Hanako')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, type, email, name)
VALUES
  ('33333333-3333-3333-3333-333333333333', 'school_owner', 'owner@example.com', 'Owner Sensei')
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, type, email, name)
VALUES
  ('44444444-4444-4444-4444-444444444444', 'admin', 'admin@example.com', 'Admin San')
ON CONFLICT (id) DO NOTHING;

-- Family
INSERT INTO families (id, parent_user_id, stripe_customer_id)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', 'cus_TEST123')
ON CONFLICT (id) DO NOTHING;

-- Family member (child)
INSERT INTO family_members (family_id, child_user_id)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '22222222-2222-2222-2222-222222222222')
ON CONFLICT DO NOTHING;

-- School
INSERT INTO schools (id, name, area, category, description, image_key, location)
VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Prime Dojo', 'Osaka', 'Karate', 'Kids Karate school', 'schools/prime-dojo.jpg', POINT(135.5000, 34.6833))
ON CONFLICT (id) DO NOTHING;

-- Instructor
INSERT INTO instructors (id, school_id, name, profile, image_key)
VALUES
  ('cccccccc-cccc-cccc-cccc-ccccccccccc1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Yamada Sensei', '10+ years experience', 'instructors/yamada.jpg')
ON CONFLICT (id) DO NOTHING;

-- Class
INSERT INTO classes (id, school_id, title, capacity, duration_min)
VALUES
  ('dddddddd-dddd-dddd-dddd-ddddddddddd1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Beginner Karate', 20, 60)
ON CONFLICT (id) DO NOTHING;

-- Schedule (next week)
INSERT INTO lesson_schedules (id, class_id, instructor_id, start_at, end_at)
VALUES
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1',
    'dddddddd-dddd-dddd-dddd-ddddddddddd1',
    'cccccccc-cccc-cccc-cccc-ccccccccccc1',
    date_trunc('hour', now()) + INTERVAL '7 days',
    date_trunc('hour', now()) + INTERVAL '7 days' + INTERVAL '1 hour'
  )
ON CONFLICT (id) DO NOTHING;

-- Subscription
INSERT INTO subscriptions (id, family_id, plan, status, current_period_start, current_period_end, stripe_subscription_id)
VALUES
  ('ffffffff-ffff-ffff-ffff-fffffffffff1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'standard', 'active', date_trunc('month', now()), (date_trunc('month', now()) + INTERVAL '1 month') - INTERVAL '1 day', 'sub_TEST123')
ON CONFLICT (id) DO NOTHING;

-- Ticket balance (this month)
INSERT INTO ticket_balances (id, family_id, month, balance)
VALUES
  ('99999999-9999-9999-9999-999999999991', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', date_trunc('month', now())::date, 4)
ON CONFLICT (id) DO NOTHING;

-- Booking (child books the schedule)
INSERT INTO bookings (id, user_id, schedule_id, status, consumed_tickets)
VALUES
  ('aaaa1111-2222-3333-4444-555566667777', '22222222-2222-2222-2222-222222222222', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeee1', 'confirmed', 1)
ON CONFLICT (id) DO NOTHING;

-- Attendance
INSERT INTO attendances (id, booking_id, status)
VALUES
  ('bbbb1111-2222-3333-4444-555566667777', 'aaaa1111-2222-3333-4444-555566667777', 'attended')
ON CONFLICT (id) DO NOTHING;

-- Conversation and messages
INSERT INTO conversations (id, booking_id, family_id, school_id)
VALUES
  ('cccc1111-2222-3333-4444-555566667777', 'aaaa1111-2222-3333-4444-555566667777', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1')
ON CONFLICT (id) DO NOTHING;

INSERT INTO messages (id, conversation_id, sender_user_id, body)
VALUES
  ('dddd1111-2222-3333-4444-555566667777', 'cccc1111-2222-3333-4444-555566667777', '11111111-1111-1111-1111-111111111111', 'こんにちは、よろしくお願いします！')
ON CONFLICT (id) DO NOTHING;

INSERT INTO messages (id, conversation_id, sender_user_id, body)
VALUES
  ('eeee1111-2222-3333-4444-555566667777', 'cccc1111-2222-3333-4444-555566667777', '33333333-3333-3333-3333-333333333333', 'こちらこそ、当日お待ちしています。')
ON CONFLICT (id) DO NOTHING;

-- Points transactions
INSERT INTO points_transactions (id, family_id, type, amount, meta)
VALUES
  ('ffff1111-2222-3333-4444-555566667777', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'review', 50, '{"reviewId":"demo-1"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Referral
INSERT INTO referrals (id, referrer_family_id, code, referred_family_id, status)
VALUES
  ('aaaa2222-3333-4444-5555-666677778888', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'REF-ABC123', NULL, 'pending')
ON CONFLICT (id) DO NOTHING;

-- Payment
INSERT INTO payments (id, family_id, stripe_payment_intent_id, amount, currency, status, meta)
VALUES
  ('bbbb2222-3333-4444-5555-666677778888', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'pi_TEST123', 5000, 'jpy', 'succeeded', '{"purpose":"subscription"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Webhook event
INSERT INTO webhook_events (id, stripe_event_id, type, payload)
VALUES
  ('cccc2222-3333-4444-5555-666677778888', 'evt_TEST123', 'checkout.session.completed', '{"object":"event"}'::jsonb)
ON CONFLICT (id) DO NOTHING;


