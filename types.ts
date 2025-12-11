export interface GalleryImage {
  src: string;
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface SlideTextData {
  intro: {
    subtitle: string;
    title: string;
  };
  gallery: {
    title: string;
    body: string;
  };
  wishes: {
    items: string[];
    signature: string;
  };
}

// The shape of the data stored in the database
export interface BirthdayData {
  id?: string;
  name: string;
  textData: SlideTextData;
  galleryImages: GalleryImage[];
  createdAt: number;
}

export interface SlideProps {
  name: string;
  isActive: boolean;
  direction: number;
  isReadOnly?: boolean; // Added optional read-only flag
  onNext: () => void;
  onPrev: () => void;
  galleryImages: GalleryImage[];
  onUpdateImage: (index: number, updates: Partial<GalleryImage>) => void;
  textData: SlideTextData;
  onEdit: (section: keyof SlideTextData, field: string | number, currentValue: string) => void;
}

export interface BirthdayConfig {
  name: string;
  themeColor: string;
}

export enum SlideType {
  INTRO = 'INTRO',
  GALLERY = 'GALLERY',
  WISHES = 'WISHES',
  AI_GEN = 'AI_GEN'
}