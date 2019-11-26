import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {UserService} from './service/user.service';
import {NavigationEnd, Router} from '@angular/router';
import {AuthConfig, OAuthService} from 'angular-oauth2-oidc';
import {environment} from '../environments/environment';

export const authConfig: AuthConfig = {
    issuer: environment.oidcIssuer,
    redirectUri: window.location.origin,
    oidc: true,
    clientId: environment.oidcClientId,
    dummyClientSecret: environment.oidcClientSecret,
    responseType: 'code',
    disableAtHashCheck: true
};

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
        private oauthService: OAuthService
    ) {
        // this.oauthService.configure(authConfig);
        // this.oauthService.setStorage(sessionStorage);
        // this.oauthService.loadDiscoveryDocumentAndLogin();
    }

    ngOnInit() {
        this.titleService.setTitle(this.title);

        this.route.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                // this.userService.getUserInfo();
            }
        });
    }
}
