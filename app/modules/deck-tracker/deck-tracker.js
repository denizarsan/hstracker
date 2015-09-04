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
        'LogWatcher',
        'ZoneChangeEvent',

        function($scope,
                 $state,
                 $stateParams,
                 $window,
                 Cards,
                 DeckTrackerTitleHeight,
                 GameOverEvent,
                 GameStartEvent,
                 LogWatcher,
                 ZoneChangeEvent) {

            $scope.init = function() {
                var Window = require('nw.gui').Window.get(),
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

                LogWatcher.start();


                $scope.$on(ZoneChangeEvent, function($event, card) {
                    var currentCard = {
                        id: card.id,
                        entityId: card.entityId
                    };

                    if (card.zone === 'SECRET' ||
                        card.zone === 'PLAY (Weapon)' ||
                        card.zone === 'PLAY (Hero)' ||
                        card.zone === 'PLAY (Hero Power)') {
                        card.zone = 'PLAY';
                    }

                    if (card.team === 'FRIENDLY') {
                        if (card.zone === 'DECK') {
                            $scope.deck.push(removeAndGetCard(currentCard, 'DECK'));
                            knownEntityIds.push(currentCard.entityId);
                            $scope.$emit('Card Added to Deck', currentCard);
                        } else if (card.zone === 'HAND') {
                            $scope.hand.push(removeAndGetCard(currentCard, 'HAND'));
                        } else if (card.zone === 'PLAY') {
                            $scope.play.push(removeAndGetCard(currentCard, 'PLAY'));
                        } else if (card.zone === 'GRAVEYARD') {
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

                $scope.$on(GameOverEvent, function() {
                    $window.location.reload();
                });
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
