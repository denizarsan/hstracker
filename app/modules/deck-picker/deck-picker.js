angular.module('hstracker.deck-picker', [])

    .controller('DeckPickerController', [

        '$scope',

        function($scope) {
            var fs = require('fs'),
                jsonfile = require('jsonfile');

            $scope.decks = [];

            _.each(fs.readdirSync('app/data/decks'), function(file) {
                var extension = file.substring(file.lastIndexOf('.') + 1),
                    deck = {};

                if (extension.toLowerCase() === 'json') {
                    deck = jsonfile.readFileSync('app/data/decks/' + file);
                    $scope.decks.push({
                        name: deck.name,
                        deckClass: deck.deckClass
                    });
                }
            });

            $scope.deleteDeck = function($event, deck) {
                var fileName = deck.name + '.json',
                    filePath = 'app/data/decks/' + fileName;

                $event.stopPropagation();
                fs.unlinkSync(filePath);
                _.each($scope.decks, function(currentDeck, index, decks) {
                    if (currentDeck.name === deck.name &&
                        currentDeck.deckClass === deck.deckClass) {
                        decks.splice(index, 1);
                    }
                });
            };
        }
    ]);
