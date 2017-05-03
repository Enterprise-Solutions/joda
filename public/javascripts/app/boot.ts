import 'core-js';
import 'reflect-metadata';
import 'zone.js/dist/zone';

import {bootstrap} from '@angular/platform-browser-dynamic';
import {provide} from '@angular/core';
import {HTTP_PROVIDERS} from '@angular/http';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';

import { enableProdMode} from '@angular/core';
import { disableDeprecatedForms, provideForms } from '@angular/forms';

// Main App Component
import {VoyagerComponent} from './voyager.component';

console.info('app.environment: ' + app.environment);

if(app.environment === 'production'){
	enableProdMode();	
}

bootstrap(<any>VoyagerComponent, [
	HTTP_PROVIDERS,
	ROUTER_PROVIDERS,
    disableDeprecatedForms(),
    provideForms(),
    provide(LocationStrategy, {useClass: HashLocationStrategy})
]);
