'use strict';

const NodeHelper = require('node_helper');
var request = require('request');


module.exports = NodeHelper.create({

  start: function () {
    console.log('Starting node_helper for module [' + this.name + ']');
  },

  getZoneData: function (url) {
    var self = this;
    request(url, {method: 'GET'}, function(err, res, body) {
        if ((err) || (res.statusCode !== 200)) {
            console.log("MMM-NowPlayingOnSonos: GET request failed.")
        } else {
            var data = JSON.parse(body);
            self.sendSocketNotification('SONOS_ZONE_DATA', data);
        }
    });
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification == 'GET_ZONE_DATA') {
      this.getZoneData(payload);
    }
  },
});
