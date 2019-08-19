import {Component, EventEmitter, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {Access, TalonModel} from '../../models/talon.model';
import {TalonService} from '../../service/talon.service';

export const pickerI18n = {
  cancel: 'Отмена',
  clear: 'Очистить',
  done: 'ОК',
  previousMonth: '‹',
  nextMonth: '›',
  months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
  weekdays: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
  weekdaysShort: ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'],
  weekdaysAbbrev: ['В', 'П', 'В', 'С', 'Ч', 'П', 'С'],
};

@Component({
  selector: 'app-talon',
  templateUrl: './talon.component.html',
  styleUrls: ['./talon.component.scss']
})
export class TalonComponent implements OnInit {

  talon: TalonModel;
  access: Access;

  onTalonChange: EventEmitter<TalonModel> = new EventEmitter();

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private talonService: TalonService
  ) {
  }

  ngOnInit() {
    const params = this.route.snapshot.paramMap;

    this.talon = new TalonModel();

    console.log(this.talon, 'here');

    if (params.has('id')) {
      this.getTalon(Number(params.get('id')));
    }
  }

  getTalon(id: number) {
    this.talonService.getTalon(id).subscribe(response => {
      this.talon = response.talon;
      this.access = response.access;
      this.onTalonChange.emit(this.talon);
    });
  }

  saveTalon() {
    if (this.talon.id) {
      this.talonService.putTalon(this.talon).subscribe(response => {
        console.log(response);
      });
    }
  }

  public isReadable(field: string): boolean {
    return !(this.access && this.access.rules[field] !== undefined && this.access.rules[field] === 0);
  }

  public isEditable(field: string): boolean {
    return !(this.access && this.access.rules[field] !== undefined && this.access.rules[field] < 2);
  }

}
