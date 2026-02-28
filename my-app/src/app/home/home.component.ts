import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  Renderer2
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit, OnDestroy {

  avatar = 'assets/shared-image.jpg'; // ✅ correct assets path

  private isBrowser: boolean;
  private cleanupFns: Array<() => void> = [];
  private scrollCleanup?: () => void;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    const bar = document.querySelector('.iconbar') as HTMLElement | null;
    const links = this.el.nativeElement.querySelectorAll(
      '.iconbar-link'
    ) as NodeListOf<HTMLAnchorElement>;

    // Smooth scroll
    links.forEach(link => {
      const off = this.renderer.listen(link, 'click', (e: Event) => {
        const href = link.getAttribute('href') || '';

        if (href === '#' || !href.startsWith('#')) return;

        e.preventDefault();
        const id = href.substring(1);
        const target = document.getElementById(id);
        if (!target) return;

        const barHeight = bar ? bar.offsetHeight : 72;
        const y =
          target.getBoundingClientRect().top +
          window.scrollY -
          (barHeight + 10);

        window.scrollTo({ top: y, behavior: 'smooth' });
        this.setActive(link, links);
      });

      this.cleanupFns.push(off);
    });

    // Scroll spy
    const onScroll = () => {
      const sections = Array.from(
        document.querySelectorAll('section[id]')
      ) as HTMLElement[];

      const barHeight = bar ? bar.offsetHeight : 72;
      let current: string | null = null;

      for (const sec of sections) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= barHeight + 120 && rect.bottom >= barHeight + 120) {
          current = sec.id;
          break;
        }
      }

      links.forEach(a => a.classList.remove('active'));

      if (current) {
        const activeLink = Array.from(links).find(
          a => a.getAttribute('href') === `#${current}` // ✅ FIXED
        );
        activeLink?.classList.add('active');
      }
    };

    onScroll();
    this.scrollCleanup = this.renderer.listen('window', 'scroll', onScroll);

    // Dark mode toggle
    const modeLink = this.el.nativeElement.querySelector(
      '#modeToggle'
    ) as HTMLAnchorElement | null;

    if (modeLink) {
      const off = this.renderer.listen(modeLink, 'click', (e: Event) => {
        e.preventDefault();
        document.body.classList.toggle('dark');

        const icon = modeLink.querySelector('.icon');
        icon?.classList.toggle('bi-moon');
        icon?.classList.toggle('bi-sun');
      });

      this.cleanupFns.push(off);
    }
  }

  ngOnDestroy(): void {
    this.cleanupFns.forEach(fn => fn());
    this.scrollCleanup?.();
  }

  private setActive(
    active: HTMLAnchorElement,
    all: NodeListOf<HTMLAnchorElement>
  ) {
    all.forEach(a => a.classList.remove('active'));
    active.classList.add('active');
  }
}