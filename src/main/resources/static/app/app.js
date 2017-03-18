angular.module("agiloApp", [
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'ngTouch',
    'ui.router',
    'ngResource',
    'ui.bootstrap',
    'ui.select',
    'cfp.loadingBar',
    'duScroll',
    'vcRecaptcha',

    'http-auth-interceptor',
    'response-interceptor'
]);

angular.module("agiloApp").constant('VIEWS_DIRECTORY', 'static/partials/');