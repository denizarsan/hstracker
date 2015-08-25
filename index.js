var LogWatcher = require('hearthstone-log-watcher'),
    _ = require('underscore'),
    logWatcher = new LogWatcher(),
    zones = {
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
    },
    removeCardFromOtherZones = function(currentZone, card) {
        _.each(zones, function(zone) {
            if (zone.name !== currentZone.name) {
                _.each(zone.cards, function(cardInZone, index, cards) {
                    if (cardInZone && cardInZone.id === card.id && cardInZone.entityId === card.entityId) {
                        cards.splice(index, 1);
                        return;
                    }
                });
            }
        });
    };

logWatcher.on('zone-change', function(data) {
    var card = {
        name: data.cardName,
        entityId: data.entityId,
        id: data.cardId
    };

    if (data.team === 'FRIENDLY') {
        if (data.zone === 'HAND') {
            removeCardFromOtherZones(zones.hand, card);
            zones.hand.cards.push(card);
        } else if (data.zone === 'PLAY'){
            removeCardFromOtherZones(zones.play, card);
            zones.play.cards.push(card);
        } else if (data.zone === 'GRAVEYARD'){
            removeCardFromOtherZones(zones.graveyard, card);
            zones.graveyard.cards.push(card);
        } else if (data.zone === 'DECK'){
            removeCardFromOtherZones(zones.deck, card);
            zones.deck.cards.push(card);
        } else if (data.zone === 'SECRET'){
            removeCardFromOtherZones(zones.secret, card);
            zones.secret.cards.push(card);
        } else if (data.zone === 'PLAY (Weapon)'){
            removeCardFromOtherZones(zones.playWeapon, card);
            zones.playWeapon.cards.push(card);
        } else if (data.zone === 'PLAY (Hero Power)'){
            removeCardFromOtherZones(zones.playPower, card);
            zones.playPower.cards.push(card);
        } else {
            removeCardFromOtherZones(zones.playHero, card);
            zones.playHero.cards.push(card);
        }
    }

    // console.log(zones.hand);
    // console.log(zones.play);
    // console.log(zones.graveyard);
    // console.log(zones.deck);
    // console.log(zones.secret);
    // console.log(zones.playWeapon);
    // console.log(zones.playPower);
    // console.log(zones.playHero);
    console.log(data.cardName + ' has moved to ' + data.team + ' ' + data.zone);
});

logWatcher.start();
