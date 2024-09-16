import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, OnInit, Output, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
import { Draggable } from 'gsap/Draggable';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
@ViewChild('myName') nameLetters! : ElementRef;
@ViewChild('dynamicText', { static: true }) dynamicText!: ElementRef;
@ViewChild('spinner', { static: true }) spinnerElement!: ElementRef;
@ViewChild('menuBtn') menuBtn!: ElementRef;
@ViewChild('div1', { static: true }) div1!: ElementRef;
@ViewChild('div2', { static: true }) div2!: ElementRef;
@ViewChildren('menuItem') menuItems!: QueryList<ElementRef>;
@Output() hoverChange = new EventEmitter<boolean>();

text: string = 'Jelly Text'; // Your text
textArray: string[] = [];
professions = ['Front-end Developer', 'Backend Developer','Full Stack Developer', 'Web Designer'];
colors = ['#ff6f61', '#6b5b95', '#88b04b','#76D7EA'];
navbarOptions = ["welcome","skills","projects","experience","about"];

showinnerDIV = false

currentIndex = 0;
isRotating: boolean = false;
menuImageSrc = "./assets/svg/menu.svg";
menuBtnSelected: boolean = false;
rotationTween: any;
private startRotation: number = 0;
private endRotation: number = 0;
isDiv1Visible: boolean = true;
cursorStyle: { [key: string]: string } = {};
cursorCSS = "cursor";
isHovered: boolean = false;

constructor(
  private renderer:Renderer2,
  private router: Router
  ){
  gsap.registerPlugin(TextPlugin);
  gsap.registerPlugin(Draggable);
  gsap.registerPlugin(MotionPathPlugin);
  this.textArray = this.text.split('');
}

@HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.cursorStyle = {
      left: `${event.clientX}px`,
      top: `${event.clientY}px`
    };
  }

ngOnInit(): void{
}

ngAfterViewInit(): void {
  gsap.ticker.fps(120);
  gsap.to(document.querySelector('.div-top'),{
    opacity: 1,
    duration: 1,
  });


  this.pageloadAnimation();
  this.introElementAnimation();
}

pageloadAnimation(){
  const nameContent =  this.nameLetters.nativeElement.textContent.trim();
  console.log(this.nameLetters.nativeElement.innerHTML)
  this.nameLetters.nativeElement.innerHTML = " ";

  // this.menuItems.forEach((ele)=>{
  //   const data = ele.nativeElement;
  //   const word = data.textContent;
  //   if(word){
  //     const randomNumber = Math.floor(Math.random() * word.length);
  //     const letters = word.split('');
  //     letters[randomNumber] = `<span id="newItem" style="transform: scaleX(1.5); display: inline-block; margin-left:10px; margin-right:10px">${letters[randomNumber]}</span>`;
  //     data.innerHTML = letters.join('');
  //   }
  // });

  this.menuItems.forEach((ele)=>{
    const elem = ele.nativeElement;
    elem.addEventListener('mouseenter', (event: Event) => this.jellyEffect(event));
  })

  nameContent.split('').forEach((letter: any,index: any) => {
    
    if (letter === 'O' && index === 1) {
      const div = this.renderer.createElement('div');
      this.renderer.addClass(div, 'spinner-container');
      div.innerHTML = `
        <svg id="clover-${index}`+`" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <circle cx="25" cy="25" r="25" fill="orange" filter="url(#grainy)"/>
          <circle cx="75" cy="25" r="25" fill="orange" filter="url(#grainy)"/>
          <circle cx="25" cy="75" r="25" fill="orange" filter="url(#grainy)"/>
          <circle cx="75" cy="75" r="25" fill="orange" filter="url(#grainy)"/>
          <circle cx="50" cy="50" r ="25" fill="orange" filter="url(#grainy)"/>
        </svg>
      `;
      this.renderer.appendChild(this.nameLetters.nativeElement, div);
      this.renderer.setStyle(div, 'display', 'inline-block');
      this.renderer.setStyle(div,'height','70px');
      this.renderer.setStyle(div,'width','70px');
      const initialX = `-${30 * index}px`;
      this.renderer.setStyle(div, 'opacity', '0');
      this.renderer.setStyle(div,'transform',`translateX(${initialX})`);
      this.renderer.setAttribute(div,'id',`letter-${index}`);
    }
    else{
      const span = this.renderer.createElement('span');
      let textNode = this.renderer.createText(letter === ' ' ? '\u00A0' : letter);
      this.renderer.appendChild(span,textNode);
      this.renderer.appendChild(this.nameLetters.nativeElement,span);
      //const translateX = -window.innerWidth * (index + 1);
      this.renderer.setStyle(span, 'opacity','0');
      this.renderer.setStyle(span,'display','inline-block');
      this.renderer.setStyle(span,'line-height','1');
      if(index === 0){
        // this.renderer.setStyle(span,'transform',`translateX(-400px)`)
        this.renderer.setStyle(span,'max-height','105px')
        this.renderer.setStyle(span,'transform-origin','bottom');
        this.renderer.setAttribute(span,'id',`letter-${index}`);
      }else{
        const initialX = `-${30 * index}px`;
        this.renderer.setAttribute(span,'id',`letter-${index}`);
        this.renderer.setStyle(span,'transform',`translateX(${initialX})`);
      }
    }
  });
}

rotateSVG(){
  const clover = this.nameLetters.nativeElement.querySelector('#clover-1');
  gsap.to(clover, { rotation: 360, ease: 'linear', duration: 3 });

    // Make the clover draggable and spinnable
    Draggable.create(clover, {
      type: 'rotation',
      inertia: true,
      onDragStart: () => {
        this.startRotation = gsap.getProperty(clover, 'rotation') as number;
      },
      onDragEnd: () => {
        this.endRotation = gsap.getProperty(clover, 'rotation') as number;
        const velocity = this.endRotation - this.startRotation;

        // Continue spinning with inertia based on calculated velocity
        gsap.to(clover, {
          rotation: `+=${velocity * 2}`,
          ease: 'power3.out',
          duration: 2,
        });
      }
    });
} 

introElementAnimation(){
  gsap.ticker.fps(120);
  gsap.fromTo('.intro-text',{
    y: -200,
    opacity: 0,
  },{
    y: 0,
    duration: 0.7,
    opacity: 1,
    ease: 'bounce.out',
    onComplete: () => {
      this.presentName();
    }
  });
}

presentName(){
  gsap.fromTo("#letter-0",{
    opacity: 0,
    rotationX: 180,
    },{
    rotationX: 0,
    delay: 0.2,
    duration: 1,
    opacity: 1,
    ease: 'bounce.out',
    onComplete: ()=>{
      gsap.to(this.nameLetters.nativeElement.querySelectorAll('span,.spinner-container'), {
        x: 0,
        duration: 0.7 ,
        opacity: 1,
        ease: 'power2.out',
        stagger: 0.13 , // Stagger the animation for each letter
        onComplete: ()=>{
          this.designationAnimation();
          this.rotateSVG();
          this.desigDivAnimation()
          this.animateLetterI();
        }
      });
    }
  });
}

desigDivAnimation(){
  gsap.fromTo('.desig-div',{
    x: 900,
  },{x: 0,
    opacity: 1,
    duration: 1,
    ease: 'back.out'
  });
}

animateLetterI(){
  gsap.to("#letter-3",
  {
    rotationX: 540,
    duration: 2,
    delay: 1,
    onComplete: ()=>{
      this.aimateLetterI2()
    }
  });
}

aimateLetterI2(){
  gsap.to("#letter-3",{
    rotationX: 0,
    duration: 2,
    delay: 1.5,
    onComplete: ()=>{
      this.animateLetterI();
    }
  });
}

designationAnimation(){
  const textElement = this.dynamicText.nativeElement;
  console.log(textElement)
    const typeText = () => {
      gsap.to(textElement, {
        text: this.professions[this.currentIndex],
        color: this.colors[this.currentIndex],
        duration: 2,
        ease: 'power2.inOut',
        onComplete: eraseText
      });
    };

    const eraseText = () => {
      const currentText = this.professions[this.currentIndex];
      const textLength = currentText.length;
      let obj = { length: textLength }; // Object to animate

      gsap.to(obj, {
        length: 0,
        duration: 2,
        ease: 'power2.inOut',
        onUpdate: function () {
          const newText = currentText.substring(0, Math.floor(obj.length));
          textElement.textContent = newText;
        },
        onComplete: () => {
          this.currentIndex = (this.currentIndex + 1) % this.professions.length;
          typeText();
        }
      });
    };
    typeText();
}

menuBtnClicked(){
  this.menuBtnSelected = !this.menuBtnSelected;
  if(this.menuBtnSelected){
    this.toggleDivs();
    this.menuImageSrc = "./assets/svg/cross.svg"
    const waves = document.querySelectorAll(".wave");
        gsap.to(waves,{
          fontWeight: 700,
          duration: 1,
          stagger: 0.2,
          ease: 'power2.inOut'
    });
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
  }else{
    this.toggleDivs();
    this.menuImageSrc = "./assets/svg/menu.svg"
    const waves = document.querySelectorAll(".wave");
    waves.forEach((ele: Element) => {
        this.renderer.setStyle(ele,'font-weight','300');
    });
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

  toggleDivs() {
    const currentDiv = this.isDiv1Visible ? this.div1.nativeElement : this.div2.nativeElement;
    const nextDiv = this.isDiv1Visible ? this.div2.nativeElement : this.div1.nativeElement;

    // Animation timeline
    const tl = gsap.timeline({
      defaults: { duration: 0.5, ease: 'power4.inOut' }  // Using a smooth easing function
    });

    // Move the current div out of the view
    tl.to(currentDiv, {
      x: this.isDiv1Visible ? '100%' : '-100%',  // Move out to the right or left
      opacity: 0,
      onComplete: () => {
        // Hide the current div and show the next div
        currentDiv.style.display = 'none';
        nextDiv.style.display = 'block';
        gsap.set(nextDiv, { x: this.isDiv1Visible ? '-100%' : '100%', opacity: 0 });  // Start next div outside the view
      }
    });

    // Move the next div into view
    tl.to(nextDiv, { x: '0%', opacity: 1, onComplete: ()=>{} }, '<');
      // '<' means start this animation when the previous one ends

    // Toggle the visible div
    this.isDiv1Visible = !this.isDiv1Visible;
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
  
  onMouseEnter(isHovered: boolean) {
    this.hoverChange.emit(isHovered);
    console.log(isHovered);
  }

  onMouseLeave(isHovered: boolean) {
    this.hoverChange.emit(isHovered);
    console.log(isHovered);
  }

  navigateToPage(index: number){
    console.log(this.navbarOptions[index]);
    this.router.navigate(['/skills']);
  }

    handleCursorSize(isHovered: boolean){
    console.log("inside app.ts",isHovered);
    if(isHovered){
      this.cursorCSS = "home-cursor-hovered";
    }else{
      this.cursorCSS = "cursor";
    }
}
}