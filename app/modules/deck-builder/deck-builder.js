angular.module('hstracker.deck-builder', [])

    .controller('BuildController', [

        '$scope',

        function($scope) {
            $scope.message = 'Coming Soon!';
        }
    ])

    .controller('ImportController', [

        '$scope',
        '$state',
        'Cards',

        function($scope,
                 $state,
                 Cards) {

            var fs = require('fs'),
                jsonfile = require('jsonfile');

            $scope.importDeck = function() {
                var deckFile = fs.readFileSync($scope.fileInput.path),
                    jsonFile = 'app/data/decks/' + $scope.deckName.toLowerCase() + '.json',
                    deckObject = { name: $scope.deckName, deckClass: $scope.deckClass, cards: {} },
                    rest = deckFile.toString(),
                    newLineIndex = rest.indexOf('\n'),
                    currentLine = '',
                    qty = 0,
                    name = '';

                while (newLineIndex > -1) {
                    currentLine = rest.substring(0, newLineIndex);
                    qty = currentLine.substring(0, currentLine.indexOf(' '));
                    name = currentLine.substring(currentLine.indexOf(' ') + 1);
                    rest = rest.substring(newLineIndex + 1);
                    deckObject.cards[Cards.getCardId(name)] = qty;
                    newLineIndex = rest.indexOf('\n');
                }

                jsonfile.writeFileSync(jsonFile, deckObject);

                $state.go('deck-tracker', { deckName: deckObject.name });
            };
        }
    ])

    .directive('inputFile', [

        '$parse',

        function ($parse) {

            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    var model, modelSetter;

                    model = $parse(attrs.inputFile);
                    modelSetter = model.assign;

                    element.bind('change', function(){
                        scope.$apply(function(){
                            if (attrs.multiple) {
                                modelSetter(scope, element[0].files);
                            }
                            else {
                                modelSetter(scope, element[0].files[0]);
                            }
                        });
                    });
                }
            };
        }
    ]);
