import { getDatabase } from '../client';
import { TABLES } from '../schema';
import { generateId, nowIso, toBaseRecordFields } from '../utils';

export interface Note {
  id: string;
  householdId: string;
  title: string | null;
  body: string;
  tags: string[];
  linkedEntityType: string | null;
  linkedEntityId: string | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  localSyncStatus: 'synced' | 'pending' | 'conflict' | 'error';
  lastSyncedAt: string | null;
}

function rowToNote(row: Record<string, unknown>): Note {
  return {
    ...toBaseRecordFields(row),
    title: (row.title as string) ?? null,
    body: row.body as string,
    tags: JSON.parse((row.tags as string) || '[]'),
    linkedEntityType: (row.linked_entity_type as string) ?? null,
    linkedEntityId: (row.linked_entity_id as string) ?? null,
  };
}

export const notesRepository = {
  async list(householdId: string): Promise<Note[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM ${TABLES.notes} WHERE household_id = ? AND deleted_at IS NULL ORDER BY updated_at DESC`,
      [householdId]
    );
    return rows.map(rowToNote);
  },

  async create(input: {
    householdId: string;
    title?: string | null;
    body: string;
    tags?: string[];
    createdBy?: string | null;
  }): Promise<Note> {
    const db = await getDatabase();
    const at = nowIso();
    const note: Note = {
      id: generateId(),
      householdId: input.householdId,
      title: input.title ?? null,
      body: input.body,
      tags: input.tags ?? [],
      linkedEntityType: null,
      linkedEntityId: null,
      createdBy: input.createdBy ?? null,
      createdAt: at,
      updatedAt: at,
      deletedAt: null,
      localSyncStatus: 'pending',
      lastSyncedAt: null,
    };

    await db.runAsync(
      `INSERT INTO ${TABLES.notes}
        (id, household_id, title, body, tags, created_by, created_at, updated_at, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [note.id, note.householdId, note.title, note.body, JSON.stringify(note.tags), note.createdBy, at, at]
    );
    return note;
  },

  async softDelete(id: string): Promise<void> {
    const db = await getDatabase();
    const at = nowIso();
    await db.runAsync(
      `UPDATE ${TABLES.notes} SET deleted_at = ?, updated_at = ?, sync_status = 'pending' WHERE id = ?`,
      [at, at, id]
    );
  },
};

export interface Attachment {
  id: string;
  householdId: string;
  entityType: string;
  entityId: string;
  fileUri: string;
  mimeType: string | null;
  fileName: string | null;
  byteSize: number | null;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export const attachmentsRepository = {
  async listForEntity(householdId: string, entityType: string, entityId: string): Promise<Attachment[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<Record<string, unknown>>(
      `SELECT * FROM ${TABLES.attachments}
       WHERE household_id = ? AND entity_type = ? AND entity_id = ? AND deleted_at IS NULL`,
      [householdId, entityType, entityId]
    );
    return rows.map((row) => ({
      id: row.id as string,
      householdId: row.household_id as string,
      entityType: row.entity_type as string,
      entityId: row.entity_id as string,
      fileUri: row.file_uri as string,
      mimeType: (row.mime_type as string) ?? null,
      fileName: (row.file_name as string) ?? null,
      byteSize: (row.byte_size as number) ?? null,
      createdBy: (row.created_by as string) ?? null,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
    }));
  },

  async create(input: Omit<Attachment, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Attachment> {
    const db = await getDatabase();
    const at = nowIso();
    const attachment: Attachment = {
      id: input.id ?? generateId(),
      ...input,
      createdAt: at,
      updatedAt: at,
    };

    await db.runAsync(
      `INSERT INTO ${TABLES.attachments}
        (id, household_id, entity_type, entity_id, file_uri, mime_type, file_name, byte_size,
         created_by, created_at, updated_at, sync_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        attachment.id, attachment.householdId, attachment.entityType, attachment.entityId,
        attachment.fileUri, attachment.mimeType, attachment.fileName, attachment.byteSize,
        attachment.createdBy, at, at,
      ]
    );
    return attachment;
  },
};
