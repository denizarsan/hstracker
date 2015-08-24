var LogWatcher = require('hearthstone-log-watcher');
var logWatcher = new LogWatcher();

logWatcher.on('zone-change', function (data) {
  console.log(data.cardName + ' has moved to ' + data.team + ' ' + data.zone);
});

logWatcher.start();
