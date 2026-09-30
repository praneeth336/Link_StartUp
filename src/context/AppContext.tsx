import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Idea, ConnectionRequest, Message, SharedDocument, Milestone, UserRole } from '@/types';
import { initialUsers, initialIdeas, initialConnections, initialMessages, initialDocuments, initialMilestones } from '@/data/ideas';

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  switchRoleMode: (userId: string) => void;
  users: UserProfile[];
  registerUser: (newUser: Omit<UserProfile, 'id' | 'verified'>) => UserProfile;
  updateProfile: (updated: Partial<UserProfile>) => void;
  ideas: Idea[];
  addIdea: (newIdea: Omit<Idea, 'id' | 'creatorId' | 'creatorName' | 'creatorAvatar' | 'createdAt' | 'likesCount'>) => Idea;
  likeIdea: (ideaId: string) => void;
  connections: ConnectionRequest[];
  sendConnectionRequest: (receiverId: string, ideaId?: string, messageText?: string) => void;
  acceptConnectionRequest: (requestId: string) => void;
  declineConnectionRequest: (requestId: string) => void;
  messages: Message[];
  sendMessage: (connectionId: string, receiverId: string, text: string, attachments?: { name: string; url: string; type: string }[]) => void;
  documents: SharedDocument[];
  addDocument: (doc: Omit<SharedDocument, 'id' | 'uploadedBy' | 'uploadedByName' | 'uploadedAt'>) => void;
  milestones: Milestone[];
  addMilestone: (ms: Omit<Milestone, 'id' | 'status'>) => void;
  updateMilestoneStatus: (msId: string, status: Milestone['status']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'linkstart_current_user_v2';
const STORAGE_KEY_USERS = 'linkstart_users_v2';
const STORAGE_KEY_IDEAS = 'linkstart_ideas_v2';
const STORAGE_KEY_CONNECTIONS = 'linkstart_connections_v2';
const STORAGE_KEY_MESSAGES = 'linkstart_messages_v2';
const STORAGE_KEY_DOCS = 'linkstart_docs_v2';
const STORAGE_KEY_MILESTONES = 'linkstart_milestones_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USERS);
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    return saved ? JSON.parse(saved) : initialUsers[0]; // Priya Sharma by default
  });

  const [ideas, setIdeas] = useState<Idea[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_IDEAS);
    return saved ? JSON.parse(saved) : initialIdeas;
  });

  const [connections, setConnections] = useState<ConnectionRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CONNECTIONS);
    return saved ? JSON.parse(saved) : initialConnections;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
    return saved ? JSON.parse(saved) : initialMessages;
  });

  const [documents, setDocuments] = useState<SharedDocument[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_DOCS);
    return saved ? JSON.parse(saved) : initialDocuments;
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MILESTONES);
    return saved ? JSON.parse(saved) : initialMilestones;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_IDEAS, JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONNECTIONS, JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_DOCS, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MILESTONES, JSON.stringify(milestones));
  }, [milestones]);

  const switchRoleMode = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const registerUser = (newUser: Omit<UserProfile, 'id' | 'verified'>): UserProfile => {
    const created: UserProfile = {
      ...newUser,
      id: `user_${Date.now()}`,
      verified: true,
      avatar: newUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(newUser.name)}`,
    };
    setUsers(prev => [created, ...prev]);
    setCurrentUser(created);
    return created;
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    const updatedUser = { ...currentUser, ...updated };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const addIdea = (newIdeaData: Omit<Idea, 'id' | 'creatorId' | 'creatorName' | 'creatorAvatar' | 'createdAt' | 'likesCount'>): Idea => {
    const created: Idea = {
      ...newIdeaData,
      id: `idea_${Date.now()}`,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorAvatar: currentUser.avatar,
      createdAt: new Date().toISOString().split('T')[0],
      likesCount: 0,
    };
    setIdeas(prev => [created, ...prev]);
    return created;
  };

  const likeIdea = (ideaId: string) => {
    setIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, likesCount: i.likesCount + 1 } : i));
  };

  const sendConnectionRequest = (receiverId: string, ideaId?: string, messageText?: string) => {
    // Avoid duplicates
    const existing = connections.find(c => c.senderId === currentUser.id && c.receiverId === receiverId);
    if (existing) return;

    const newReq: ConnectionRequest = {
      id: `conn_${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      ideaId,
      status: 'pending',
      message: messageText || `Hi! I would like to connect and discuss venture collaboration on LinkStart.`,
      createdAt: new Date().toISOString(),
    };
    setConnections(prev => [newReq, ...prev]);
  };

  const acceptConnectionRequest = (requestId: string) => {
    setConnections(prev => prev.map(c => c.id === requestId ? { ...c, status: 'accepted' } : c));
  };

  const declineConnectionRequest = (requestId: string) => {
    setConnections(prev => prev.map(c => c.id === requestId ? { ...c, status: 'declined' } : c));
  };

  const sendMessage = (connectionId: string, receiverId: string, text: string, attachments?: { name: string; url: string; type: string }[]) => {
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      connectionId,
      senderId: currentUser.id,
      receiverId,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments,
    };
    setMessages(prev => [...prev, newMsg]);
  };

  const addDocument = (doc: Omit<SharedDocument, 'id' | 'uploadedBy' | 'uploadedByName' | 'uploadedAt'>) => {
    const newDoc: SharedDocument = {
      ...doc,
      id: `doc_${Date.now()}`,
      uploadedBy: currentUser.id,
      uploadedByName: currentUser.name,
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    setDocuments(prev => [newDoc, ...prev]);
  };

  const addMilestone = (ms: Omit<Milestone, 'id' | 'status'>) => {
    const newMs: Milestone = {
      ...ms,
      id: `ms_${Date.now()}`,
      status: 'todo',
    };
    setMilestones(prev => [newMs, ...prev]);
  };

  const updateMilestoneStatus = (msId: string, status: Milestone['status']) => {
    setMilestones(prev => prev.map(m => m.id === msId ? { ...m, status } : m));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRoleMode,
        users,
        registerUser,
        updateProfile,
        ideas,
        addIdea,
        likeIdea,
        connections,
        sendConnectionRequest,
        acceptConnectionRequest,
        declineConnectionRequest,
        messages,
        sendMessage,
        documents,
        addDocument,
        milestones,
        addMilestone,
        updateMilestoneStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
