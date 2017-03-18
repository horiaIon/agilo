angular.module("agiloApp").value('duScrollDuration', 1400);

angular.module("agiloApp").run(['$state', '$stateParams', '$rootScope', 'cfpLoadingBar', '$document', '$cookies', 'AuthenticationService',
    function($state, $stateParams, $rootScope, cfpLoadingBar, $document, $cookies, AuthenticationService) {

        // Attach Fastclick for eliminating the 300ms delay between a physical tap and the firing of a click event on mobile browsers
        FastClick.attach(document.body);

        // Set some reference to access them from any scope
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        // GLOBAL APP SCOPE
        // set below basic information
        $rootScope.app = {
            name: 'AgiloApp', // name of your project
            author: 'elena', // author's name or company name
            description: 'Disertatie', // brief description
            version: '1.0.0'// current version
        };

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            //start loading bar on stateChangeStart
            cfpLoadingBar.start();
            $rootScope.hideNotification();

            if(!$rootScope.agiloAuthenticated  && $cookies.get('XSRF-TOKEN') === undefined) {
                //make a post call to get a new XSRF-TOKEN
                AuthenticationService.getNewXsrfToken();
            }
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            //stop loading bar on stateChangeSuccess
            cfpLoadingBar.complete();

            // scroll top the page on change state
            $document.scrollTo(0, 0);
        });

        // Call when the the client is confirmed
        $rootScope.$on('event:auth-loginConfirmed', function() {
            $rootScope.agiloAuthenticated = true;
            $state.go('app.home');
        });

        // Call when the 401 response is returned by the server
        $rootScope.$on('event:auth-loginRequired', function() {
            $rootScope.agiloAuthenticated = false;
            $state.go('error403');
        });

        // Call when the 400 (bad request) response is returned by the server
        $rootScope.$on('event:bad-request', function(rejection) {
            $rootScope.status = "danger";
            $rootScope.notification = "<strong>Bad request sent to the server!</strong> If you didn't modified it, please contact support!";
        });

        // Call when the 403 response is returned by the server
        $rootScope.$on('event:auth-notAuthorized', function(rejection) {
            $state.go('error403', null, {reload: true});
        });

        // Call when the user logs out
        $rootScope.$on('event:auth-loginCancelled', function() {
            $state.go('app.home');
        });
    }
]);

angular.module("agiloApp").config(["$locationProvider", function($locationProvider) {
    $locationProvider.hashPrefix('');
}]);

angular.module("agiloApp").config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push('responseMarker');
    $httpProvider.defaults.useXDomain = true;
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
    //$httpProvider.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
}]);

// Angular-Loading-Bar configuration
angular.module("agiloApp").config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = false;
}]);
