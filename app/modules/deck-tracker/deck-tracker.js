angular.module('hstracker.deck-tracker', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/deck-tracker', {
            templateUrl: 'modules/deck-tracker/deck-tracker.html',
            controller: 'DeckTrackerController'
        });
    }])

    .controller('DeckTrackerController', [

        '$scope',
        'Cards',

        function($scope,
                 Cards) {

            var LogWatcher,
                logWatcher,
                deck,
                knownEntityIds;

            $scope.init = function() {
                LogWatcher = require('hearthstone-log-watcher');
                logWatcher = new LogWatcher();
                deck = require('../app/data/decks/zoolock'),
                knownEntityIds = [];

                // Deck
                $scope.title = deck.name;
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

                logWatcher.start();
            };

            $scope.isInHand = function(card) {
                if ($scope.hand.length > 0) {
                    return _.some($scope.hand, function(cardInHand) {
                        return card.id === cardInHand.id;
                    });
                }
            };

            $scope.init();
        }
    ]);
