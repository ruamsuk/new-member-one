import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { MessagesModule } from 'primeng/messages';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideFirebaseApp } from '@angular/fire/app';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { environment } from '../environments/environment';
import firebase from 'firebase/compat/app';
import initializeApp = firebase.initializeApp;

firebase.initializeApp(environment.firebaseConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      }),
    ),
    provideHttpClient(),
    MessagesModule,
    DialogService,
    ConfirmationService,
    MessageService,
  ],
};

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}
