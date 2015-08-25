angular.module('hstracker.deck-builder', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/deck-builder', {
            templateUrl: 'modules/deck-builder/deck-builder.html',
            controller: 'DeckBuilderController'
        });
    }])

    .controller('DeckBuilderController', [function() {

    }]);
