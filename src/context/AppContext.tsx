import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Idea, ConnectionRequest, Message, SharedDocument, Milestone } from '@/types';
import { initialUsers, initialIdeas, initialConnections, initialMessages, initialDocuments, initialMilestones } from '@/data/ideas';
import { offlineDb, seedIndexedDBIfEmpty } from '@/db/indexedDB';

const API_BASE = 'http://localhost:3001/api';

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
  dbType: 'SQLite (Server)' | 'IndexedDB (Offline Browser)';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'linkstart_current_user_v3';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USER);
    return saved ? JSON.parse(saved) : initialUsers[0];
  });
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [connections, setConnections] = useState<ConnectionRequest[]>(initialConnections);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [documents, setDocuments] = useState<SharedDocument[]>(initialDocuments);
  const [milestones, setMilestones] = useState<Milestone[]>(initialMilestones);
  const [dbType, setDbType] = useState<'SQLite (Server)' | 'IndexedDB (Offline Browser)'>('IndexedDB (Offline Browser)');

  // Initial Database Hydration (SQLite API or IndexedDB)
  useEffect(() => {
    async function loadDatabase() {
      try {
        // Try fetching from SQLite Server first
        const res = await fetch(`${API_BASE}/users`);
        if (res.ok) {
          const u = await res.json();
          const i = await (await fetch(`${API_BASE}/ideas`)).json();
          const c = await (await fetch(`${API_BASE}/connections`)).json();
          const m = await (await fetch(`${API_BASE}/messages`)).json();
          const d = await (await fetch(`${API_BASE}/documents`)).json();
          const ms = await (await fetch(`${API_BASE}/milestones`)).json();

          setUsers(u);
          setIdeas(i);
          setConnections(c);
          setMessages(m);
          setDocuments(d);
          setMilestones(ms);
          setDbType('SQLite (Server)');
          return;
        }
      } catch (err) {
        // SQLite API not active -> Fall back to browser IndexedDB
      }

      // Browser IndexedDB Fallback
      await seedIndexedDBIfEmpty();
      const u = await offlineDb.users.toArray();
      const i = await offlineDb.ideas.toArray();
      const c = await offlineDb.connections.toArray();
      const m = await offlineDb.messages.toArray();
      const d = await offlineDb.documents.toArray();
      const ms = await offlineDb.milestones.toArray();

      if (u.length > 0) setUsers(u);
      if (i.length > 0) setIdeas(i);
      if (c.length > 0) setConnections(c);
      if (m.length > 0) setMessages(m);
      if (d.length > 0) setDocuments(d);
      if (ms.length > 0) setMilestones(ms);
      setDbType('IndexedDB (Offline Browser)');
    }

    loadDatabase();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(currentUser));
  }, [currentUser]);

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
      avatar: newUser.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    };

    setUsers(prev => [created, ...prev]);
    setCurrentUser(created);

    // Save to SQLite API & IndexedDB
    fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created),
    }).catch(() => {});
    offlineDb.users.put(created).catch(() => {});

    return created;
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    const updatedUser = { ...currentUser, ...updated };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    offlineDb.users.put(updatedUser).catch(() => {});
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

    fetch(`${API_BASE}/ideas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(created),
    }).catch(() => {});
    offlineDb.ideas.put(created).catch(() => {});

    return created;
  };

  const likeIdea = (ideaId: string) => {
    setIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, likesCount: i.likesCount + 1 } : i));

    fetch(`${API_BASE}/ideas/${ideaId}/like`, { method: 'PUT' }).catch(() => {});
    offlineDb.ideas.where('id').equals(ideaId).modify(i => { i.likesCount += 1; }).catch(() => {});
  };

  const sendConnectionRequest = (receiverId: string, ideaId?: string, messageText?: string) => {
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

    fetch(`${API_BASE}/connections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReq),
    }).catch(() => {});
    offlineDb.connections.put(newReq).catch(() => {});
  };

  const acceptConnectionRequest = (requestId: string) => {
    setConnections(prev => prev.map(c => c.id === requestId ? { ...c, status: 'accepted' } : c));

    fetch(`${API_BASE}/connections/${requestId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'accepted' }),
    }).catch(() => {});
    offlineDb.connections.update(requestId, { status: 'accepted' }).catch(() => {});
  };

  const declineConnectionRequest = (requestId: string) => {
    setConnections(prev => prev.map(c => c.id === requestId ? { ...c, status: 'declined' } : c));

    fetch(`${API_BASE}/connections/${requestId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'declined' }),
    }).catch(() => {});
    offlineDb.connections.update(requestId, { status: 'declined' }).catch(() => {});
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

    fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMsg),
    }).catch(() => {});
    offlineDb.messages.put(newMsg).catch(() => {});
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

    fetch(`${API_BASE}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDoc),
    }).catch(() => {});
    offlineDb.documents.put(newDoc).catch(() => {});
  };

  const addMilestone = (ms: Omit<Milestone, 'id' | 'status'>) => {
    const newMs: Milestone = {
      ...ms,
      id: `ms_${Date.now()}`,
      status: 'todo',
    };

    setMilestones(prev => [newMs, ...prev]);

    fetch(`${API_BASE}/milestones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMs),
    }).catch(() => {});
    offlineDb.milestones.put(newMs).catch(() => {});
  };

  const updateMilestoneStatus = (msId: string, status: Milestone['status']) => {
    setMilestones(prev => prev.map(m => m.id === msId ? { ...m, status } : m));

    fetch(`${API_BASE}/milestones/${msId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {});
    offlineDb.milestones.update(msId, { status }).catch(() => {});
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
        dbType,
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
