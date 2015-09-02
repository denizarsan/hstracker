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
    ])

    .constant('GameOverEvent', 'Game Over')
    .constant('GameStartEvent', 'Game Start')
    .constant('ZoneChangeEvent', 'Zone Change')

    .service('ngLogWatcher', [

        '$rootScope',
        'GameOverEvent',
        'GameStartEvent',
        'ZoneChangeEvent',


        function($rootScope,
                 GameOverEvent,
                 GameStartEvent,
                 ZoneChangeEvent) {

            var fs = require('fs'),
                os = require('os'),
                path = require('path');


            this.start = function() {
                var logFilePath = path.join(process.env.HOME, 'Library', 'Logs', 'Unity', 'Player.log'),
                    fileSize = fs.statSync(logFilePath).size;

                fs.watchFile(logFilePath, function(current, previous) {
                    var newFileSize = fs.statSync(logFilePath).size,
                        sizeDiff = newFileSize - fileSize,
                        fileDescriptor = fs.openSync(logFilePath, 'r'),
                        buffer;

                    if (current.mtime <= previous.mtime) { return; }

                    if (sizeDiff < 0) {
                        fileSize = 0;
                        sizeDiff = newFileSize;
                    }

                    buffer = new Buffer(sizeDiff);
                    fs.readSync(fileDescriptor, buffer, 0, sizeDiff, fileSize);
                    fs.closeSync(fileDescriptor);
                    fileSize = newFileSize;

                    _.each(buffer.toString().split(os.EOL), function(line) {
                        parseLine(line);
                    })
                });
            };

            this.stop = function() {
                // Stop watching the log file
            };

            function parseLine(line) {
                var gameOverRegex = /Entity=GameEntity tag=STATE value=COMPLETE$/,
                    gameStartRegex = /Entity=(.*) tag=TEAM_ID value=(.)$/,
                    zoneChangeRegex = /name=(.*) id=(\d+).*cardId=(.*) .* to (FRIENDLY|OPPOSING) (.*)$/;

                if (gameOverRegex.test(line)) {
                    $rootScope.$broadcast(GameOverEvent);
                } else if (gameStartRegex.test(line)) {
                    $rootScope.$broadcast(GameStartEvent);
                } else if (zoneChangeRegex.test(line)) {
                    $rootScope.$broadcast(ZoneChangeEvent);
                }
            }
        }
    ]);
