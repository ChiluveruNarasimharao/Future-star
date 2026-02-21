export interface User {
  id: number;
  name: string;
  style_preference: string;
  body_type: string;
}

export interface OutfitItem {
  name: string;
  category: string;
  description: string;
  color: string;
  style: string;
  imageUrl?: string;
}

export interface OutfitRecommendation {
  title: string;
  description: string;
  items: OutfitItem[];
  occasion: string;
  stylingTips: string[];
}

export interface SavedOutfit {
  id: number;
  user_id: number;
  outfit_json: string;
  occasion: string;
  created_at: string;
}
