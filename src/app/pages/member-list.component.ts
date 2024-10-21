import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { UserService } from '../services/user.service';
import { SharedModule } from '../shared/shared.module';
import { AuthService } from '../services/auth.service';
import { MessagesService } from '../services/messages.service';
import { catchError, Observable, of, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Member } from '../models/member.model';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { ThaiDatePipe } from '../pipe/thai-date.pipe';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [SharedModule, ThaiDatePipe],
  template: `
    @if (members$ | async; as members) {
      <div
        class="table-container align-items-center justify-content-center mt-3"
      >
        <div class="card">
          <p-table
            #bp
            [value]="members"
            [paginator]="true"
            [globalFilterFields]="['date']"
            [rows]="10"
            [rowHover]="true"
            [breakpoint]="'960px'"
            [tableStyle]="{ 'min-width': '50rem' }"
            responsiveLayout="stack"
            styleClass=""
          >
            <ng-template pTemplate="caption">
              <div class="flex align-items-center justify-content-between">
                <span>
                  <p-button
                    (click)="showDialog('')"
                    [disabled]="!admin"
                    size="small"
                    icon="pi pi-plus"
                  />
                </span>
                <span
                  class="hidden md:block tasadith text-green-400 text-3xl ml-auto"
                >
                  Members List
                </span>
                <p-iconField iconPosition="left" class="ml-auto">
                  <p-inputIcon>
                    <i class="pi pi-search"></i>
                  </p-inputIcon>
                  <input
                    class="sarabun"
                    pInputText
                    [(ngModel)]="searchValue"
                    pTooltip="Search Date."
                    tooltipPosition="bottom"
                    placeholder="Search Date .."
                    type="text"
                    (input)="bp.filterGlobal(getValue($event), 'contains')"
                  />
                  @if (searchValue) {
                    <span class="icons" (click)="clear(bp)">
                      <i class="pi pi-times" style="font-size: 1rem"></i>
                    </span>
                  }
                </p-iconField>
              </div>
            </ng-template>
            <ng-template pTemplate="header">
              <tr>
                <th style="width: 5%">#</th>
                <th style="width: 30%">ยศ ชื่อ ชื่อสกุล</th>
                <th style="width: 15%">วันเดือนปีเกิด</th>
                <th>ที่อยู่</th>
                <th style="width: 15%">Action</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-member let-i="rowIndex">
              <tr>
                <td>{{ currentPage * rowsPerPage + i + 1 }}</td>
                <td>
                  <span>
                    {{ member.rank }}{{ truncateText(member.firstname, 20) }}
                    {{ truncateText(member.lastname, 20) }}
                  </span>
                </td>
                <td>{{ member.birthdate | thaiDate }}</td>
                <td>{{ truncateText(member.address, 25) }}</td>
                <td>
                  <i
                    class="pi pi-list mr-2 text-green-400"
                    (click)="showDialog(member)"
                  ></i>
                  @if (admin) {
                    <i
                      class="pi pi-pen-to-square mr-2 ml-2 text-blue-400"
                      (click)="showDialog(member)"
                    ></i>
                    <p-confirmPopup />
                    <i
                      class="pi pi-trash mr-2 ml-2 text-orange-600"
                      (click)="confirm($event, member.id)"
                    ></i>
                  } @else {
                    <i class="pi pi-lock text-100"></i>
                  }
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    }
  `,
  styles: `
    th {
      color: darkcyan !important;
      font-size: 18px;
      font-family: Thasadith, sans-serif !important;
      font-weight: bold !important;
    }

    td {
      font-family: 'Sarabun', sans-serif !important;
      color: #a3a1a1;
    }

    .icons {
      position: relative;
      right: 30px;
      //top: 10px;
    }
  `,
})
export class MemberListComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  userService = inject(UserService);
  messageService = inject(MessagesService);
  confService = inject(ConfirmationService);
  //
  members$!: Observable<Member[]>;
  ref: DynamicDialogRef | undefined;
  admin: boolean = false;
  loading: boolean = false;
  searchValue: string = '';
  currentPage = 0;
  rowsPerPage = 10;
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.chkRole();
    this.getMembers();
  }

  ngOnInit() {}

  getMembers(): void {
    this.loading = true;

    this.members$ = this.userService.loadMembers().pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError((error: Error) => {
        this.messageService.showSuccess(error.message);
        return of([]);
      }),
    );

    this.members$.subscribe({
      next: () => {
        this.loading = false;
      },
    });
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  chkRole() {
    this.authService.userProfile$.pipe(take(1)).subscribe((user: any) => {
      this.admin = user.role === 'admin' || user.role === 'manager';
    });
  }

  truncateText(text: string, length: number): string {
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  showDialog(s: string) {}

  confirm(event: Event, member: any) {
    this.confService.confirm({
      target: event.target as EventTarget,
      message: 'ต้องการลบรายการนี้ แน่ใจ?',
      header: 'Confirmation',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-warning p-button-sm',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.userService.deleteMember(member).subscribe({
          next: () => {
            this.messageService.showSuccess('ลบข้อมูลเรียบร้อยแล้ว');
          },
          error: (error: any) => {
            this.messageService.showError(error.message);
          },
          complete: () => {},
        });
      },
      reject: () => {
        this.messageService.showWarn('ยกเลิกการลบแล้ว!');
      },
    });
  }

  ngOnDestroy() {
    if (this.ref) this.ref.destroy();
  }
}
