import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { MAT_CARD_CONFIG } from '@angular/material/card';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { provideDateFnsDatetimeAdapter } from '@ng-matero/extensions-date-fns-adapter';
import { FORMLY_CONFIG, provideFormlyCore } from '@ngx-formly/core';
import { withFormlyMaterial } from '@ngx-formly/material';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { NgxPermissionsModule } from 'ngx-permissions';

import {
  BASE_URL,
  interceptors,
  SettingsService,
  StartupService,
  TranslateLangService,
} from '@core';
import { environment } from '@env/environment';
import { formlyConfigFactory, PaginatorI18nService } from '@shared';
import { routes } from './app.routes';

import { LoginService } from '@core/authentication/login.service';
import { FakeLoginService } from './fake-login.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    { provide: BASE_URL, useValue: environment.baseUrl },
    provideAppInitializer(() => inject(TranslateLangService).load()),
    provideAppInitializer(() => inject(StartupService).load()),
    provideHttpClient(withInterceptors(interceptors)),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withComponentInputBinding()
    ),
    provideHotToastConfig(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({ prefix: 'i18n/', suffix: '.json' }),
    }),
    importProvidersFrom(
      NgxPermissionsModule.forRoot(),
    ),
    // ==================================================
    // 👇 ❌ Remove it in the realworld application
    //
    { provide: LoginService, useClass: FakeLoginService },
    //
    // ==================================================
    provideFormlyCore([...withFormlyMaterial()]),
    {
      provide: FORMLY_CONFIG,
      useFactory: formlyConfigFactory,
      deps: [TranslateService],
      multi: true,
    },
    {
      provide: MatPaginatorIntl,
      deps: [PaginatorI18nService],
      useFactory: (paginatorI18nSrv: PaginatorI18nService) => paginatorI18nSrv.getPaginatorIntl(),
    },
    {
      provide: MAT_DATE_LOCALE,
      useFactory: () => inject(SettingsService).getLocale(),
    },
    {
      provide: MAT_CARD_CONFIG,
      useValue: {
        appearance: 'outlined',
      },
    },
    provideDateFnsAdapter({
      parse: {
        dateInput: 'dd-MM-yyyy',
      },
      display: {
        dateInput: 'dd-MM-yyyy',
        monthYearLabel: 'MMM yyyy',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMM yyyy',
      },
    }),
    provideDateFnsDatetimeAdapter({
      parse: {
        dateInput: 'dd-MM-yyyy',
        yearInput: 'yyyy',
        monthInput: 'MMMM',
        datetimeInput: 'dd-MM-yyyy mm:HH',
        timeInput: 'mm:HH',
      },
      display: {
        dateInput: 'dd-MM-yyyy',
        yearInput: 'yyyy',
        monthInput: 'MMMM',
        datetimeInput: 'dd-MM-yyyy mm:HH',
        timeInput: 'mm:HH',
        monthYearLabel: 'MMM yyyyM',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM yyyy',
        popupHeaderDateLabel: 'dd MMM, E',
      },
    }),
  ],
};
