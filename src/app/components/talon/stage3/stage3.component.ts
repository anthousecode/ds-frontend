import { Component, OnInit } from '@angular/core';
import {VmpStage3} from '../../../interface/talon';
import {Decision} from '../../../interface/dictionary';
import {DictionaryService} from '../../../service/dictionary.service';
import {TalonComponent} from '../talon.component';

@Component({
  selector: 'app-stage3',
  templateUrl: './stage3.component.html',
  styleUrls: ['./stage3.component.sass']
})
export class Stage3Component implements OnInit {

    parent: TalonComponent;
    vmpStage3: VmpStage3;
    decisions: Decision[];

    constructor(private dictionaryService: DictionaryService, parent: TalonComponent) {
        this.parent = parent;

        this.parent.onTalonChange.subscribe(talon => {
            this.setStage();
        });
    }

    ngOnInit() {
    }

    initEmpty() {
        this.vmpStage3 = new VmpStage3();
    }

    setStage() {
        if (this.parent.talon && this.parent.talon.vmpStage3) {
            this.vmpStage3 = this.parent.talon.vmpStage3;
        } else {
            this.initEmpty();
        }
    }

}
