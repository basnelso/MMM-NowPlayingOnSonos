'use strict';

Module.register('MMM-NowPlayingOnSonos', {

  defaults: {
    name: 'MMM-NowPlayingOnSonos',
    hidden: false,

    updatesEvery: 1,          // How often should the table be updated in s?
    showCoverArt: true,       // Do you want the cover art to be displayed?
    serverIP: "http://localhost:5005"
  },


  start: function () {
    Log.info('Starting module: ' + this.name );

    this.initialized = false;
    this.context = {};

    this.startFetchingLoop();
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

  socketNotificationReceived: function (notification, payload) {
    switch (notification) {
      case 'RETRIEVED_SONG_DATA':
        if (payload != null) {
          this.initialized = true;
          this.context = payload;
          this.updateDom();
        } else if (this.context.timeout > 60 * 10) { // 10 min
          console.log("song timed out");
          this.context = {"noSong": true};
          this.updateDom();
        } else if (this.context != {}) {
          console.log("song stopped playing");
          if (this.context.isPlaying) {
            this.context.isPlaying = false;
            this.updateDom();
          }
          this.context.timeout += 1;
        }
    }
  },

  startFetchingLoop() {
    // Update current song every x seconds
    var self = this;
    setInterval(() => {
      var url = self.config.serverIP + "/zones";
      this.sendSocketNotification('UPDATE_CURRENT_SONG', url);
    }, this.config.updatesEvery * 1000);
  }
});
