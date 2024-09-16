import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit, AfterViewInit {

  @ViewChild('whiteDiv') whiteDiv!: ElementRef;
  @ViewChild('blackDiv') blackDiv!: ElementRef;

  constructor(private router: Router){

  }

  ngOnInit(){
  }

  ngAfterViewInit(){
    console.log(this.whiteDiv.nativeElement);
    gsap.fromTo(this.whiteDiv.nativeElement,{
      width: '0',
    },{
      width: '50%',
      duration: 2,
      ease: 'power2.out',
      onComplete: ()=>{
        const letter = document.querySelectorAll('.letter')
        const lettersArray = Array.from(letter);
        lettersArray.forEach((ele : any,index: number) => {
          ele.style.opacity = 1;
          gsap.fromTo(ele, 
            {
              y: -500,
              rotation: -10 
            }, 
            {
              y: 0, 
              rotation: 0, 
              duration: 2, 
              ease: "bounce.out", 
              onComplete: ()=> {
                gsap.to(letter, { 
                  duration: 0.2,
                  onComplete: ()=> {
                    const letterM = document.querySelectorAll('.m');
                    const letterC = document.querySelectorAll('.c')
                      gsap.to(letterM.item(0),{
                        x: (this.whiteDiv.nativeElement as HTMLElement).offsetWidth/2-64,
                        ease: 'power2.out',
                        scrollTrigger: {
                          trigger: '.loadingscreen',
                          start: 'top top',
                          scrub: true,
                        },
                        onComplete: ()=> {
                          this.slideUpDiv();
                        }
                      });
                      gsap.to(letterC.item(0),{
                        x: -(this.whiteDiv.nativeElement as HTMLElement).offsetWidth/2+59,
                        ease: 'power2.out',
                        scrollTrigger: {
                          trigger: '.loadingscreen1',
                          start: 'top top',
                          scrub: true,
                        },
                        onComplete : ()=>{
                          this.slideUpDiv();
                        }
                      });
                  }
                });
              }
            });
        });
      }
    });
    gsap.to(this.blackDiv.nativeElement,{
      width: '50%',
      duration: 2,
      ease: 'power2.out'
    });
    this.moveTextUsingScroll()
  }  

  slideUpDiv(){
    console.log(" i am called");
    gsap.to(this.whiteDiv.nativeElement,{
      y: '-100%',
      duration: 0.6,
      onComplete: ()=>{
        this.router.navigate(['/home']);
      }
    });
    gsap.to(this.blackDiv.nativeElement,{
      y: '-100%',
      duration: 0.6,
      onComplete: ()=>{
        this.router.navigate(['/home']);
      }
    });
  }

  moveTextUsingScroll(){

    ScrollTrigger.create({
      trigger: '.wrapper',
      start: 'top top',
      scrub: true,
      pin : true
    });
  }
}
