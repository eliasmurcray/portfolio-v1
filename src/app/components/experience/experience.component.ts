import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.sass'],
})
export class ExperienceComponent implements OnInit {
  ngOnInit(): void {
    const companyButtons = document.getElementsByClassName(
      'js-company-button'
    ) as HTMLCollectionOf<HTMLButtonElement>;

    let last = companyButtons[0];
    last.ariaSelected = 'true';
    document
      .getElementById(last.textContent?.toLowerCase() as string)
      ?.classList.add('selected');

    for (let i = companyButtons.length; i--; ) {
      companyButtons[i].onclick = () => {
        last.ariaSelected = 'false';
        document
          .getElementById(last.textContent?.toLowerCase() as string)
          ?.classList.remove('selected');
        last = companyButtons[i];
        last.ariaSelected = 'true';
        document
          .getElementById(
            companyButtons[i].textContent?.toLowerCase() as string
          )
          ?.classList.add('selected');
      };
    }
  }
}
