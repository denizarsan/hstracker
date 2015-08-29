angular.module('hstracker.header', [])

    .controller('HeaderController', [

        '$location',
        '$rootScope',
        '$scope',
        '$window',

        function($location,
                 $rootScope,
                 $scope,
                 $window) {

            $scope.showBack = true;
            $scope.showHome = true;

            $scope.back = function() {
                $window.history.back(-1);
            };

            $scope.home = function() {
                $location.path('/home');
            };

            $rootScope.$on('$routeChangeSuccess', function() {
                $scope.showBack = true;
                $scope.showHome = true;

                if ($location.path() === '/home') {
                    $scope.showBack = false;
                    $scope.showHome = false;
                    $scope.title = 'Hearthstone Tracker';
                } else if ($location.path() === '/deck-builder') {
                    //TODO
                } else if ($location.path() === '/deck-picker') {
                    $scope.title = 'Pick a Deck';
                } else if ($location.path() === '/deck-tracker') {
                    //TODO
                }
            });

        }
    ])

    .directive('hsHeader', [

        function() {

            return {
                controller: 'HeaderController',
                templateUrl: 'modules/header/header.html'
            };
        }
    ]);
