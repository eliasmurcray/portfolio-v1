import { AfterViewInit, Component } from '@angular/core';

interface Project {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  liveUrl: string;
  codeUrl: string;
}

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.sass'],
})
export class ProjectsComponent implements AfterViewInit {
  projects: Project[] = [
    {
      title: 'HopperChat',
      description:
        'HopperChat is a live chat application, which offers many features such as real-time chat, customizable profiles, shared media. This is my first project using TypeScript, React, and Webpack.',
      imageUrl: 'hopperchat-thumbnail.png',
      tags: [
        'html',
        'css',
        'typescript',
        'react',
        'webpack',
        'git',
        'npm',
        'firebase',
      ],
      liveUrl: 'https://www.hopperchat.com',
      codeUrl: 'https://github.com/eliasmurcray/hopperchat',
    },
    {
      title: 'Khan Academy Notifications',
      description:
        'Khan Academy Notifications is a Chrome Extension which allows you to recieve notifications in real time from Khan Academy! It uses special classes such as the AsyncGenerator to make development easier. This extension also fixes many bugs on the Khan Academy site.',
      imageUrl: 'ka-notifications-thumbnail.png',
      tags: [
        'html',
        'css',
        'typescript',
        'webpack',
        'git',
        'npm',
        'chrome-extensions',
        'firefox-addons',
      ],
      liveUrl:
        'https://chrome.google.com/webstore/detail/khan-academy-notification/gdlfnahbohjggjhpcmabnfikiigncjbd?hl=en&authuser=0',
      codeUrl: 'https://github.com/eliasmurcray/ka-notifications',
    },
    {
      title: 'Reaction Bot',
      description:
        'Reaction Bot is a sophisticated Discord bot that enables the implementation of a reaction event, triggering the assignment of a chosen role upon the addition of a designated reaction. This tool adds an element of entertainment and engagement to Discord servers, affording members the opportunity to acquire unique and personalized roles. It previously ran on a Linux VM on Microsoft Azure and is my first project with Node.js. It was later moved to a Raspberry Pi due to free tier of Microsoft Azure running out. That makes this my first project with Microsoft Azure, a VM, and a Raspberry Pi!',
      imageUrl: 'reactionbot-thumbnail.png',
      tags: [
        'git',
        'npm',
        'nodejs',
        'microsoft-azure',
        'raspberry-pi',
        'linux',
      ],
      liveUrl:
        'https://discord.com/oauth2/authorize?client_id=1072595131905081497&permissions=2415929408&scope=bot%20applications.commands',
      codeUrl: 'https://github.com/eliasmurcray/reaction-bot',
    },
    {
      title: 'San Bernardino County Teachers Association Homepage',
      description:
        "My second client project. This is an online hub for San Bernardino County Teacher's Association (SBCTA). Provides information, resources, advocacy tools, membership management, and communication for teachers. Built with React, hosted on Firebase. Features a custom backend proxy for email subscriptions with ReCaptcha authentication.",
      imageUrl: 'sbcta-thumbnail.png',
      tags: ['html', 'sass', 'typescript', 'react', 'nodejs', 'express', 'aws'],
      liveUrl: 'https://sanbernardinocountyteachersassociation.com/',
      codeUrl: 'https://github.com/eliasmurcray/SBCTA',
    },
  ];

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scrolled');

            // Lazy load the high res thumbnail now
            const thumbnail = entry.target.querySelector(
              '.thumbnail'
            ) as HTMLImageElement;
            thumbnail.src = thumbnail.getAttribute('data-src') as string;
            thumbnail.style.opacity = '1';

            // Unobserve the old element
            observer.unobserve(entry.target);
          }
        });
      },
      { root: document, threshold: 0.2 }
    );

    const targets = document.querySelectorAll('.project-item');
    targets.forEach((target) => {
      observer.observe(target);
    });
  }
}
