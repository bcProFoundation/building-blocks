(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/client/$$_lazy_route_resource lazy recursive":
/*!*****************************************************************!*\
  !*** ./src/client/$$_lazy_route_resource lazy namespace object ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/client/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/client/app/app-routing.module.ts":
/*!**********************************************!*\
  !*** ./src/client/app/app-routing.module.ts ***!
  \**********************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _server_settings_server_settings_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./server-settings/server-settings.component */ "./src/client/app/server-settings/server-settings.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



const routes = [
    { path: 'settings', component: _server_settings_server_settings_component__WEBPACK_IMPORTED_MODULE_2__["ServerSettingsComponent"] }
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]],
    })
], AppRoutingModule);



/***/ }),

/***/ "./src/client/app/app.component.css":
/*!******************************************!*\
  !*** ./src/client/app/app.component.css ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/client/app/app.component.html":
/*!*******************************************!*\
  !*** ./src/client/app/app.component.html ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!--The content below is only a placeholder and can be replaced.-->\n<div style=\"text-align:center\">\n  <h1>\n    Server Client Setup\n  </h1>\n  <h2>\n    Client : {{ clientMessage }}\n  </h2>\n  <h2>\n    Server : {{ serverMessage }}\n  </h2>\n  <img width=\"300\" alt=\"Angular Logo\" src=\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg==\">\n  <button (click)=\"loginUsingOIDC()\">LOGIN</button>\n</div>\n<h2>Here are some links to help you start: </h2>\n<ul>\n  <li>\n    <h2><a target=\"_blank\" rel=\"noopener\" href=\"https://angular.io/tutorial\">Tour of Heroes</a></h2>\n  </li>\n  <li>\n    <h2><a target=\"_blank\" rel=\"noopener\" href=\"https://github.com/angular/angular-cli/wiki\">CLI Documentation</a></h2>\n  </li>\n  <li>\n    <h2><a target=\"_blank\" rel=\"noopener\" href=\"https://blog.angular.io/\">Angular blog</a></h2>\n  </li>\n</ul>\n\n<router-outlet></router-outlet>\n"

/***/ }),

/***/ "./src/client/app/app.component.ts":
/*!*****************************************!*\
  !*** ./src/client/app/app.component.ts ***!
  \*****************************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _app_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.service */ "./src/client/app/app.service.ts");
/* harmony import */ var angular_oauth2_oidc__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! angular-oauth2-oidc */ "./node_modules/angular-oauth2-oidc/esm2015/angular-oauth2-oidc.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let AppComponent = class AppComponent {
    constructor(appService, oauthService) {
        this.appService = appService;
        this.oauthService = oauthService;
        this.title = 'app';
        this.clientMessage = 'Angular 6';
    }
    ngOnInit() {
        const ac = new angular_oauth2_oidc__WEBPACK_IMPORTED_MODULE_2__["AuthConfig"]();
        ac.requireHttps = false;
        ac.issuer = "http://localhost.com:3000";
        ac.loginUrl = "http://localhost:3000/oauth2/confirmation";
        ac.userinfoEndpoint = "http://localhost:3000/oauth2/profile";
        ac.tokenEndpoint = "http://localhost:3000/oauth2/token";
        ac.clientId = "0dc30a39-2dd1-4a45-8800-f78297e6828e";
        ac.redirectUri = "http://localhost:4200/index.html";
        ac.scope = "openid";
        ac.oidc = false;
        ac.showDebugInformation = true;
        this.getServerMessage();
        this.oauthService.configure(ac);
    }
    getServerMessage() {
        this.appService.getMessage()
            .subscribe(response => this.serverMessage = response.message);
    }
    loginUsingOIDC() {
        if (!this.oauthService.hasValidIdToken()) {
            this.oauthService.loadDiscoveryDocument("http://localhost:3000/.well-known/openid-configuration")
                .then((doc) => {
                this.oauthService.tryLogin();
            });
            this.oauthService.initImplicitFlow();
        }
    }
};
AppComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-root',
        template: __webpack_require__(/*! ./app.component.html */ "./src/client/app/app.component.html"),
        styles: [__webpack_require__(/*! ./app.component.css */ "./src/client/app/app.component.css")],
        providers: [
            { provide: angular_oauth2_oidc__WEBPACK_IMPORTED_MODULE_2__["OAuthStorage"], useValue: sessionStorage }
        ]
    }),
    __metadata("design:paramtypes", [_app_service__WEBPACK_IMPORTED_MODULE_1__["AppService"],
        angular_oauth2_oidc__WEBPACK_IMPORTED_MODULE_2__["OAuthService"]])
], AppComponent);



/***/ }),

/***/ "./src/client/app/app.module.ts":
/*!**************************************!*\
  !*** ./src/client/app/app.module.ts ***!
  \**************************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm2015/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app-routing.module */ "./src/client/app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app.component */ "./src/client/app/app.component.ts");
/* harmony import */ var _app_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app.service */ "./src/client/app/app.service.ts");
/* harmony import */ var _http_error_handler_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./http-error-handler.service */ "./src/client/app/http-error-handler.service.ts");
/* harmony import */ var _message_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./message.service */ "./src/client/app/message.service.ts");
/* harmony import */ var angular_oauth2_oidc__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! angular-oauth2-oidc */ "./node_modules/angular-oauth2-oidc/esm2015/angular-oauth2-oidc.js");
/* harmony import */ var _server_settings_server_settings_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./server-settings/server-settings.component */ "./src/client/app/server-settings/server-settings.component.ts");
/* harmony import */ var _material_imports_module__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./material-imports.module */ "./src/client/app/material-imports.module.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _guards_auth_guard_auth_guard_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./guards/auth-guard/auth-guard.service */ "./src/client/app/guards/auth-guard/auth-guard.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};













let AppModule = class AppModule {
};
AppModule = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        declarations: [
            _app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"],
            _server_settings_server_settings_component__WEBPACK_IMPORTED_MODULE_9__["ServerSettingsComponent"]
        ],
        imports: [
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_3__["AppRoutingModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormsModule"],
            _material_imports_module__WEBPACK_IMPORTED_MODULE_10__["MaterialImportsModule"],
            angular_oauth2_oidc__WEBPACK_IMPORTED_MODULE_8__["OAuthModule"].forRoot()
        ],
        providers: [
            _app_service__WEBPACK_IMPORTED_MODULE_5__["AppService"],
            _http_error_handler_service__WEBPACK_IMPORTED_MODULE_6__["HttpErrorHandler"],
            _message_service__WEBPACK_IMPORTED_MODULE_7__["MessageService"],
            _guards_auth_guard_auth_guard_service__WEBPACK_IMPORTED_MODULE_12__["AuthGuardService"]
        ],
        bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_4__["AppComponent"]],
    })
], AppModule);



/***/ }),

/***/ "./src/client/app/app.service.ts":
/*!***************************************!*\
  !*** ./src/client/app/app.service.ts ***!
  \***************************************/
/*! exports provided: AppService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppService", function() { return AppService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var _http_error_handler_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./http-error-handler.service */ "./src/client/app/http-error-handler.service.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm2015/operators/index.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




let AppService = class AppService {
    constructor(http, httpErrorHandler) {
        this.http = http;
        this.messageUrl = '/message';
        this.handleError = httpErrorHandler.createHandleError('HeroesService');
    }
    getMessage() {
        return this.http.get(this.messageUrl)
            .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["catchError"])(this.handleError('getMessage', { message: 'disconnected' })));
    }
};
AppService = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
    __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"],
        _http_error_handler_service__WEBPACK_IMPORTED_MODULE_2__["HttpErrorHandler"]])
], AppService);



/***/ }),

/***/ "./src/client/app/guards/auth-guard/auth-guard.service.ts":
/*!****************************************************************!*\
  !*** ./src/client/app/guards/auth-guard/auth-guard.service.ts ***!
  \****************************************************************/
/*! exports provided: AuthGuardService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AuthGuardService", function() { return AuthGuardService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var angular_oauth2_oidc__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! angular-oauth2-oidc */ "./node_modules/angular-oauth2-oidc/esm2015/angular-oauth2-oidc.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let AuthGuardService = class AuthGuardService {
    constructor(oauthService, router) {
        this.oauthService = oauthService;
        this.router = router;
    }
    canActivate() {
        console.log('authguardservice');
        return this.oauthService.hasValidIdToken();
    }
};
AuthGuardService = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
    __metadata("design:paramtypes", [angular_oauth2_oidc__WEBPACK_IMPORTED_MODULE_2__["OAuthService"], _angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"]])
], AuthGuardService);



/***/ }),

/***/ "./src/client/app/http-error-handler.service.ts":
/*!******************************************************!*\
  !*** ./src/client/app/http-error-handler.service.ts ***!
  \******************************************************/
/*! exports provided: HttpErrorHandler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HttpErrorHandler", function() { return HttpErrorHandler; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm2015/index.js");
/* harmony import */ var _message_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./message.service */ "./src/client/app/message.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let HttpErrorHandler = class HttpErrorHandler {
    constructor(messageService) {
        this.messageService = messageService;
        this.createHandleError = (serviceName = '') => (operation = 'operation', result = {}) => this.handleError(serviceName, operation, result);
    }
    handleError(serviceName = '', operation = 'operation', result = {}) {
        return (error) => {
            const message = (error.error instanceof ErrorEvent) ?
                error.error.message :
                `server returned code ${error.status} with body "${error.error}"`;
            this.messageService.add(`${serviceName}: ${operation} failed: ${message}`);
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_1__["of"])(result);
        };
    }
};
HttpErrorHandler = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
    __metadata("design:paramtypes", [_message_service__WEBPACK_IMPORTED_MODULE_2__["MessageService"]])
], HttpErrorHandler);



/***/ }),

/***/ "./src/client/app/material-imports.module.ts":
/*!***************************************************!*\
  !*** ./src/client/app/material-imports.module.ts ***!
  \***************************************************/
/*! exports provided: MaterialImportsModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaterialImportsModule", function() { return MaterialImportsModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm2015/common.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm2015/material.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



let MaterialImportsModule = class MaterialImportsModule {
};
MaterialImportsModule = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatButtonModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatCheckboxModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatListModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatCardModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatFormFieldModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatInputModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatRadioModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatProgressBarModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatGridListModule"],
        ],
        exports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatButtonModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatCheckboxModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatListModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatCardModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatFormFieldModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatInputModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatRadioModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatProgressBarModule"],
            _angular_material__WEBPACK_IMPORTED_MODULE_2__["MatGridListModule"],
        ],
        declarations: [],
    })
], MaterialImportsModule);



/***/ }),

/***/ "./src/client/app/message.service.ts":
/*!*******************************************!*\
  !*** ./src/client/app/message.service.ts ***!
  \*******************************************/
/*! exports provided: MessageService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MessageService", function() { return MessageService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

let MessageService = class MessageService {
    constructor() {
        this.messages = [];
    }
    add(message) {
        this.messages.push(message);
    }
    clear() {
        this.messages = [];
    }
};
MessageService = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])()
], MessageService);



/***/ }),

/***/ "./src/client/app/server-settings/server-settings.component.css":
/*!**********************************************************************!*\
  !*** ./src/client/app/server-settings/server-settings.component.css ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/client/app/server-settings/server-settings.component.html":
/*!***********************************************************************!*\
  !*** ./src/client/app/server-settings/server-settings.component.html ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<mat-grid-list cols=\"1\" rowHeight=\"3:1\">\n  <mat-grid-tile>\n    <form (ngSubmit)=\"onSubmit()\">\n      <mat-card>\n        <mat-card-title>Server Settings</mat-card-title>\n        <mat-card-content>\n          <mat-form-field class=\"full-width\">\n            <input [(ngModel)]=\"settings.appURL\" matInput placeholder=\"Server URL\" name=\"appURL\" required>\n          </mat-form-field>\n        </mat-card-content>\n        <mat-card-actions>\n          <button type=\"submit\" mat-button>Save</button>\n        </mat-card-actions>\n      </mat-card>    \n    </form>\n  </mat-grid-tile>\n</mat-grid-list>"

/***/ }),

/***/ "./src/client/app/server-settings/server-settings.component.ts":
/*!*********************************************************************!*\
  !*** ./src/client/app/server-settings/server-settings.component.ts ***!
  \*********************************************************************/
/*! exports provided: ServerSettingsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServerSettingsComponent", function() { return ServerSettingsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _server_settings_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./server-settings.service */ "./src/client/app/server-settings/server-settings.service.ts");
/* harmony import */ var _server_settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./server-settings */ "./src/client/app/server-settings/server-settings.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let ServerSettingsComponent = class ServerSettingsComponent {
    constructor(settingsService) {
        this.settingsService = settingsService;
        this.settings = new _server_settings__WEBPACK_IMPORTED_MODULE_2__["ServerSettings"]();
    }
    ngOnInit() {
        this.settingsService.get().subscribe({
            next: (response) => {
                if (response)
                    this.settings = response;
            },
        });
    }
    onSubmit() {
        this.settingsService.save(this.settings).subscribe({
            next: (response) => {
                if (response)
                    this.settings = response;
            },
        });
    }
};
ServerSettingsComponent = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
        selector: 'app-server-settings',
        template: __webpack_require__(/*! ./server-settings.component.html */ "./src/client/app/server-settings/server-settings.component.html"),
        styles: [__webpack_require__(/*! ./server-settings.component.css */ "./src/client/app/server-settings/server-settings.component.css")],
    }),
    __metadata("design:paramtypes", [_server_settings_service__WEBPACK_IMPORTED_MODULE_1__["ServerSettingsService"]])
], ServerSettingsComponent);



/***/ }),

/***/ "./src/client/app/server-settings/server-settings.service.ts":
/*!*******************************************************************!*\
  !*** ./src/client/app/server-settings/server-settings.service.ts ***!
  \*******************************************************************/
/*! exports provided: ServerSettingsService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServerSettingsService", function() { return ServerSettingsService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../environments/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let ServerSettingsService = class ServerSettingsService {
    constructor(http) {
        this.http = http;
    }
    save(settings) {
        return this.http.post(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].routes.SAVE_SETTINGS, settings);
    }
    get() {
        return this.http.get(_environments_environment__WEBPACK_IMPORTED_MODULE_2__["environment"].routes.GET_SETTINGS);
    }
};
ServerSettingsService = __decorate([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])(),
    __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
], ServerSettingsService);



/***/ }),

/***/ "./src/client/app/server-settings/server-settings.ts":
/*!***********************************************************!*\
  !*** ./src/client/app/server-settings/server-settings.ts ***!
  \***********************************************************/
/*! exports provided: ServerSettings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ServerSettings", function() { return ServerSettings; });
class ServerSettings {
}


/***/ }),

/***/ "./src/client/main.ts":
/*!****************************!*\
  !*** ./src/client/main.ts ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm2015/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/client/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(err => console.log(err));


/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
const environment = {
    production: false,
    routes: {
        SAVE_SETTINGS: '/settings/v1/save',
        GET_SETTINGS: '/settings/v1/get',
    },
};


/***/ }),

/***/ 0:
/*!**********************************!*\
  !*** multi ./src/client/main.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/gaurav/Projects/building-blocks/apps/infrastructure-console/src/client/main.ts */"./src/client/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map