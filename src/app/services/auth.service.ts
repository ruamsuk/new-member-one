import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  user,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  auth = inject(Auth);
  firestore = inject(Firestore);

  currentUser$: Observable<User | null> = authState(this.auth);
  currentUser = toSignal<User | null>(this.currentUser$);

  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
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
