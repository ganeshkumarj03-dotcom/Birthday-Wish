import { SlideTextData, GalleryImage } from './types';

// Compress and resize image to fit in URL/Storage
// Increased max size to 1280px and quality to 0.85 for high clarity sharing
export const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const MAX_SIZE = 1280; // Significantly increased for better quality
        
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Convert to JPEG with high quality (0.85)
            resolve(canvas.toDataURL('image/jpeg', 0.85));
        } else {
            resolve(e.target?.result as string);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

// Application State Interface
export interface AppState {
  name: string;
  textData: SlideTextData;
  galleryImages: GalleryImage[];
}

// Encode state to Base64 string for URL
export const encodeStateToUrl = (state: AppState): string => {
  try {
    const jsonStr = JSON.stringify(state);
    return btoa(encodeURIComponent(jsonStr));
  } catch (e) {
    console.error("Error encoding state", e);
    return "";
  }
};

// Decode state from URL hash
export const decodeStateFromUrl = (): AppState | null => {
  try {
    const hash = window.location.hash.slice(1); // Remove #
    if (!hash) return null;
    
    // Check if hash looks like our data
    if (hash.startsWith("data=")) {
       const data = hash.replace("data=", "");
       const jsonStr = decodeURIComponent(atob(data));
       return JSON.parse(jsonStr);
    }
    return null;
  } catch (e) {
    console.error("Error decoding state", e);
    return null;
  }
};