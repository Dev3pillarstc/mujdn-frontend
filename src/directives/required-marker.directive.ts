import { Directive, ElementRef, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControlName]',
  standalone: true,
})
export class RequiredMarkerDirective implements OnInit {
  constructor(
    private el: ElementRef,
    private control: NgControl
  ) {}

  ngOnInit(): void {
    const nativeEl = this.el.nativeElement as HTMLElement;

    // ⛔ Skip if marked with noAsterisk
    if (nativeEl.hasAttribute('noAsterisk')) return;

    const formControl = this.control.control;
    if (!formControl || !formControl.validator) return;

    const validator = formControl.validator({} as any);
    const isRequired = validator && validator['required'] === true;

    const id = nativeEl.getAttribute('id');
    if (isRequired && id) {
      const label = document.querySelector(`label[for="${id}"]`);
      label?.classList.add('required');
    }
  }
}
