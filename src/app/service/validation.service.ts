import {ElementRef, Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
/**
 * Сервис для проверок валидаций при отоброжений error-text
 */
export class ValidationService {

  constructor(private el: ElementRef) {
  }

  /**
   * Функций проверки то что валидный;
   * @param name - formControlName  названия контроллерра
   * @param nameGroup - название нашей реактивной формы
   * @return boolean значение. Возвращает ответ прошло ли валидацию (true || false)
   */
  static checkValidation(name: string, nameGroup: FormGroup): boolean {
    return nameGroup.controls[name].invalid &&
      (nameGroup.controls[name].dirty || nameGroup.controls[name].touched);
  }
}
