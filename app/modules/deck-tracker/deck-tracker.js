angular.module('hstracker.deck-tracker', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/deck-tracker', {
            templateUrl: 'modules/deck-tracker/deck-tracker.html',
            controller: 'DeckTrackerController'
        });
    }])

    .controller('DeckTrackerController', [

        '$scope',

        function($scope) {

            $scope.zones = {
                hand: {
                    name: 'HAND',
                    cards: []
                },
                deck: {
                    name: 'DECK',
                    cards: []
                },
                play: {
                    name: 'PLAY',
                    cards: []
                },
                graveyard: {
                    name: 'GRAVEYARD',
                    cards: []
                },
                secret: {
                    name: 'SECRET',
                    cards: []
                },
                playHero: {
                    name: 'PLAY (Hero)',
                    cards: []
                },
                playPower: {
                    name: 'PLAY (Hero Power)',
                    cards: []
                },
                playWeapon: {
                    name: 'PLAY (Weapon)',
                    cards: []
                }
            };

            var LogWatcher = require('hearthstone-log-watcher'),
                logWatcher = new LogWatcher();

            logWatcher.on('zone-change', function(data) {
                var card = {
                    name: data.cardName,
                    entityId: data.entityId,
                    id: data.cardId
                };

                if (data.team === 'FRIENDLY') {
                    if (data.zone === 'HAND') {
                        removeCardFromOtherZones($scope.zones.hand, card);
                        $scope.zones.hand.cards.push(card);
                    } else if (data.zone === 'PLAY'){
                        removeCardFromOtherZones($scope.zones.play, card);
                        $scope.zones.play.cards.push(card);
                    } else if (data.zone === 'GRAVEYARD'){
                        removeCardFromOtherZones($scope.zones.graveyard, card);
                        $scope.zones.graveyard.cards.push(card);
                    } else if (data.zone === 'DECK'){
                        removeCardFromOtherZones($scope.zones.deck, card);
                        $scope.zones.deck.cards.push(card);
                    } else if (data.zone === 'SECRET'){
                        removeCardFromOtherZones($scope.zones.secret, card);
                        $scope.zones.secret.cards.push(card);
                    } else if (data.zone === 'PLAY (Weapon)'){
                        removeCardFromOtherZones($scope.zones.playWeapon, card);
                        $scope.zones.playWeapon.cards.push(card);
                    } else if (data.zone === 'PLAY (Hero Power)'){
                        removeCardFromOtherZones($scope.zones.playPower, card);
                        $scope.zones.playPower.cards.push(card);
                    } else {
                        removeCardFromOtherZones($scope.zones.playHero, card);
                        $scope.zones.playHero.cards.push(card);
                    }
                }
                $scope.$apply();
            });

            logWatcher.start();


            function removeCardFromOtherZones(currentZone, card) {
                _.each($scope.zones, function(zone) {
                    if (zone.name !== currentZone.name) {
                        _.each(zone.cards, function(cardInZone, index, cards) {
                            if (cardInZone && cardInZone.id === card.id && cardInZone.entityId === card.entityId) {
                                cards.splice(index, 1);
                                return;
                            }
                        });
                    }
                });
            }
        }
    ]);
