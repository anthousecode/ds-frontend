import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgSelectModule} from '@ng-select/ng-select';
import {NgxMaskModule} from 'ngx-mask';
import * as M from 'materialize-css/dist/js/materialize';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {TalonComponent} from './components/talon/talon.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {Stage0Component} from './components/talon/stage0/stage0.component';
import {Stage1Component} from './components/talon/stage1/stage1.component';
import {MaterializeModule} from '@samuelberthe/angular2-materialize';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ApiWithCredentialInterceptor} from './interceptor/http-interceptor';
import {SnilsPipe} from './pipe/snils.pipe';
import {MaterializeAutocompleteComponent} from './components/autocomplete/materialize-autocomplete/materialize-autocomplete.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule, MatProgressSpinnerModule,
    MatSelectModule, MatTabsModule
} from '@angular/material';
import {Stage2Component} from './components/talon/stage2/stage2.component';
import {Stage3Component} from './components/talon/stage3/stage3.component';
import {Stage4Component} from './components/talon/stage4/stage4.component';
import {Stage5Component} from './components/talon/stage5/stage5.component';
import {Stage6Component} from './components/talon/stage6/stage6.component';
import {PatientCardComponent} from './components/patient-card/patient-card.component';
import {PatientDocumentModalComponent} from './components/patient-card/patient-document-modal/patient-document-modal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {PatientHistoryModalComponent} from './components/patient-card/patient-history-modal/patient-history-modal.component';
import {PatientUnionModalComponent} from './components/patient-card/patient-union-modal/patient-union-modal.component';
import {ValidationDirective} from './directive/validation.directive';
import {ErrorPageComponent} from './components/error-page/error-page.component';
import {MatButtonModule} from '@angular/material/button';
import {NgxPaginationModule} from 'ngx-pagination';
import {DatePickerComponent} from './components/date-picker/date-picker.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DatePickerRangeComponent} from './components/date-picker-range/date-picker-range.component';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {MyDateRangePickerModule} from 'mydaterangepicker';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTableModule} from '@angular/material/table';
import { ExportModalComponent } from './components/export-modal/export-modal.component';
import { AgePipe } from './pipe/age.pipe';
import { SearchChildComponent } from './components/search-child/search-child.component';
import { PatientDeleteModalComponent } from './components/patient-card/patient-delete-modal/patient-delete-modal.component';
import {OAuthModule} from 'angular-oauth2-oidc';
import { HomeComponent } from './components/home/home.component';

@NgModule({
    declarations: [
        AppComponent,
        TalonComponent,
        Stage1Component,
        Stage0Component,
        SnilsPipe,
        MaterializeAutocompleteComponent,
        Stage2Component,
        Stage3Component,
        Stage4Component,
        Stage5Component,
        Stage6Component,
        PatientCardComponent,
        PatientDocumentModalComponent,
        PatientHistoryModalComponent,
        PatientUnionModalComponent,
        ValidationDirective,
        ErrorPageComponent,
        DatePickerComponent,
        DatePickerRangeComponent,
        ExportModalComponent,
        AgePipe,
        SearchChildComponent,
        PatientDeleteModalComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        MatFormFieldModule,
        MaterializeModule,
        FormsModule,
        MatSelectModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
        NgSelectModule,
        MatTooltipModule,
        MatDialogModule,
        MatButtonModule,
        NgxPaginationModule,
        NgxMaskModule.forRoot(),
        MatDatepickerModule,
        MatNativeDateModule,
        MyDateRangePickerModule,
        MatCheckboxModule,
        MatTableModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        OAuthModule.forRoot()
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiWithCredentialInterceptor,
            multi: true
        },
        { provide: 'M', useValue: M },
        MatDatepickerModule,
        { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
        ],
    bootstrap: [AppComponent],
    entryComponents: [
        PatientDocumentModalComponent,
        PatientHistoryModalComponent,
        PatientUnionModalComponent,
        ExportModalComponent,
        PatientDeleteModalComponent
    ]
})
export class AppModule {
}
