export type UserRole = 'creator' | 'cofounder' | 'investor';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  title: string;
  bio: string;
  skills: string[];
  domains: string[];
  location: string;
  availability?: string; // e.g. "Full-time (40h/wk)", "Part-time (15h/wk)"
  fundingCapacity?: string; // For investors, e.g. "$25k - $100k"
  investmentStage?: string; // For investors, e.g. "Pre-seed", "Seed"
  verified: boolean;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
}

export interface Idea {
  id: string;
  title: string;
  domain: string;
  description: string;
  skillsNeeded: string[];
  creatorId: string;
  creatorName: string;
  creatorAvatar?: string;
  fundingNeeded?: string;
  stage: 'Concept' | 'MVP Built' | 'Early Traction' | 'Scaling';
  createdAt: string;
  likesCount: number;
  pitchDeckUrl?: string;
  lookingFor: ('Technical Co-Founder' | 'Business Co-Founder' | 'Design Co-Founder' | 'Angel Investor' | 'Seed VC')[];
}

export interface ConnectionRequest {
  id: string;
  senderId: string;
  receiverId: string;
  ideaId?: string;
  status: 'pending' | 'accepted' | 'declined';
  message: string;
  createdAt: string;
}

export interface Message {
  id: string;
  connectionId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  attachments?: { name: string; url: string; type: string }[];
}

export interface SharedDocument {
  id: string;
  connectionId: string;
  title: string;
  type: 'Pitch Deck' | 'Architecture Spec' | 'Financial Model' | 'Term Sheet Template' | 'Other';
  url: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
  fileSize: string;
}

export interface Milestone {
  id: string;
  connectionId: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  dueDate: string;
  status: 'todo' | 'in_progress' | 'completed';
}
