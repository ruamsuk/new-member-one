import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { SharedModule } from './shared/shared.module';
import { MessagesService } from './services/messages.service';
import { UserService } from './services/user.service';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule],
  template: `
    <p-toast />
    @if (!currentUser()) {
      <p-menubar>
        <ng-template pTemplate="start">
          <img
            src="https://primefaces.org/cdn/primeng/images/primeng.svg"
            alt="logo"
          />
        </ng-template>
      </p-menubar>
    }
    <div class="container">
      <router-outlet />
    </div>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  userService = inject(UserService);
  message = inject(MessagesService);
  pConfig = inject(PrimeNGConfig);
  dialogService = inject(DialogService);
  translateService = inject(TranslateService);
  router = inject(Router);

  items: MenuItem[] | undefined;
  ref: DynamicDialogRef | undefined;
  photo!: string;
  hide: boolean = false;

  currentUser = this.authService.currentUser;
  loading = this.message.loading;

  ngOnInit() {
    this.translateService.setDefaultLang('th');
    this.translateService.use('th');
    this.translateService
      .get('th')
      .pipe(take(1))
      .subscribe((result) => this.pConfig.setTranslation(result));

    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
      },
      {
        label: 'Users',
      },
    ];
  }
}
