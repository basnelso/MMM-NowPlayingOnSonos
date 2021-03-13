'use strict';

const NodeHelper = require('node_helper');
var request = require('request');


module.exports = NodeHelper.create({

  start: function () {
    console.log('Starting node_helper for module [' + this.name + ']');
  },

  getSongData: function (url) {
    var self = this;
    request(url, {method: 'GET'}, function(err, res, body) {
        if ((err) || (res.statusCode !== 200)) {
            console.log("MMM-NowPlayingOnSonos: GET request failed.")
        } else {
            var data = JSON.parse(body);
            self.sendSongData(data);
        }
    });
  },

  sendSongData: function (data) {
    let songPayload = this.processSonosData(data);
    this.sendSocketNotification('RETRIEVED_SONG_DATA', songPayload);
  },

  processSonosData: function (data) {
    for (var i in data) {
      var group = data[i];
      var members = group.members;
      for (var j in members) {
          var member = members[j];
          var state = member.state;
          if (state.playbackState == "PLAYING") {
            var track = state.currentTrack;
            var songPayload = {
              imgURL: "http://10.0.0.15:1400" + track.albumArtUri,
              songTitle: track.title,
              artist: track.artist,
              album: track.album,
              titleLength: track.duration,
              progress: state.elapsedTime,
              isPlaying: true,
              deviceName: member.roomName,
              timeout: 0
            }
            return songPayload;
          }
      }
    }

    return null;
  },
    
  getArtistName: function (artists) {
    return artists.map((artist) => {
      return artist.name;
    }).join(', ');
  },

  getImgURL(images) {
    let filtered = images.filter((image) => {
      return image.width >= 240 && image.width <= 350;
    });

    return filtered[0].url;
  },
  
  socketNotificationReceived: function (notification, payload) {
    if (notification == 'UPDATE_CURRENT_SONG') {
      this.getSongData(payload);
    }
  },
});
