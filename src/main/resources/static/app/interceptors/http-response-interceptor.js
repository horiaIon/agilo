//interceptor pt a transforma jsonul din string in obiect
angular.module('response-interceptor', [])
    .factory('responseMarker', ['$rootScope', '$q', function($rootScope, $q) {
        var reqMarker = {
            request: function(config) {
                return config || $q.when(config);
            },
            requestError: function(request) {
                return $q.reject(request);
            },
            response: function(response) {
                return response;
            },
            responseError: function(response) {
                $rootScope.loading = false;
                console.log('>>>>response interceptor error: ', response.status, response);
                if (response.status === 401) {
                    $rootScope.$broadcast('event:auth-loginRequired', response);
                } else if (response.status === 403) {
                    if(response.config.url !== 'user/new-xsrf-token') {
                        $rootScope.$broadcast('event:auth-notAuthorized', response);
                    }
                } else if (response.status === 400) {
                    //console.log('interceptor.error3 400 ====================  BAD REQUEST ==============:', response);
                    $rootScope.$broadcast('event:bad-request', response);
                } else if (response.status === 500) {
                    //console.log('interceptor.error3 500 ====================  INTERNAL ERROR ==============:', response);
                    $rootScope.notification = '<strong>Technical error!</strong> Please contact support!';
                    $rootScope.status = "danger";
                    return $q.reject(response);
                }
                return $q.reject(response);
            }
        };
        return reqMarker;
    }])
;


