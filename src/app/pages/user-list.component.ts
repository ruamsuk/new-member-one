import { Component } from '@angular/core';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [],
  template: `
    <div class="flex justify-content-center align-items-center">
      <img src="/images/logo.png" alt="logo" />
    </div>
    <div
      class="hidden md:block tasadith m-8 text-center text-3xl text-orange-400"
    >
      เหล่าสุภาพบุรุษแห่งทุ่งบางเขน! จากวัยรุ่นสู่วัยร่วง ตามกาลเวลา
    </div>
  `,
  styles: ``,
})
export class UserListComponent {}
