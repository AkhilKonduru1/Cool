// Adventure Types for TypeScript
export interface AdventureRequest {
  mood: 'chill' | 'funny' | 'active' | 'creative';
  timeBudget: string;
  budget: string;
  location: string;
  latitude: number;
  longitude: number;
}

export interface AdventureResponse {
  title: string;
  description: string;
  emoji: string;
  estimatedTime: string;
  cost: string;
  location: string;
  tips: string[];
  category: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export interface Adventure {
  title: string;
  description: string;
  emoji: string;
  estimatedTime: string;
  cost: string;
  location: string;
  tips: string[];
  category: string;
}
