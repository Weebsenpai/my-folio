import { Location } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UtilsService } from './services/utils.service';
import { Subscription, noop } from 'rxjs';
gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild('menuBtn') menuBtn!: ElementRef;
  @ViewChild('whiteDiv') whiteDiv!: ElementRef;
  @ViewChild('blackDiv') blackDiv!: ElementRef;

  title = 'my-folio';
  cursorStyle: { [key: string]: string } = {};
  isHovered: boolean = false;
  cursorCSS = "custom-cursor";
  menuBtnSelected: boolean = false;
  menuImageSrc: string =  "./assets/svg/menu.svg";
  cursorSizeClass: string = "normal-size"
  private subscription!: Subscription;
  showinnerDiv = true;
  whiteDivWidth: number = 0;
  
  constructor(
    private renderer: Renderer2,
    private router: Router,
    private location: Location,
    private utils: UtilsService
    ){

    }

    ngOnInit() {

      this.utils.cursorSize$.subscribe(size => {
        console.log('i am triggered');
        console.log(size);
        this.cursorSizeClass = size;
      });

      this.subscription = this.utils.triggerFunction$.subscribe(() => {
        this.menuImageSrc = "./assets/svg/menu.svg";
        this.menuBtnSelected = !this.menuBtnSelected;
        gsap.to(this.menuBtn.nativeElement,{
          rotation : 0,
          duration: 0.5,
          ease: 'back.out',
          onComplete: ()=>{
            gsap.to(this.menuBtn.nativeElement,{
              duration: 0.5,
            });
          }
        });
      });
    }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.cursorStyle = {
      left: `${event.clientX}px`,
      top: `${event.clientY}px`
    };
  }

  
  ngAfterViewInit() {
    //console.log(this.whiteDiv.nativeElement);
    // gsap.fromTo(this.whiteDiv.nativeElement,{
    //   width: '0',
    // },{
    //   width: '50%',
    //   duration: 2,
    //   ease: 'power2.out',
    //   onComplete: ()=>{
    //     const letter = document.querySelectorAll('.letter')
    //     const lettersArray = Array.from(letter);
    //     lettersArray.forEach((ele : any,index: number) => {
    //       ele.style.opacity = 1;
    //       gsap.fromTo(ele, 
    //         {
    //           y: -500,
    //           rotation: -10 
    //         }, 
    //         {
    //           y: 0, 
    //           rotation: 0, 
    //           duration: 2, 
    //           ease: "bounce.out", 
    //           onComplete: ()=> {
    //             gsap.to(letter, { 
    //               duration: 0.2,
    //               onComplete: ()=> {
    //                 const letterM = document.querySelectorAll('.m');
    //                 const letterC = document.querySelectorAll('.c')
    //                   gsap.to(letterM.item(0),{
    //                     x: (this.whiteDiv.nativeElement as HTMLElement).offsetWidth/2-64,
    //                     ease: 'power2.out',
    //                     scrollTrigger: {
    //                       trigger: '.loadingscreen',
    //                       start: 'top top',
    //                       scrub: true,
    //                     },
    //                     onComplete: ()=> {
    //                       this.slideUpDiv();
    //                     }
    //                   });
    //                   gsap.to(letterC.item(0),{
    //                     x: -(this.whiteDiv.nativeElement as HTMLElement).offsetWidth/2+59,
    //                     ease: 'power2.out',
    //                     scrollTrigger: {
    //                       trigger: '.loadingscreen1',
    //                       start: 'top top',
    //                       scrub: true,
    //                     },
    //                     onComplete : ()=>{
    //                       this.slideUpDiv();
    //                     }
    //                   });
    //               }
    //             });
    //           }
    //         });
    //     });
    //   }
    // });
    // gsap.to(this.blackDiv.nativeElement,{
    //   width: '50%',
    //   duration: 2,
    //   ease: 'power2.out'
    // });
    // this.moveTextUsingScroll()
  }

  slideUpDiv(){
    console.log(" i am called");
    gsap.to(this.whiteDiv.nativeElement,{
      y: '-100%',
      duration: 0.6,
      onComplete: ()=>{
        const divPinned = document.querySelector('.pin-spacer') as HTMLElement;
        divPinned.innerHTML = "";
        divPinned.style.display = 'none';
      }
    });
    gsap.to(this.blackDiv.nativeElement,{
      y: '-100%',
      duration: 0.6,
      onComplete: ()=>{
        const divPinned = document.querySelector('.pin-spacer') as HTMLElement;
        divPinned.innerHTML = "";
        divPinned.style.display = 'none';
      }
    });
    this.showinnerDiv = true;
  }

  bringTextToCenter(ele: HTMLElement,index:number){
    if(index == 0){
      gsap.to(ele,{
        x: (this.whiteDiv.nativeElement as HTMLElement).offsetWidth/2-64,
        duration: 2,
        ease: 'bounce.out',
      })
    }
    if(index == 1){
      gsap.to(ele,{
        x: -(this.blackDiv.nativeElement as HTMLElement).offsetWidth/2+64,
        duration: 2,
        ease: 'bounce.out'
      })
    }
  }

  moveTextUsingScroll(){

    ScrollTrigger.create({
      trigger: '.wrapper',
      start: 'top top',
      scrub: true,
      pin : true
    });

    // const letterM = document.querySelectorAll('.m');
    // console.log((this.whiteDiv.nativeElement as HTMLElement).offsetWidth/2);
    //   gsap.to(letterM.item(0),{
    //     x: (this.whiteDiv.nativeElement as HTMLElement).offsetWidth/2,
    //     ease: 'none',
    //     scrollTrigger: {
    //       trigger: '.loadingscreen',
    //       start: 'top top',
    //       end: '+=1000',
    //       scrub: true
    //     }
    //   });
    

    // const letter = document.querySelectorAll('.letter')
    // const div1 = document.querySelectorAll('loadinscreen');
    // const lettersArray = Array.from(letter);
    // lettersArray.forEach((ele)=>{
    //   console.log(ele);
    //   gsap.to(ele,{
    //     x: 500,
    //     duration: 2,
    //     scrollTrigger: {
    //       trigger: '.wrapper',
    //       scrub: true,
    //       markers: true,
    //       start: 'top top',
    //       end: 'bottom top',
    //     }
    //   })
    // });
  }

  menuBtnClicked(){
    this.menuBtnSelected = !this.menuBtnSelected;
    if(this.menuBtnSelected){
      this.menuImageSrc = "./assets/svg/cross.svg"
      gsap.to(this.menuBtn.nativeElement,{
        rotation : 180,
        duration: 0.5,
        ease: 'bounce.out',
        onComplete: ()=>{
          gsap.to(this.menuBtn.nativeElement,{
            duration: 0.5,
            opacity: 1,
          });
        }
      });
      this.router.navigate(['/menu']);
    }else{
      this.menuImageSrc = "./assets/svg/menu.svg"
      const waves = document.querySelectorAll(".wave");
      waves.forEach((ele: Element) => {
          this.renderer.setStyle(ele,'font-weight','300');
      });
      this.location.back();
      gsap.to(this.menuBtn.nativeElement,{
        rotation : 0,
        duration: 0.5,
        ease: 'back.out',
        onComplete: ()=>{
          gsap.to(this.menuBtn.nativeElement,{
            duration: 0.5,
          });
        }
      });
    }
    }
}