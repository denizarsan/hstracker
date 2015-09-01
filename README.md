# Hearthstone Tracker

## Getting Started

Clone the repository

```
git clone https://github.com/denizarsan/hstracker.git
```

Install dependencies

```
cd hstracker
npm install
```

Run the project

```
npm start
```

## Features

### Import Decks
You can import a deck from a simple clean text file. Hearthstone Tracker will save it and you can use it repeatedly.
The accepted format for this text file is on each line, the quatity of the card followed by a single space and the name of
the card. Here is an example:

```
1 Acidic Swamp Ooze
2 Frostbolt
1 Archmage Antonidas
1 Mana Wyrm
1 Azure Drake
2 Harvest Golem
2 Snowchugger
2 Goblin Blastmage
2 Fireball
2 Clockwork Gnome
2 Annoy-o-Tron
2 Mechwarper
2 Cogmaster
1 Spider Tank
2 Tinkertown Technician
2 Piloted Shredder
1 Flamecannon
1 Dr. Boom
1 Loatheb
```

Note that you can use decks from HearthPwn directly by exporting any deck in the "Cockatrice" format.

### Track Your Decks
You can track your deck status with Hearthstone Tracker. To start, import new deck or choose a deck from the existing decks.
Start your game AFTER you do this to ensure no errors in tracking.

### Build Decks
Coming Soon!

## Screenshots
|![Home](http://i.imgur.com/TnIjAZW.png)|![Import](http://i.imgur.com/EZ2RGvU.png)|![Pick](http://i.imgur.com/16iMjvM.png)|![Track](http://i.imgur.com/gGyW4Hz.png)|
|---|---|---|---|

## License

```
Copyright (c) 2015 Deniz Arsan

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
```
