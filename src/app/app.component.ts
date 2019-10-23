import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {UserService} from './service/user.service';
import {NavigationEnd, Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Система мониторинга проведения диспансеризации детей-сирот и детей, находящихся в трудной жизненной ситуации';

    constructor(
        private titleService: Title,
        private route: Router,
        private userService: UserService,
    ) {}

    ngOnInit() {
        this.titleService.setTitle(this.title);

        this.route.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                this.userService.getUserInfo();
            }
        });
    }
}
