angular.module('hstracker.deck-tracker', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/deck-tracker', {
            templateUrl: 'modules/deck-tracker/deck-tracker.html',
            controller: 'DeckTrackerController'
        });
    }])

    .controller('DeckTrackerController', [function() {

    }]);
