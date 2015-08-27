angular.module('hstracker.utils')

    .service('Cards', [

        function() {
            var cards = {};

            this.setup = function() {
                var allSets = require('../app/data/all-sets');

                var max = 0;
                var maxCard = null;

                _.each(allSets, function(set) {
                    _.each(set, function(card) {
                        cards[card.id] = {
                            cost: card.cost,
                            name: card.name
                        }
                    });
                });
            };

            this.getCard = function(cardId) {
                return cards[cardId];
            };
        }
    ]);