import { db } from './config';
import { 
  collection, addDoc, updateDoc, doc, 
  deleteDoc, getDocs, getDoc, query, 
  orderBy, serverTimestamp, Timestamp 
} from 'firebase/firestore';

// Yazı tipi
export interface Post {
  id?: string;
  title: string;
  content: string;
  category: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  status: 'yayında' | 'taslak';
}

// Yazıları getir
export async function getPosts() {
  const postsRef = collection(db, 'posts');
  const q = query(postsRef, orderBy('createdAt', 'desc'));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Post[];
}

// Yazı ekle
export async function addPost(post: Omit<Post, 'id'>) {
  const docRef = await addDoc(collection(db, 'posts'), {
    ...post,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  return docRef.id;
}

// Yazıyı güncelle
export async function updatePost(id: string, post: Partial<Post>) {
  const postRef = doc(db, 'posts', id);
  const currentPost = await getDoc(postRef);
  
  if (!currentPost.exists()) {
    throw new Error('Yazı bulunamadı');
  }
  
  await updateDoc(postRef, {
    ...post,
    updatedAt: serverTimestamp()
  });
  
  return id;
}

// Yazıyı sil
export async function deletePost(id: string) {
  const postRef = doc(db, 'posts', id);
  await deleteDoc(postRef);
  return id;
}

// Yazıyı getir
export async function getPost(id: string) {
  const postRef = doc(db, 'posts', id);
  const post = await getDoc(postRef);
  
  if (!post.exists()) {
    throw new Error('Yazı bulunamadı');
  }
  
  return {
    id: post.id,
    ...post.data()
  } as Post;
}