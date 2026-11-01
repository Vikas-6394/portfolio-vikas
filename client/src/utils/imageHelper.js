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

/**
 * In-browser Image Compressor & Resizer
 * Automatically converts uploaded files into optimized, high-resolution base64 Data URIs (~50-120KB).
 * This ensures uploaded images are stored permanently in MongoDB Atlas and never lost on cloud container restarts.
 */
export const compressImageFile = (file, maxWidth = 1280, maxHeight = 800, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not a valid image.'));
    }

    // SVGs do not need canvas resizing
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first for optimal size, fallback to JPEG
        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to process image file.'));
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
