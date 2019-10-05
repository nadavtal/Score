import { Directive, HostListener, HostBinding, OnInit, ElementRef } from '@angular/core';

@Directive({
    selector: '[appDropDown]'
})
export class DropdownDirective implements OnInit{
    @HostBinding('class.show') isOpen = false;
    @HostListener('click') toggleOpen(){
        console.log(this.elRef.nativeElement);
        this.isOpen = !this.isOpen;
    }
    
    constructor(private elRef: ElementRef){}
    ngOnInit(){
        
        // const dropDownMenu = 
    }
}