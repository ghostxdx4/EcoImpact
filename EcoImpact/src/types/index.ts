export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  ecoPoints: number;
  greenKarma: number;
  badges: Badge[];
  teamId?: string;
  createdAt: Date;
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: User[];
  totalEcoPoints: number;
  totalGreenKarma: number;
  createdAt: Date;
}

export interface CarbonLog {
  id: string;
  userId: string;
  action: string;
  category: 'transport' | 'energy' | 'waste' | 'food' | 'other';
  co2Saved: number;
  points: number;
  date: Date;
  description?: string;
}

export interface TrashReport {
  id: string;
  userId: string;
  location: {
    lat: number;
    lng: number;
  };
  beforePhoto: string;
  afterPhoto?: string;
  trashTypes: string[];
  isCleaned: boolean;
  claimedBy?: string;
  points: number;
  createdAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  category: 'carbon' | 'trash' | 'team' | 'special';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string;
  attendees: string[];
  maxAttendees?: number;
  type: 'cleanup' | 'challenge' | 'workshop' | 'other';
  images?: string[];
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar?: string;
  points: number;
  rank: number;
  teamName?: string;
}