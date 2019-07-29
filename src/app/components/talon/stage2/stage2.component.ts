import { Component, OnInit } from '@angular/core';
import {pickerI18n, TalonComponent} from '../talon.component';
import {DictionaryService} from '../../../service/dictionary.service';
import {VmpStage2} from '../../../models/talon.model';
import {Decision, ResponsiblePerson, VmpType} from '../../../models/dictionary.model';

@Component({
    selector: 'app-stage2',
    templateUrl: './stage2.component.html',
    styleUrls: ['./stage2.component.sass']
})
export class Stage2Component implements OnInit {

    parent: TalonComponent;
    pickerI18n = pickerI18n;
    vmpStage2: VmpStage2;
    decisions: Decision[];
    vmpTypes: VmpType[];
    responsiblePersons: ResponsiblePerson[];

    constructor(private dictionaryService: DictionaryService, parent: TalonComponent) {
        this.parent = parent;

        this.parent.onTalonChange.subscribe(talon => {
            this.setStage();
        });
    }

    initEmpty() {
        this.vmpStage2 = new VmpStage2();
    }

    setStage() {
        if (this.parent.talon && this.parent.talon.vmpStage2) {
            this.vmpStage2 = this.parent.talon.vmpStage2;
        } else {
            this.initEmpty();
        }

        this.loadVmpTypes();
    }

    ngOnInit() {
        this.dictionaryService.getDecisions(2).subscribe(response => this.decisions = response);
        this.dictionaryService.getResponsiblePersons().subscribe(response => this.responsiblePersons = response);
    }

    compareId(obj1: any, obj2: any): boolean {
        console.log('compareId', obj1, obj2);
        return obj1 && obj2 ? obj1.id === obj2.id : obj1 === obj2;
    }

    loadVmpTypes() {
        const talon = this.parent.talon;
        if (talon.vmpStage1 && talon.vmpStage1.vmpType) {
            this.dictionaryService.getVmpTypes(
                talon.date,
                talon.isOMS ? 1 : 0,
                talon.vmpStage1.medicalProfile.id,
                talon.vmpStage1.vmpType.groupId
            ).subscribe(response => this.vmpTypes = response);
        }
    }

}
