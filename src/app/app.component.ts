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
import { UserProfileComponent } from './auth/user-profile.component';
import { FooterComponent } from './pages/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule, FooterComponent],
  template: `
    <p-toast />
    @if (currentUser()) {
      <p-menubar [model]="items">
        <ng-template pTemplate="start">
          <img src="/images/primeng.png" alt="logo" />
        </ng-template>
        <ng-template pTemplate="item" let-item>
          <div class="z-0">
            <a [routerLink]="item.route" class="p-menuitem-link">
              <span [class]="item.icon"></span>
              <span class="ml-2">{{ item.label }}</span>
            </a>
          </div>
        </ng-template>
        <ng-template pTemplate="end">
          <div class="flex align-items-center gap-2">
            <p-avatar
              image="{{ currentUser()?.photoURL }}"
              shape="circle"
              class=""
            />
            <span
              (click)="menu.toggle($event)"
              class="font-bold text-gray-400 mr-2 cursor-pointer sarabun -mt-1"
            >
              {{
                authService.currentUser()?.displayName
                  ? authService.currentUser()?.displayName
                  : authService.currentUser()?.email
              }}
              <i class="pi pi-angle-down"></i>
            </span>
            <p-tieredMenu #menu [model]="subitems" [popup]="true" />
          </div>
        </ng-template>
      </p-menubar>
    }
    <div class="container">
      <router-outlet />
    </div>
    @if (currentUser()) {
      <app-footer />
    }
  `,
  styles: [
    `
      .avatar-image img {
        width: 120px; /* กำหนดขนาดที่ต้องการ */
        height: 120px; /* กำหนดขนาดที่ต้องการ */
        object-fit: cover; /* ปรับขนาดภาพให้พอดี */
      }

      .p-menubar {
        position: relative;
        z-index: 1000; /* ปรับค่า z-index ให้สูงกว่า <th> */
      }

      .p-menubar .p-menuitem-link {
        position: relative;
        z-index: 1001; /* ปรับค่า z-index ให้สูงกว่า <th> */
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  authService = inject(AuthService);
  userService = inject(UserService);
  message = inject(MessagesService);
  pConfig = inject(PrimeNGConfig);
  public dialogService = inject(DialogService);
  translateService = inject(TranslateService);
  router = inject(Router);

  items: MenuItem[] | undefined;
  subitems: MenuItem[] | undefined;
  ref: DynamicDialogRef | undefined;
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
        route: '/home',
      },
      {
        label: 'Members',
        icon: 'pi pi-users',
        route: '/members',
      },
      {
        label: 'Users',
        icon: 'pi pi-user-plus',
        route: '/users',
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout();
        },
      },
    ];

    this.subitems = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => this.userDialog(),
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
      },
    ];
  }

  userDialog() {
    this.ref = this.dialogService.open(UserProfileComponent, {
      data: this.currentUser(),
      header: 'User Details',
      width: '500px',
      modal: true,
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '500px',
        '640px': '500px',
      },
    });
  }

  logout(): void {
    this.authService.logout().then(() => this.router.navigate(['/login']));
  }
}
