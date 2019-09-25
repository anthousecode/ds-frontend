import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Система мониторинга проведения диспансеризации детей-сирот и детей, находящихся в трудной жизненной ситуации';

    constructor(private titleService: Title) {}

    ngOnInit() {
        this.titleService.setTitle(this.title);
    }
}
