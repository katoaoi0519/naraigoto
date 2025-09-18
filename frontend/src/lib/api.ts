export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function apiFetch<T>(path: string, options?: { method?: HttpMethod; body?: unknown; token?: string; cacheSeconds?: number; }): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options?.token) headers['Authorization'] = `Bearer ${options.token}`;
  const res = await fetch(url, {
    method: options?.method || 'GET',
    headers,
    body: options?.body ? JSON.stringify(options.body) : undefined,
    next: { revalidate: options?.cacheSeconds ?? 60 },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

// High-level wrappers (adjust paths to your API mapping as needed)

export async function getLessons() {
  return apiFetch<any[]>(`/lessons`, { cacheSeconds: 30 });
}

export async function getLessonById(lessonId: string) {
  return apiFetch<any>(`/lessons/${encodeURIComponent(lessonId)}`, { cacheSeconds: 30 });
}

export async function getReviewsByLesson(lessonId: string) {
  // Preferred unified route
  try {
    return await apiFetch<any>(`/lessons/${encodeURIComponent(lessonId)}/reviews`, { cacheSeconds: 10 });
  } catch (_) {
    // Fallback to legacy lambda that uses lessonsId query
    return apiFetch<any>(`/reviews?lessonsId=${encodeURIComponent(lessonId)}`, { cacheSeconds: 10 });
  }
}

export async function getReviewsByTarget(targetType: 'school' | 'instructor', targetId: string) {
  // Preferred route
  try {
    return await apiFetch<any>(`/reviews/by-target?targetType=${encodeURIComponent(targetType)}&targetId=${encodeURIComponent(targetId)}`, { cacheSeconds: 10 });
  } catch (_) {
    // Fallback to lambda name style
    return apiFetch<any>(`/get_reviews_by_target?targetType=${encodeURIComponent(targetType)}&targetId=${encodeURIComponent(targetId)}`, { cacheSeconds: 10 });
  }
}

export async function postReview(input: { lessonsId: string; userId: string; rating: number; comment: string; role: 'parent' | 'child'; }) {
  // Preferred route
  try {
    return await apiFetch<any>(`/reviews`, { method: 'POST', body: input });
  } catch (_) {
    return apiFetch<any>(`/post_reviews`, { method: 'POST', body: input });
  }
}

export async function likeSchool(userId: string, schoolId: string) {
  return apiFetch<any>(`/likes`, { method: 'POST', body: { userId, schoolId } });
}

export async function unlikeSchool(userId: string, schoolId: string) {
  try {
    return await apiFetch<any>(`/likes/${encodeURIComponent(userId)}/${encodeURIComponent(schoolId)}`, { method: 'DELETE' });
  } catch (_) {
    return apiFetch<any>(`/likes`, { method: 'DELETE', body: { userId, schoolId } });
  }
}

export async function listLikesByUser(userId: string) {
  try {
    return await apiFetch<any>(`/likes/user/${encodeURIComponent(userId)}`, { cacheSeconds: 10 });
  } catch (_) {
    return apiFetch<any>(`/likes?userId=${encodeURIComponent(userId)}`, { cacheSeconds: 10 });
  }
}

export async function getMyBookings(userId: string) {
  try {
    return await apiFetch<any>(`/my/bookings?userId=${encodeURIComponent(userId)}`, { cacheSeconds: 5 });
  } catch (_) {
    return apiFetch<any>(`/bookings?userId=${encodeURIComponent(userId)}`, { cacheSeconds: 5 });
  }
}

export async function createBooking(input: { userId: string; lessonId: string; schedule?: string; consumedTickets?: number; }) {
  return apiFetch<any>(`/bookings`, { method: 'POST', body: input });
}

export async function cancelBooking(bookingId: string) {
  try {
    return await apiFetch<any>(`/bookings/${encodeURIComponent(bookingId)}/cancel`, { method: 'POST' });
  } catch (_) {
    return apiFetch<any>(`/cancel_booking/${encodeURIComponent(bookingId)}`, { method: 'POST' });
  }
}



