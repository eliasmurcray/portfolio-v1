import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'portfolio2';
  ngAfterViewInit(): void {
    const header = document.querySelector('header');
    header?.scrollIntoView();
  }
  ngOnInit(): void {
    const scrolls = document.getElementsByClassName('js-scroll');
    window.addEventListener(
      'scroll',
      () => {
        for (let i = 0, l = scrolls.length; i < l; i++) {
          const scroll = scrolls[i] as HTMLElement;
          if (scroll.getBoundingClientRect().top < window.innerHeight / 2) {
            scroll.classList.add('scrolled');
          } else {
            scroll.classList.remove('scrolled');
          }
        }
      },
      { passive: true }
    );
  }
}
