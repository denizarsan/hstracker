angular.module('hstracker', [

    'ngRoute',
    'hstracker.deck-builder',
    'hstracker.deck-tracker',
    'hstracker.utils'])

    .config(['$routeProvider',function($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/deck-tracker'});
    }]);
