angular.module("agiloApp").controller('LoginCtrl',
    ['$scope', '$rootScope', 'AuthenticationService', 'UserAccountService', 'vcRecaptchaService',
        function($scope, $rootScope, AuthenticationService, UserAccountService, vcRecaptchaService) {
            'use strict';

            function resetUserInfo() {
                $scope.registerAccount = {};
                $scope.registerAccount.isMale = true;
                $scope.rememberMe = false;
            }

            $scope.recoveryEmail = '';
            $scope.captchaResponse = null;
            $scope.widgetId = null;

            resetUserInfo();

            $scope.model = {
                captchaKey: '6Lf3gBkUAAAAAKHVzAliceCbljX606NswdOYzIDu'
            };

            $scope.vbbLogin = function() {
                //console.log('$scope.username: ', $scope.username, $scope.rememberMe);
                $rootScope.loading = true;
                AuthenticationService.login({
                    username: $scope.username,
                    password: $scope.password,
                    rememberMe: $scope.rememberMe
                });
            };

            $scope.setResponse = function(response) {
                //console.info('Response available: ', response);
                $scope.captchaResponse = response;
            };
            $scope.setWidgetId = function(widgetId) {
                //console.info('Created widget ID: %s', widgetId);
                $scope.widgetId = widgetId;
            };

            $scope.register = function() {
                //console.log('registerAccount: ', $scope.registerAccount)
                $rootScope.loading = true;
                $scope.registerAccount.captchaResponse = $scope.captchaResponse;

                UserAccountService.registerUser.send($scope.registerAccount,
                    function(value) {
                        console.log('register success: ', value);
                        $rootScope.loading = false;
                        if (value.success) {
                            $rootScope.notification = 'Success register';
                            $rootScope.status = "success";
                            $scope.signupForm.$setPristine();
                            $scope.signupForm.$setUntouched();
                            resetUserInfo();
                            vcRecaptchaService.reload($scope.widgetId);
                        } else if (value.errorMessages !== undefined) {
                            $scope.captchaResponse = null;
                            $rootScope.status = 'danger';
                            $rootScope.notification = value.errorMessages[0];
                            vcRecaptchaService.reload($scope.widgetId);
                        } else {
                            $scope.captchaResponse = null;
                            vcRecaptchaService.reload($scope.widgetId);
                        }
                    },
                    function(httpResponse) {
                        $rootScope.loading = false;
                        $scope.captchaResponse = null;
                        $rootScope.notification = '<strong>Technical error!</strong> Please contact support!';
                        $rootScope.status = "danger";
                        // In case of a failed validation you need to reload the captcha because each challenge can be checked just once
                        vcRecaptchaService.reload($scope.widgetId);
                    }
                );
            };
        }
    ]
);