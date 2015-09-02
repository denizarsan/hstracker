angular.module('hstracker.deck-tracker', [])

    .constant('DeckTrackerTitleHeight', 35)

    .controller('DeckTrackerController', [

        '$scope',
        '$state',
        '$stateParams',
        '$window',
        'Cards',
        'DeckTrackerTitleHeight',
        'GameOverEvent',
        'GameStartEvent',
        'ngLogWatcher',
        'ZoneChangeEvent',

        function($scope,
                 $state,
                 $stateParams,
                 $window,
                 Cards,
                 DeckTrackerTitleHeight,
                 GameOverEvent,
                 GameStartEvent,
                 ngLogWatcher,
                 ZoneChangeEvent) {

            var LogWatcher = require('hearthstone-log-watcher');

            $scope.init = function() {
                var logWatcher = new LogWatcher(),
                    Window = require('nw.gui').Window.get(),
                    deck = require('../app/data/decks/' + $stateParams.deckName.toLowerCase() + '.json'),
                    knownEntityIds = [];


                // Resize window to display the whole deck
                Window.height = Object.keys(deck.cards).length * 40 +
                                DeckTrackerTitleHeight +
                                Window.window.outerHeight - Window.window.innerHeight;

                // Deck
                $scope.title = deck.name;
                $scope.deckClass = deck.deckClass;
                $scope.deck = [];
                $scope.play = [];
                $scope.hand = [];
                $scope.graveyard = [];

                // Zones
                $scope.displayDeck = [];
                $scope.playZone = [];
                $scope.handZone = [];
                $scope.graveyardZone = [];

                _.each(deck.cards, function(cardQuantity, cardId) {
                    for (var i = 0; i < cardQuantity; i++) {
                        $scope.deck.push({
                            name: Cards.getCard(cardId).name,
                            cost: Cards.getCard(cardId).cost,
                            id: cardId,
                            entityId: null
                        });
                    }

                    $scope.displayDeck.push({
                        name: Cards.getCard(cardId).name,
                        cost: Cards.getCard(cardId).cost,
                        id: cardId,
                        qty: cardQuantity
                    });
                });

                $scope.$on('Card Removed from Deck', function(event, card) {
                    _.find($scope.displayDeck, function(deckCard) {
                        if (card.id === deckCard.id && deckCard.qty > 0) {
                            deckCard.qty--;
                            return deckCard;
                        }
                    });
                });

                $scope.$on('Card Added to Deck', function(event, card) {
                    _.find($scope.displayDeck, function(deckCard) {
                        if (card.id === deckCard.id) {
                            deckCard.qty++;
                            return deckCard;
                        }
                    });
                });

                ngLogWatcher.start();

                $scope.$on(GameOverEvent, function() {
                    console.log('Game Over');
                })

                $scope.$on(GameStartEvent, function() {
                    console.log('Game Start');
                })

                $scope.$on(ZoneChangeEvent, function() {
                    console.log('Zone Change');
                })

                logWatcher.on('zone-change', function(data) {
                    var currentCard = {
                        id: data.cardId,
                        entityId: data.entityId
                    };

                    if (data.zone === 'SECRET' ||
                        data.zone === 'PLAY (Weapon)' ||
                        data.zone === 'PLAY (Hero)' ||
                        data.zone === 'PLAY (Hero Power)') {
                        data.zone = 'PLAY';
                    }

                    if (data.team === 'FRIENDLY') {
                        if (data.zone === 'DECK') {
                            $scope.deck.push(removeAndGetCard(currentCard, 'DECK'));
                            knownEntityIds.push(currentCard.entityId);
                            $scope.$emit('Card Added to Deck', currentCard);
                        } else if (data.zone === 'HAND') {
                            $scope.hand.push(removeAndGetCard(currentCard, 'HAND'));
                        } else if (data.zone === 'PLAY') {
                            $scope.play.push(removeAndGetCard(currentCard, 'PLAY'));
                        } else if (data.zone === 'GRAVEYARD') {
                            $scope.graveyard.push(removeAndGetCard(currentCard, 'GRAVEYARD'));
                        }

                        $scope.$apply();
                    }

                    function removeAndGetCard(cardToRemove, currentZone) {
                        var zones = ['hand', 'play', 'graveyard', 'deck'],
                            currentCard = cardToRemove,
                            removed = false;

                        zones = _.without(zones, currentZone.toLowerCase());

                        _.each(zones, function(zone) {
                            if (!removed) {
                                _.each($scope[zone], function(zoneCard, index, currentZone) {
                                    if (zone === 'deck' && zoneCard && zoneCard.id === cardToRemove.id) {
                                        if (zoneCard && zoneCard.entityId === null &&
                                            !_.contains(knownEntityIds, cardToRemove.entityId)) {
                                            zoneCard.entityId = cardToRemove.entityId;
                                        }
                                        if (zoneCard &&  zoneCard.entityId === cardToRemove.entityId) {
                                            currentCard = zoneCard;
                                            currentZone.splice(index, 1);
                                            removed = true;
                                            $scope.$emit('Card Removed from Deck', cardToRemove);
                                        }
                                    } else if (zoneCard && zoneCard.id === cardToRemove.id) {
                                        if (zoneCard && zoneCard.entityId === cardToRemove.entityId) {
                                            currentCard = zoneCard;
                                            currentZone.splice(index, 1);
                                            removed = true;
                                        }
                                    }
                                });
                            }
                        });
                        return currentCard;
                    }
                });

                // logWatcher.on('game-over', function() {
                //     $window.location.reload();
                // });

                logWatcher.start();

            };

            $scope.isInHand = function(card) {
                if ($scope.hand.length > 0) {
                    return _.some($scope.hand, function(cardInHand) {
                        return card.id === cardInHand.id;
                    });
                }
            };

            $scope.back = function() {
                $window.history.back(-1);
            };

            $scope.home = function() {
                $state.go('home');
            };

            $scope.init();
        }
    ]);
