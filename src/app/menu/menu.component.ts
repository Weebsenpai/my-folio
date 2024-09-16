import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { gsap } from 'gsap/gsap-core';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, AfterViewInit {
  @ViewChildren('menuItem') menuItems!: QueryList<ElementRef>;
  navbarOptions = ["welcome","skills","projects","experience","about"];

  constructor(
    private router: Router,
    private utils: UtilsService
  ){

  }

  ngAfterViewInit(): void {
    this.menuItems.forEach((ele)=>{
      const elem = ele.nativeElement;
      elem.addEventListener('mouseenter', (event: Event) => this.jellyEffect(event));
    });

    const waves = document.querySelectorAll(".wave");
    gsap.to(waves,{
      fontWeight: 700,
      duration: 1,
      stagger: 0.2,
      ease: 'power2.inOut'
    });
  }

  ngOnInit(): void {
  }

  navigateToPage(index: number){
    console.log(this.navbarOptions[index]);
    const url = this.navbarOptions[index];
    this.utils.triggerFunction();
    this.utils.setCursorSize('normal-size');
    if(url === 'welcome'){
      this.router.navigate(['/home']);
    }else{
      this.router.navigate(['/'+this.navbarOptions[index]]);
    }
    }
    
  jellyEffect(event: Event): void {
    const target = event.target as HTMLElement;

    // Reset any ongoing animation to prevent interference
    gsap.killTweensOf(target);

    // Animate the hovered letter with a "jelly" effect
    gsap.to(target, {
      duration: 0.3,
      scaleX: 1.4,      // Stretch horizontally
      scaleY: 0.6,      // Compress vertically
      transformOrigin: 'bottom center', // Keep the bottom fixed, so it squishes downwards
      ease: 'elastic.out(1, 0.3)',
      color: '#C0C0C0',
      onComplete: () => {
        // Restore the letter to its original state after the animation
        gsap.to(target, {
          duration: 0.3,
          scaleX: 1,
          scaleY: 1,
          transformOrigin: 'bottom center', // Keep the bottom fixed
          ease: 'elastic.out(1, 0.3)',
          color: 'white',
        });
      }
    });
  }

  increaseCursorSize() {
    this.utils.setCursorSize('enlarge-size');
  }

  resetCursorSize() {
    this.utils.setCursorSize('normal-size');
  }
  
}
