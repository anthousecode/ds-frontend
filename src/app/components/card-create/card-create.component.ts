import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CardCreateModalComponent } from './shared/dialogs/card-create-modal/card-create-modal.component';
import { IToken } from '../../ui/shared/interfaces/token.interface';
import { TokenService } from '../../@core/shared/services/token.service';
import {TOKEN} from '../card-thirteen-y/shared/data/token';

@Component({
  selector: 'app-card-create',
  templateUrl: './card-create.component.html',
  styleUrls: ['./card-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: '__old'}
})
export class CardCreateComponent implements OnInit {
  token = TOKEN;

  constructor(
    private dialog: MatDialog) {
  }

  ngOnInit() {
    localStorage.setItem('token', this.token);
  }

  createCard() {
    this.dialog.open(CardCreateModalComponent, {panelClass: 'dialogs'});
  }
}
