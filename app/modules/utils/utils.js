angular.module('hstracker.utils', [])

  .service('Cards', [

      function() {
          var cards = {};

          this.setup = function() {
              var allSets = require('../app/data/all-sets');

              _.each(allSets, function(set) {
                  _.each(set, function(card) {
                      cards[card.id] = {
                          cost: card.cost,
                          name: card.name,
                          collectible: card.collectible
                      };
                  });
              });
          };

          this.getCard = function(cardId) {
              return cards[cardId];
          };

          this.getCardId = function(cardName) {
              var id = null;

              _.find(cards, function(card, cardId) {
                  if (card.name === cardName && card.collectible) {
                      id = cardId;
                      return card;
                  }
              });

              return id;
          };
      }
  ]);
