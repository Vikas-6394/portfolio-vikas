/**
 * Safe Image URL Resolver
 * Resolves local relative upload paths (e.g. /uploads/...) to the full backend URL,
 * while leaving full HTTP/HTTPS, Data URI, and Blob URLs untouched.
 */
export const getSafeImageUrl = (
  url,
  fallback = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
) => {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return fallback;
  }

  const trimmed = url.trim();

  // Full URLs, data URIs, or blob URLs are already valid
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // Relative backend upload path
  if (trimmed.startsWith('/uploads/')) {
    const rawApiUrl = import.meta.env.VITE_API_BASE_URL || '';
    const backendOrigin = rawApiUrl ? rawApiUrl.replace(/\/api\/?$/, '') : '';
    return `${backendOrigin}${trimmed}`;
  }

  return trimmed;
};
