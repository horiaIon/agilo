//keeps data about the user per session
angular.module("agiloApp").factory('Session', function() {
    'use strict';

    this.create = function(userName, firstName, lastName, userRoles) {
        this.userName = userName;
        this.firstName = firstName;
        this.lastName = lastName;
        this.userRoles = userRoles;
    };
    this.invalidate = function() {
        this.userName = null;
        this.firstName = null;
        this.lastName = null;
        this.userRoles = null;
    };
    return this;
});

angular.module("agiloApp").constant('USER_ROLES', {
    all: '*',
    admin: 'ROLE_ADMIN',
    user: 'ROLE_USER'
});

angular.module("agiloApp").factory('AuthenticationService', ['$rootScope', '$http', '$location', 'Session', 'UserAccountService', 'authService',
    function($rootScope, $http, $location, Session, UserAccountService, authService) {
        'use strict';

        var functions = {
            login: function(param) {
                var data = "j_username=" + param.username + "&j_password=" + param.password + "&submit=Login";
                $rootScope.hideNotification();

                $http.post('application/authentication', data, {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    ignoreAuthModule: false
                }).then(function successCallback(data, status, headers, config) {
                    // console.log('login success: ', status, data);
                    $rootScope.loading = false;
                    $rootScope.agiloAuthenticated = true;
                    authService.loginConfirmed(data);
                    functions.getUser();
                }, function errorCallback(data, status, headers, config) {
                    // console.log('login error: ', data, status);
                    $rootScope.loading = false;
                    $rootScope.agiloAuthenticated = false;
                    $rootScope.notification = '<strong>Authentication failed!</strong> Please check your credentials and try again.';
                    $rootScope.status = "danger";
                    Session.create(null, 'User', null, null);
                    $rootScope.appAccount = Session;
                });
            },
            getNewXsrfToken: function() {
                $http.post('user/new-xsrf-token').then(function successCallback(data, status, headers, config) {
                    // console.log('getNewXsrfToken success');
                }, function errorCallback(data, status, headers, config) {
                    // console.log('getNewXsrfToken success');
                });
            },
            getUser: function() {
                UserAccountService.getAccount.get({},
                    function success(data) {
                        // console.log('getUser: ', data);
                        if (data.firstName === undefined) {
                            Session.create(null, 'User', null, null);
                            $rootScope.agiloAuthenticated = false;
                        } else {
                            Session.create(data.userName, data.firstName, data.lastName, data.roles);
                            $rootScope.agiloAuthenticated = true;
                        }
                        $rootScope.appAccount = Session;
                    }, function err() {
                        Session.create(null, 'User', null, null);
                        $rootScope.appAccount = Session;
                        $rootScope.agiloAuthenticated = false;
                    });
            },
            //dirty csrf logout fix (logout even on error)
            logout: function() {
                var cb = function(data, status, headers, config) {
                    Session.create(null, 'User', null, null);
                    $rootScope.agiloAuthenticated = false;
                    $rootScope.appAccount = Session;
                    authService.loginCancelled();
                };
                $http.post('application/logout').then(function successCallback(data, status, headers, config) {
                   cb();
                }, function errorCallback(data, status, headers, config) {
                    cb();
                });
            }
        };

        return functions;
    }]);