angular.module("agiloApp").config(['$stateProvider', '$urlRouterProvider', 'VIEWS_DIRECTORY', 'USER_ROLES',
    function($stateProvider, $urlRouterProvider, VIEWS_DIRECTORY, USER_ROLES) {
        'use strict';

        // APPLICATION ROUTES
        // -----------------------------------
        // For any unmatched url, redirect to /app/home
        $urlRouterProvider
            .when('', '/app/home')
            .otherwise("/app/home");

        //
        // Set up the states
        $stateProvider
            .state('app', {
                url: "/app",
                templateUrl: VIEWS_DIRECTORY + "app.html",
                abstract: true
            })
            .state('app.home', {
                url: '/home',
                templateUrl: VIEWS_DIRECTORY + "home.html",
                access: {authorizedRoles: USER_ROLES.all}
            })
            .state('app.admin', {
                url: '/admin',
                templateUrl: VIEWS_DIRECTORY + "home.html",
                access: {authorizedRoles: USER_ROLES.admin}
            })
            .state('error403', {
                url: '/error403',
                templateUrl: VIEWS_DIRECTORY + "error403.html",
                access: {authorizedRoles: USER_ROLES.all}
            })
            .state('error404', {
                url: '/error404',
                templateUrl: VIEWS_DIRECTORY + "error404.html",
                access: {authorizedRoles: USER_ROLES.all}
            })

            //login
            .state('app.login', {
                url: '',
                template: '<div ui-view class="fade-in-up"></div>',
                abstract: true
            })
            .state('app.login.signin', {
                url: '/signin',
                templateUrl: VIEWS_DIRECTORY + "login/login.html",
                access: {authorizedRoles: USER_ROLES.all}
            })
            .state('app.login.registration', {
                url: '/registration',
                templateUrl: VIEWS_DIRECTORY + "login/register.html",
                access: {authorizedRoles: USER_ROLES.all}
            })
        ;

    }]);