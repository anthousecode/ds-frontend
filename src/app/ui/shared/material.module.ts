import { NgModule } from '@angular/core';
import {
  MAT_DATE_FORMATS,
  MAT_LABEL_GLOBAL_OPTIONS,
  MatButtonModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatIconRegistry,
  MatRadioModule,
  MatInputModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule,
  MatDialogModule,
  MatBottomSheetModule,
  MatAutocompleteModule,
  MatChipsModule,
  MatSlideToggleModule,
  MAT_DIALOG_DATA,
  MatOptionModule,
  MatExpansionModule,
  MatCheckboxModule
} from '@angular/material';
import {MAT_MOMENT_DATE_FORMATS} from '@angular/material-moment-adapter';
import {DomSanitizer} from '@angular/platform-browser';
import {IMatIcon} from './interfaces/mat-icon.interface';
import {MATERIAL_ICONS_LIST} from './material-icons-list';
const MATERIAL_MODULES = [
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatSnackBarModule,
  MatBottomSheetModule,
  MatPaginatorModule,
  MatSortModule,
  MatTableModule,
  MatSelectModule,
  MatOptionModule,
  MatTooltipModule,
  MatRadioModule,
  MatDialogModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatChipsModule,
  MatSlideToggleModule,
  MatExpansionModule,
  MatCheckboxModule
];

@NgModule({
  imports: MATERIAL_MODULES,
  exports: MATERIAL_MODULES,
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: {float: 'never'} },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
  ]
})
export class MaterialModule {
  constructor(private sanitizer: DomSanitizer,
              private matIconRegistry: MatIconRegistry) {
    const extention = '.svg';
    MATERIAL_ICONS_LIST.forEach((icon: IMatIcon) => {
      const url = sanitizer.bypassSecurityTrustResourceUrl(icon.src + icon.name + extention);
      matIconRegistry.addSvgIcon(icon.name, url);
    });
  }
}
