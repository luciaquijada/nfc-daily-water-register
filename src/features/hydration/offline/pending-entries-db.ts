import { openDB, type IDBPDatabase } from 'idb'
import type { HydrationSource } from '../types'

const DB_NAME = 'daily-water-offline'
const STORE_NAME = 'pending-hydration-entries'
const DB_VERSION = 1

export type PendingHydrationEntry = {
  userId: string
  amountMl: number
  source: HydrationSource
  clientRequestId: string
  consumedAt: string
  queuedAt: string
}

type PendingDB = IDBPDatabase<{
  [STORE_NAME]: {
    key: string
    value: PendingHydrationEntry
    indexes: { 'by-user': string }
  }
}>

let dbPromise: Promise<PendingDB> | null = null

const listeners = new Set<() => void>()
let storeVersion = 0

function notifyListeners() {
  storeVersion += 1
  for (const listener of listeners) {
    listener()
  }
}

export function getPendingStoreVersion(): number {
  return storeVersion
}

export function subscribePendingEntries(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

async function getDb(): Promise<PendingDB> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'clientRequestId',
        })
        store.createIndex('by-user', 'userId')
      },
    })
  }
  return dbPromise
}

export async function enqueuePendingEntry(entry: PendingHydrationEntry): Promise<void> {
  const db = await getDb()
  await db.put(STORE_NAME, entry)
  notifyListeners()
}

export async function removePendingEntry(clientRequestId: string): Promise<void> {
  const db = await getDb()
  await db.delete(STORE_NAME, clientRequestId)
  notifyListeners()
}

export async function getPendingEntriesForUser(
  userId: string,
): Promise<PendingHydrationEntry[]> {
  const db = await getDb()
  return db.getAllFromIndex(STORE_NAME, 'by-user', userId)
}

export async function countPendingEntriesForUser(userId: string): Promise<number> {
  const entries = await getPendingEntriesForUser(userId)
  return entries.length
}
