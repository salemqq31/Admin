import { db } from './config';
import { 
  collection, updateDoc, doc, 
  deleteDoc, getDocs, query, 
  orderBy, Timestamp
} from 'firebase/firestore';

// Otel başvurusu tipi
export interface HotelApplication {
  id?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  hotelName: string;
  hotelCount: number;
  roomCount: number;
  isChainHotel: boolean;
  country: string;
  state: string;
  website: string;
  termsAccepted: boolean;
  termsAcceptedAt: string;
  marketingAccepted: boolean;
  createdAt?: Timestamp;
}

// Ön kayıt tipi
export interface Registration {
  id?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  marketingAccepted: boolean;
  termsAccepted: boolean;
  termsAcceptedAt: string;
  registrationNumber?: number;
  createdAt?: Timestamp;
}

// Başvuruları getir
export async function getHotelApplications() {
  const applicationsRef = collection(db, 'applications');
  const q = query(applicationsRef, orderBy('createdAt', 'desc'));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as HotelApplication[];
}

// Başvuruyu sil
export async function deleteHotelApplication(id: string) {
  const appRef = doc(db, 'applications', id);
  await deleteDoc(appRef);
  return id;
}

// Ön kayıtları getir
export async function getRegistrations() {
  const registrationsRef = collection(db, 'preregistrations');
  const q = query(registrationsRef, orderBy('createdAt', 'desc'));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Registration[];
}

// Ön kayıt güncelle
export async function updateRegistration(id: string, data: Partial<Registration>) {
  const regRef = doc(db, 'preregistrations', id);
  await updateDoc(regRef, {
    ...data,
  });
  
  return id;
}

// Ön kayıt sil
export async function deleteRegistration(id: string) {
  const regRef = doc(db, 'preregistrations', id);
  await deleteDoc(regRef);
  return id;
}