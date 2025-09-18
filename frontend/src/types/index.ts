// ユーザータイプ
export type UserType = 'parent' | 'child' | 'school_owner' | 'admin';

// ユーザー情報
export interface User {
  id: string;
  type: UserType;
  email: string;
  name: string;
  created_at: string;
}

// 家族情報
export interface Family {
  id: string;
  parent_user_id: string;
  stripe_customer_id?: string;
}

// 教室情報
export interface School {
  id: string;
  name: string;
  area: string;
  category: string;
  description: string;
  image_key?: string;
  location?: {
    lat: number;
    lng: number;
  };
  rating?: number;
  review_count?: number;
}

// 先生情報
export interface Instructor {
  id: string;
  school_id: string;
  name: string;
  profile: string;
  image_key?: string;
  rating?: number;
  review_count?: number;
}

// クラス情報
export interface Class {
  id: string;
  school_id: string;
  title: string;
  capacity: number;
  duration_min: number;
}

// レッスンスケジュール
export interface LessonSchedule {
  id: string;
  class_id: string;
  instructor_id: string;
  start_at: string;
  end_at: string;
  available_slots?: number;
}

// 予約情報
export interface Booking {
  id: string;
  user_id: string;
  schedule_id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  consumed_tickets: number;
  created_at: string;
}

// 口コミ情報
export interface Review {
  id: string;
  booking_id: string;
  target_type: 'school' | 'instructor';
  target_id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer_type: 'parent' | 'child';
  reviewer_name: string;
}

// いいね情報
export interface Like {
  id: string;
  user_id: string;
  school_id: string;
  created_at: string;
}

// チケット残高
export interface TicketBalance {
  id: string;
  family_id: string;
  month: string;
  balance: number;
}

// サブスクリプション
export interface Subscription {
  id: string;
  family_id: string;
  plan: string;
  status: 'active' | 'inactive' | 'cancelled';
  current_period_start: string;
  current_period_end: string;
}

// 検索フォーム値
export interface SearchFormValues {
  area: string;
  category: string;
  date: string;
  keyword?: string;
}

// API レスポンス型
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// ページネーション
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}
