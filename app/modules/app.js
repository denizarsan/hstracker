angular.module('hstracker', [

    'ngRoute',
    'hstracker.deck-builder',
    'hstracker.deck-picker',
    'hstracker.deck-tracker',
    'hstracker.home',
    'hstracker.utils'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.otherwise({ redirectTo: '/home' });
    }])

    .run(['Cards', function(Cards) {
        Cards.setup();
    }]);
