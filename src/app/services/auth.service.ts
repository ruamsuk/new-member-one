import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  user,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { from, Observable, of } from 'rxjs';
import { doc, docData, Firestore } from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProfileUser } from '../models/profile-user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = inject(Auth);
  firestore = inject(Firestore);

  currentUser$: Observable<User | null> = authState(this.auth);
  currentUser = toSignal<User | null>(this.currentUser$);

  get userProfile$(): Observable<ProfileUser | null> {
    const user = this.auth.currentUser;
    const ref = doc(this.firestore, 'users', `${user?.uid}`);
    if (ref) {
      return docData(ref) as Observable<ProfileUser | null>;
    } else {
      return of(null);
    }
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  forgotPassword(email: string) {
    return from(sendPasswordResetEmail(this.auth, email));
  }

  async logout(): Promise<void> {
    return await signOut(this.auth);
  }

  async sendEmailVerification(): Promise<void | undefined> {
    return await sendEmailVerification(<User>this.auth.currentUser);
  }

  getUserState(): Observable<any> {
    return user(this.auth);
  }

  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }
}
