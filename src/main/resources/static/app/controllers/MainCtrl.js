angular.module("agiloApp").controller('MainCtrl',
    ['$q', '$rootScope', '$scope', 'AuthenticationService', '$document', 'VIEWS_DIRECTORY',
        function($q, $rootScope, $scope, AuthenticationService, $document, VIEWS_DIRECTORY) {

            'use strict';
            $rootScope.viewsDirectory = VIEWS_DIRECTORY;
            $rootScope.selectionPerPage = [5, 10, 20, 30, 50];

            // USER RELATED
            if ($rootScope.appAccount === undefined) {
                AuthenticationService.getUser();
            }

            //global function to scroll page up
            $scope.toTheTop = function() {
                $document.scrollTopAnimated(0, 600);
            };

            $scope.logout = function() {
                AuthenticationService.logout();
            };

            /* remove notifications when hiding dialog */
            $rootScope.hideNotification = function() {
                delete $rootScope.notification;
                delete $rootScope.status;
            };

            //when notifications appear scroll to the top
            $scope.$watch('notification', function(newValue, oldValue) {
                if (newValue !== undefined && newValue) {
                    $scope.toTheTop();
                }
            });

            $scope.hasRole = function(authorizedRole) {
                return !!($rootScope.appAccount && $rootScope.appAccount.userRoles && $rootScope.appAccount.userRoles.indexOf(authorizedRole) !== -1);
            };

        }
    ]
);