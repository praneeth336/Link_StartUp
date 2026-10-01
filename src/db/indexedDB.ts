import Dexie, { Table } from 'dexie';
import { UserProfile, Idea, ConnectionRequest, Message, SharedDocument, Milestone } from '@/types';
import { initialUsers, initialIdeas, initialConnections, initialMessages, initialDocuments, initialMilestones } from '@/data/ideas';

export class LinkStartOfflineDatabase extends Dexie {
  users!: Table<UserProfile>;
  ideas!: Table<Idea>;
  connections!: Table<ConnectionRequest>;
  messages!: Table<Message>;
  documents!: Table<SharedDocument>;
  milestones!: Table<Milestone>;

  constructor() {
    super('LinkStartOfflineDatabase');
    this.version(1).stores({
      users: 'id, role, name, email',
      ideas: 'id, domain, creatorId, stage',
      connections: 'id, senderId, receiverId, status',
      messages: 'id, connectionId, senderId',
      documents: 'id, connectionId, type',
      milestones: 'id, connectionId, status',
    });
  }
}

export const offlineDb = new LinkStartOfflineDatabase();

// Auto-seed IndexedDB if empty
export async function seedIndexedDBIfEmpty() {
  const userCount = await offlineDb.users.count();
  if (userCount === 0) {
    console.log('Seeding Browser IndexedDB with initial venture data...');
    await offlineDb.users.bulkAdd(initialUsers);
    await offlineDb.ideas.bulkAdd(initialIdeas);
    await offlineDb.connections.bulkAdd(initialConnections);
    await offlineDb.messages.bulkAdd(initialMessages);
    await offlineDb.documents.bulkAdd(initialDocuments);
    await offlineDb.milestones.bulkAdd(initialMilestones);
  }
}
