'use strict';

Module.register('MMM-NowPlayingOnSonos', {

  defaults: {
    name: 'MMM-NowPlayingOnSonos',
    hidden: false,

    updateInterval: 1,          // How often should the table be updated in s?
    showCoverArt: true,       // Do you want the cover art to be displayed?
    serverIP: "http://localhost:5005",

    updateExternally: false,
    broadcastStatus: true,

    timeout: 1 * 60
  },


  start: function () {
    Log.info('Starting module: ' + this.name );

    this.initialized = false;
    this.context = {};

    this.getZoneData();
    if (!this.updateExternally) {
      this.scheduleUpdates();
    }
  },

  getDom: function () {
    let domBuilder = new NPOS_DomBuilder(this.config, this.file(''));

    if (this.initialized) {
      return domBuilder.getDom(this.context);
    } else {
      return domBuilder.getInitDom(this.translate('LOADING'));
    }
  },

  getStyles: function () {
    return [
      this.file('css/styles.css'),
      this.file('node_modules/moment-duration-format/lib/moment-duration-format.js'),
      'font-awesome.css'
    ];
  },

  getScripts: function () {
    return [
      this.file('core/NPOS_DomBuilder.js'),
      'moment.js'
    ];
  },

  processZoneData: function(data) {
    let track = this.createTrackObject(data);

    if (track != null) { // Song is currently playing
      this.initialized = true;
      this.context = track;
      this.updateDom();
    } else if (this.context.timeout > this.config.timeout) { // Song is paused, so check timeout to clear it if it exceed 10 min
      this.context = {"noSong": true};
      this.updateDom();
    } else if (this.context != {}) { // Song is paused but hasn't timed out yet
      if (this.context.isPlaying) {
        this.context.isPlaying = false;
        this.updateDom();
      }
      this.context.timeout += 1; // Increment timeout
    }
  },

  createTrackObject: function (data) {
    for (var i in data) {
      var group = data[i];
      var members = group.members;
      for (var j in members) {
          var member = members[j];
          var state = member.state;
          if (state.playbackState == "PLAYING") {
            var track = state.currentTrack;
            var songPayload = {
              imgURL: track.absoluteAlbumArtUri,
              songTitle: track.title,
              artist: track.artist,
              album: track.album,
              titleLength: track.duration,
              progress: state.elapsedTime,
              isPlaying: true,
              deviceName: member.roomName,
              timeout: 0
            }
            console.log('track is:', track)
            console.log('the image url is:', track.absoluteAlbumArtUri);
            return songPayload;
          }
      }
    }

    return null;
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification == 'SONOS_ZONE_DATA') {
      if (this.config.broadcastStatus) {
        this.sendNotification("SONOS_ZONE_DATA", payload);
      }

      this.processZoneData(payload);
    }
  },

  notificationReceived: function(notification, payload) {
    if (this.config.updateExternally) {
        if (notification == "SONOS_ZONE_DATA") {
          this.processZoneData(payload);
        }
    }
  },

  getZoneData: function() {
    var url = this.config.serverIP + "/zones";
    this.sendSocketNotification('GET_ZONE_DATA', url);
  },

  scheduleUpdates: function() {
    // Update current song every x seconds
    var self = this;
    setInterval(() => {
      self.getZoneData();
    }, this.config.updateInterval * 1000);
  }
});
