import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';

declare var M: any;

@Component({
  selector: 'app-materialize-autocomplete',
  templateUrl: './materialize-autocomplete.component.html',
  styleUrls: ['./materialize-autocomplete.component.sass']
})
export class MaterializeAutocompleteComponent implements OnInit {

    @Input() elementId: string;

    @Input() value: string;

    @Input() data: Observable<any[]>;

    @Input() label: string;

    @ViewChild('element') element: ElementRef;
    autocomplete: any;

    constructor() { }

    ngOnInit() {

        this.data
            .subscribe(response => {
                const data = response.reduce((map, obj) => {
                    map[obj.name] = null;
                    return map;
                }, {});

                this.autocomplete.updateData(data);
            });
    }

    onInit(event: any) {
        this.autocomplete = M.Autocomplete.getInstance(this.element.nativeElement);
    }


}
