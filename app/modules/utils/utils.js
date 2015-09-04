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

    .service('LogWatcher', [

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
                path = require('path'),
                logFilePath = path.join(process.env.HOME, 'Library', 'Logs', 'Unity', 'Player.log'),
                players = [];


            this.start = function() {
                var fileSize = fs.statSync(logFilePath).size;

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
                    });
                });
            };

            this.stop = function() {
                fs.unwatchFile(logFilePath);
            };

            function parseLine(line) {
                var playerRegex=/Entity=(.*) tag=TEAM_ID value=(\d*)/,
                    gameOverRegex = /Entity=GameEntity tag=STATE value=COMPLETE$/,
                    zoneChangeRegex = /name=(.*) id=(\d+).*cardId=(.*) .* to (FRIENDLY|OPPOSING) (.*)$/,
                    parts = [];

                if (playerRegex.test(line) && players.length < 2) {
                    parts = playerRegex.exec(line);
                    players.push({
                        name: parts[1],
                        teamId: parts [2]
                    });

                    if (players.length === 2) {
                        $rootScope.$broadcast(GameStartEvent, players);
                    }
                } else if (zoneChangeRegex.test(line)) {
                    parts = zoneChangeRegex.exec(line);
                    $rootScope.$broadcast(ZoneChangeEvent, {
                        name: parts[1],
                        entityId: parts[2],
                        id: parts[3],
                        team: parts[4],
                        zone: parts[5]
                    });
                } else if (gameOverRegex.test(line)) {
                    players = [];
                    $rootScope.$broadcast(GameOverEvent);
                }
            }
        }
    ]);
