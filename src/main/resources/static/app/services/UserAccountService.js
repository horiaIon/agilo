angular.module("agiloApp").factory('UserAccountService', ['$resource', '$http',
    function($resource, $http) {
        'use strict';

        var functions =
            {
                getAccount: $resource('user/account', {}, {
                    get: {method: 'GET', isArray: false}
                }),
                registerUser: $resource('user/register', {}, {
                    send: {method: 'POST', isArray: false}
                })
            };

        return functions;
    }]);