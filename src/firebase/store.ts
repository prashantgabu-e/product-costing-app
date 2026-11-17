import { addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, writeBatch, type DocumentData } from 'firebase/firestore'
import { db } from './config'

const path = (uid: string, collectionName: string) => collection(db!, 'users', uid, collectionName)
export async function listDocuments<T>(uid: string, collectionName: string): Promise<T[]> {
  if (!db) return []
  const snapshot = await getDocs(query(path(uid, collectionName), orderBy('updatedAt', 'desc'), limit(100)))
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T)
}
export async function saveDocument(uid: string, collectionName: string, id: string | undefined, data: DocumentData) {
  if (!db) throw new Error('Firebase is not configured')
  const documentData = Object.fromEntries(Object.entries(data).filter(([key]) => key !== 'id'))
  if (id) return setDoc(doc(db, 'users', uid, collectionName, id), { ...documentData, updatedAt: serverTimestamp() }, { merge: true })
  return addDoc(path(uid, collectionName), { ...documentData, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
}
export async function removeDocument(uid: string, collectionName: string, id: string) { if (!db) throw new Error('Firebase is not configured'); await deleteDoc(doc(db, 'users', uid, collectionName, id)) }
export async function replaceDocuments(uid: string, collectionName: string, records: DocumentData[]) {
  if (!db) throw new Error('Firebase is not configured')
  const firestore = db
  const reference = path(uid, collectionName)
  const existing = await getDocs(reference)
  const chunks = <T,>(items: T[]) => Array.from({ length: Math.ceil(items.length / 400) }, (_, index) => items.slice(index * 400, index * 400 + 400))

  // Replacement is deliberately two phases: existing data is removed before any
  // new products are written, as requested for every CSV import.
  for (const documents of chunks(existing.docs)) {
    const batch = writeBatch(firestore)
    documents.forEach((item) => batch.delete(item.ref))
    await batch.commit()
  }
  for (const group of chunks(records)) {
    const batch = writeBatch(firestore)
    group.forEach((record) => {
      const data = Object.fromEntries(Object.entries(record).filter(([key]) => key !== 'id'))
      batch.set(doc(reference), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
    })
    await batch.commit()
  }
}
