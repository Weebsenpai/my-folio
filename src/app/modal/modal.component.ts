import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent  implements OnInit, AfterViewInit{
  
  @Input() isVisible = false;
  @Input() modalTitle: string = '';
  @Input() modalDescription: string = '';
  @Output() close = new EventEmitter<void>();

  @ViewChild('backBtnLabel', { static: false }) backBtnLabel!: ElementRef;
  @ViewChild('paragraph', { static: false }) paragraph!: ElementRef;

  constructor(){
    gsap.registerPlugin(ScrollTrigger);
  }
  ngOnInit(): void {    
  }


  ngAfterViewInit(){
    this.animateBackButton();
  }
  
  closeModal() {
    this.isVisible = false;
    this.close.emit();  // Emit an event to the parent component
  }

  animateBackButton(){ 
    const data = document.getElementsByClassName('back-btn-label');
    const ele = data.item(0);
    gsap.fromTo(ele,
      {
        x: -30,
      },
      {
        x: 0,
        duration: 1,
        yoyo : true,
        repeat: -1,
      });
  }
}
