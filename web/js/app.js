var tsApp = angular.module('tsApp', ['ngMaterial', 'ngRoute', 'ngMessages']);

tsApp.config(function($mdThemingProvider, $mdIconProvider, $locationProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('red');
});

tsApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/project', {
            templateUrl: 'project.html',
            controller: 'projectCtrl'
        }).
        when('/tracker', {
            templateUrl: 'tracker.html',
            controller: 'trackerCtrl'
        }).
        when('/invoice', {
            templateUrl: 'invoice.html',
            controller: 'invoiceCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);

tsApp.controller('ToolbarCtrl', function($rootScope, $scope, $mdSidenav) {
    $scope.toggle = function() {
        $mdSidenav('left').toggle();
    }
});
