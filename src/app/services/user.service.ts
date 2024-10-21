import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Auth, user } from '@angular/fire/auth';
import { from, Observable, of, switchMap } from 'rxjs';
import { Member } from '../models/member.model';
import { User } from '../models/profile-user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private firestore: Firestore,
    private auth: Auth,
  ) {}

  addUser(user: {
    uid: string;
    displayName: string | null | undefined;
    email: string | null | undefined;
  }) {
    const ref = doc(this.firestore, 'users', `${user.uid}`);
    return from(setDoc(ref, user));
  }

  getUserDetail(): Observable<User> {
    return user(this.auth).pipe(
      switchMap((user: User) => {
        if (user) {
          const userCollection = collection(this.firestore, 'users');
          const query = doc(this.firestore, 'users', `${user.uid}`);
          return collectionData(query, { idField: 'id' }) as Observable<User[]>;
        } else {
          return of([]);
        }
      }),
    );
  }

  loadMembers() {
    const dbInstance = collection(this.firestore, 'members');
    const userQuery = query(dbInstance, orderBy('firstname'));
    return collectionData(userQuery, { idField: 'id' });
  }

  deleteMember(id: string | undefined) {
    const docInstance = doc(this.firestore, 'members', `${id}`);
    return from(deleteDoc(docInstance));
  }

  updateMember(member: any): Observable<any> {
    const docInstance = doc(this.firestore, `members/${member.id}`);

    return from(updateDoc(docInstance, { ...member }));
  }

  addMember(user: Member): Observable<any> {
    const docRef = collection(this.firestore, 'members');
    return from(addDoc(docRef, user));
  }
}
