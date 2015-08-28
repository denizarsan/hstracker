angular.module('hstracker.home', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'modules/home/home.html',
            controller: 'HomeController'
        });
    }])

    .controller('HomeController', [function() {

    }]);
