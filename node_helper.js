'use strict';

const NodeHelper = require('node_helper');
const SpotifyConnector = require('./core/SpotifyConnector');


module.exports = NodeHelper.create({

  start: function () {
    this.connector = undefined;
  },


  socketNotificationReceived: function (notification, payload) {
      if (notification == 'UPDATE_CURRENT_SONG') {
        this.retrieveCurrentSong();
      }
  },


  retrieveCurrentSong: function () {
    this.connector.retrieveCurrentlyPlaying()
      .then((response) => {
        if (response) {
          this.sendRetrievedNotification(response);
        } else {
          this.sendRetrievedNotification({ noSong: true });
        }
      })
      .catch((error) => {
        console.error('Can’t retrieve current song. Reason: ');
        console.error(error);
      });
  },


  sendRetrievedNotification: function (songInfo) {
    let payload = songInfo;

    if (!songInfo.noSong) {
      // Need to get all this stuff from sonos instead of spotify
      payload = {
        imgURL: this.getImgURL(songInfo.item.album.images),
        songTitle: songInfo.item.name,
        artist: this.getArtistName(songInfo.item.artists),
        album: songInfo.item.album.name,
        titleLength: songInfo.item.duration_ms,
        progress: songInfo.progress_ms,
        isPlaying: songInfo.isPlaying,
        deviceName: songInfo.device.name
      };
    }

    this.sendSocketNotification('RETRIEVED_SONG_DATA', payload);
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
  }
});
