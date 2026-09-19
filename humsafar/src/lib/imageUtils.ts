/**
 * Image Upload Compression Utility for HUMSAFAR
 * Compresses mobile and camera photos down to <100KB Base64 JPEG strings
 * preventing localStorage quota exhaustion and improving browser rendering speed.
 */

export async function compressImage(
  file: File,
  maxWidth: number = 400,
  quality: number = 0.7
): Promise<string> {
  return new Promise((resolve, reject) => {
    // If running server-side, resolve empty string
    if (typeof window === 'undefined') {
      resolve('');
      return;
    }

    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image'));
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };

    reader.onload = (e) => {
      const img = new Image();

      img.onerror = () => {
        reject(new Error('Failed to parse image data'));
      };

      img.onload = () => {
        // Calculate new dimensions preserving aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        // Create an offscreen canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original Base64 if canvas context fails
          resolve(e.target?.result as string);
          return;
        }

        // Apply high quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw and downscale image
        ctx.drawImage(img, 0, 0, width, height);

        // Export as compressed JPEG
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}
