angular.module('hstracker.header', [])

    .controller('HeaderController', [

        '$rootScope',
        '$scope',
        '$state',
        '$window',

        function($rootScope,
                 $scope,
                 $state,
                 $window) {

            $scope.showBack = true;
            $scope.showHome = true;

            $scope.back = function() {
                $window.history.back(-1);
            };

            $scope.home = function() {
                $state.go('home');
            };

            $rootScope.$on('$stateChangeSuccess', function() {
                $scope.showBack = true;
                $scope.showHome = true;
                $scope.showHeader = true;

                if ($state.is('home')) {
                    $scope.showBack = false;
                    $scope.showHome = false;
                    $scope.title = 'Hearthstone Tracker';
                } else if ($state.is('deck-builder.build')) {
                    $scope.title = 'Build a deck';
                } else if ($state.is('deck-builder.import')) {
                    $scope.title = 'Import a deck';
                } else if ($state.is('deck-picker')) {
                    $scope.title = 'Pick a Deck';
                } else if ($state.is('deck-tracker')) {
                    $scope.showHeader = false;
                }
            });

        }
    ])

    .directive('hsHeader', [

        function() {

            return {
                controller: 'HeaderController',
                templateUrl: 'modules/header/partials/header.html'
            };
        }
    ]);
