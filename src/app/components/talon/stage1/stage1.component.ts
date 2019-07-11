import {Component, OnInit} from '@angular/core';
import {pickerI18n, TalonComponent} from '../talon.component';
import {DictionaryService} from '../../../service/dictionary.service';
import {
  Decision,
  DiseaseCode,
  DiseaseModel,
  MedicalInstitution,
  MedicalProfile,
  ResponsiblePerson,
  TreatmentMethod,
  VmpType
} from '../../../interface/dictionary';
import {VmpStage1} from '../../../interface/talon';
import {concat, Observable, of, Subject} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'app-stage1',
  templateUrl: './stage1.component.html',
  styleUrls: ['./stage1.component.sass']
})
export class Stage1Component implements OnInit {

  parent: TalonComponent;
  pickerI18n = pickerI18n;
  vmpStage1: VmpStage1;
  decisions: Decision[];
  responsiblePersons: ResponsiblePerson[];
  medicalProfiles: MedicalProfile[];
  groups: number[];
  group: number;
  vmpTypes: VmpType[];
  diseaseCodes: Observable<DiseaseCode[]>;
  diseaseCodesSearch: Subject<string> = new Subject<string>();
  diseaseCodesLoading = false;
  diseaseModels: DiseaseModel[];
  methods: TreatmentMethod[];
  medicalInstitutions: Observable<MedicalInstitution[]>;

  constructor(private dictionaryService: DictionaryService, parent: TalonComponent) {
    this.parent = parent;
    this.initEmpty();

    this.parent.onTalonChange.subscribe(() => {
      this.setStage();
    });
  }

  ngOnInit() {
    this.dictionaryService.getDecisions(1).subscribe(response => this.decisions = response);
    this.dictionaryService.getResponsiblePersons().subscribe(response => this.responsiblePersons = response);
    this.loadDiseaseCodes();
  }

  initEmpty() {
    this.vmpStage1 = new VmpStage1();
  }

  setStage() {
    if (this.parent.talon && this.parent.talon.vmpStage1) {
      this.vmpStage1 = this.parent.talon.vmpStage1;
      const isGroupSet = this.vmpStage1.vmpType && this.vmpStage1.vmpType.groupId;
      this.group = isGroupSet ? this.vmpStage1.vmpType.groupId : null;
      this.loadProfiles();
      this.loadGroups();
      this.loadTypes();
      this.loadModels();
      this.loadMethods();
      this.loadMedicalInstitutions();
    } else {
      this.initEmpty();
    }
  }

  loadProfiles() {
    const date = this.parent.talon.date;

    this.dictionaryService.getMedicalProfiles(date)
      .subscribe(response => this.medicalProfiles = response);
  }

  setProfile(profile?: MedicalProfile) {
    if (this.vmpStage1.medicalProfile !== profile) {
      this.vmpStage1.medicalProfile = profile;
      this.setGroup(null);
      this.loadGroups();
    }
  }

  loadGroups() {
    if (this.vmpStage1.medicalProfile) {
      const date = this.parent.talon.date;
      const razdel = this.parent.talon.isOMS ? 1 : 0;
      const profileId = this.vmpStage1.medicalProfile.id;

      this.dictionaryService.getVmpTypeGroups(date, razdel, profileId)
        .subscribe(response => {
          this.groups = response.map(item => item.groupId);
          const isGroupSet = this.vmpStage1.vmpType && this.vmpStage1.vmpType.groupId;
          this.group = isGroupSet ? this.vmpStage1.vmpType.groupId : null;
        });
    } else {
      this.groups = null;
    }
  }

  setGroup(group: number) {
    console.log('setGroup', group);
    if (this.group !== group) {
      this.group = group;
      this.setType(null);
      this.loadTypes();
    }
  }

  loadTypes() {
    if (this.vmpStage1.medicalProfile && this.group !== null) {
      const date = this.parent.talon.date;
      const razdel = this.parent.talon.isOMS ? 1 : 0;
      const profileId = this.vmpStage1.medicalProfile.id;
      const group = this.group;

      this.dictionaryService.getVmpTypes(date, razdel, profileId, group)
        .subscribe(response => {
          this.vmpTypes = response;
          console.log(this.vmpTypes);
        });
    } else {
      this.vmpTypes = null;
    }
  }

  setType(type?: VmpType) {
    console.log('setType', type);
    if (this.vmpStage1.vmpType !== type) {
      this.vmpStage1.vmpType = type;
      this.setModel(null);
      this.vmpStage1.medicalInstitution = null;
      this.loadModels();
      this.loadMedicalInstitutions();
    }
  }

  loadModels() {
    if (this.vmpStage1.vmpType) {
      const date = this.parent.talon.date;
      const razdel = this.parent.talon.isOMS ? 1 : 0;
      const vmpTypeId = this.vmpStage1.vmpType.id;

      this.dictionaryService.getDiseaseModels(date, razdel, vmpTypeId)
        .subscribe(response => {
          this.diseaseModels = response;
        });
    } else {
      this.diseaseModels = null;
    }
  }

  setModel(model: DiseaseModel) {
    if (this.vmpStage1.model !== model) {
      this.vmpStage1.model = model;
      this.vmpStage1.method = null;
      this.loadMethods();
    }
  }

  loadMethods() {
    if (this.vmpStage1.vmpType && this.vmpStage1.model) {
      const date = this.parent.talon.date;
      const razdel = this.parent.talon.isOMS ? 1 : 0;
      const vmpTypeId = this.vmpStage1.vmpType.id;
      const diseaseModelId = this.vmpStage1.model.id;

      this.dictionaryService.getTreatmentMethods(date, razdel, vmpTypeId, diseaseModelId)
        .subscribe(response => {
          this.methods = response;
        });
    } else {
      this.methods = null;
    }
  }

  loadMedicalInstitutions() {
    if (this.vmpStage1.medicalProfile && this.vmpStage1.vmpType) {
      const talonId = this.parent.talon.id;
      const medicalProfileId = this.vmpStage1.medicalProfile.id;
      const groupId = this.vmpStage1.vmpType.groupId;
      const vmpTypeId = this.vmpStage1.vmpType.id;

      this.medicalInstitutions = this.dictionaryService.getMedicalInstitutions(talonId, medicalProfileId, groupId, vmpTypeId);
    } else {
      this.medicalInstitutions = of<MedicalInstitution[]>([]);
    }
  }

  private loadDiseaseCodes() {
    this.diseaseCodes = concat<DiseaseCode[], DiseaseCode[]>(
      of<DiseaseCode[]>([]), // default items
      this.diseaseCodesSearch.pipe(
        filter(term => term.length >= 1),
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => this.diseaseCodesLoading = true),
        switchMap(term => this.dictionaryService.getDiseaseCodes(term).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.diseaseCodesLoading = false)
        ))
      )
    );
  }

  compareId(obj1: any, obj2: any): boolean {
    return obj1 && obj2 ? obj1.id === obj2.id : obj1 === obj2;
  }

  onSubmit() {
    console.log('Submitting talon', this.parent.talon);
    // this.parent.saveTalon();
  }

}
