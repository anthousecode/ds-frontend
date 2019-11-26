import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {IChangesHistory, IInfoHistory} from '../../interfaces/changes-history.interface';

import {CardThirteenYService} from '../../../card-thirteen-y.service';
import {ICardThirteenYMenu} from '../../interfaces/card-thirteen-y-menu.interface';
import {CHANGES_HISTORY_MENU} from '../../data/changes-history-menu';

@Component({
  selector: 'app-changes-history',
  templateUrl: './changes-history.component.html',
  styleUrls: ['./changes-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangesHistoryComponent implements OnInit {
  historyMenu: ICardThirteenYMenu[] = CHANGES_HISTORY_MENU;
  infoData!: IInfoHistory[];
  statusData!: string[];
  activeTabKey!: string;

  constructor(private cardThirteenYService: CardThirteenYService,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.activeTabKey = 'info';
    this.cardThirteenYService.getHistory().subscribe((data: IChangesHistory) => {
      this.infoData = data.infoHistory;
      this.statusData = data.statusHistory;
      this.cdRef.detectChanges();
    });
  }

  changeTab(tabKey: string) {
    if (tabKey !== this.activeTabKey) {
      this.activeTabKey = tabKey;
    }
  }
}
