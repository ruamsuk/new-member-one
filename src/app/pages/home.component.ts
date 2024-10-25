import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule],
  template: `
    <div
      class="flex justify-content-center text-bluegray-300 text-2xl anuphon -my-5"
    >
      <p>Welcome to.</p>
    </div>
    <div class="flex justify-content-center align-items-center mt-5">
      <p-galleria
        [value]="images"
        [autoPlay]="true"
        [responsiveOptions]="responsiveOptions"
        [numVisible]="5"
        [circular]="true"
        [showThumbnails]="false"
        [containerStyle]="{ 'max-width': '1100px' }"
      >
        <ng-template pTemplate="item" let-item>
          <img
            [src]="item"
            style="width: 100%; max-width: 100%; height: auto;"
            alt=""
          />
        </ng-template>
      </p-galleria>
    </div>
    <div class="flex justify-content-center text-bluegray-300 text-2xl anuphon">
      <p class="้hidden md:block">
        Members of Investigation Training Course 25
      </p>
    </div>
    <div class="px-8 -mt-3">
      <hr />
    </div>
  `,
  styles: `
    p-galleria img {
      width: 100%;
      max-width: 1100px; /* กำหนดขนาดสูงสุดที่ต้องการ */
      height: auto;
      display: block;
      margin: 0 auto;
      border-radius: 15px;
    }

    hr {
      border: none; /* ลบเส้นขอบเดิมออก */
      height: 1px; /* ความสูงของเส้น */
      background-color: var(--bluegray-300); /* สีของเส้น เช่น สีแดง */
    }
  `,
})
export class HomeComponent {
  images: any[] = [
    'images/01.jpg',
    'images/02.jpg',
    'images/03.jpg',
    'images/04.jpg',
    'images/05.jpg',
  ];
  responsiveOptions: any[] = [
    {
      breakpoint: '1500px',
      numVisible: 5,
    },
    {
      breakpoint: '1024px',
      numVisible: 3,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];
}
