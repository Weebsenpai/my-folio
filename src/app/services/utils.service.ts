import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  menuBtnSubject = new Subject();
  triggerFunction$ = this.menuBtnSubject.asObservable();

  private cursorSize = new BehaviorSubject<string>('default');
  cursorSize$ = this.cursorSize.asObservable();

  constructor() { }

  setCursorSize(size: string) {
    this.cursorSize.next(size);
  }
  
  triggerFunction() {
    this.menuBtnSubject.next('menu');
  }
}
