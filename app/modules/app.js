angular.module('hstracker', [

    'ui.router',
    'hstracker.deck-builder',
    'hstracker.deck-picker',
    'hstracker.deck-tracker',
    'hstracker.header',
    'hstracker.home',
    'hstracker.utils'])

    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/home');

        $stateProvider.state('deck-builder', {
            url: '/deck-builder',
            templateUrl: 'modules/deck-builder/partials/deck-builder.html'
        })
        .state('deck-builder.build', {
            url: '/deck-builder/build',
            templateUrl: 'modules/deck-builder/partials/build.html',
            controller: 'BuildController'
        })
        .state('deck-builder.import', {
            url: '/deck-builder/import',
            templateUrl: 'modules/deck-builder/partials/import.html',
            controller: 'ImportController'
        })
        .state('deck-picker', {
            url: '/deck-picker',
            templateUrl: 'modules/deck-picker/partials/deck-picker.html',
            controller: 'DeckPickerController'
        })
        .state('deck-tracker', {
            url: '/deck-tracker/:deckName',
            templateUrl: 'modules/deck-tracker/partials/deck-tracker.html',
            controller: 'DeckTrackerController'
        })
        .state('home', {
            url: '/home',
            templateUrl: 'modules/home/partials/home.html'
        });
    }])

    .run([

        '$rootScope',
        '$state',
        'Cards',

        function($rootScope,
                 $state,
                 Cards) {

            var Window = require('nw.gui').Window.get();

            $rootScope.$on('$stateChangeSuccess', function() {
                if (!$state.is('deck-tracker')) {
                    Window.height = 568 + Window.window.outerHeight - Window.window.innerHeight;
                }
            });

            Cards.setup();
        }
    ]);
