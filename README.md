# MMM-NowPlayingOnSpotify
A module for the [MagicMirror](https://github.com/MichMich/MagicMirror) project by [Michael Teeuw](https://github.com/MichMich) displaying the song currently playing on Spotify.


[![Maintainability](https://api.codeclimate.com/v1/badges/2742abc792b88536f6e2/maintainability)](https://codeclimate.com/github/raywo/MMM-NowPlayingOnSpotify/maintainability) 
[![Test Coverage](https://api.codeclimate.com/v1/badges/2742abc792b88536f6e2/test_coverage)](https://codeclimate.com/github/raywo/MMM-NowPlayingOnSpotify/test_coverage)
[![Known Vulnerabilities](https://snyk.io/test/github/raywo/mmm-NowPlayingOnSpotify/badge.svg?targetFile=package.json)](https://snyk.io/test/github/raywo/mmm-NowPlayingOnSpotify?targetFile=package.json)
[![Greenkeeper badge](https://badges.greenkeeper.io/raywo/MMM-NowPlayingOnSpotify.svg)](https://greenkeeper.io/)
[![dependency status](https://david-dm.org/raywo/MMM-NowPlayingOnSpotify.svg)](https://david-dm.org/raywo/MMM-NowPlayingOnSpotify)
[![chat on gitter](https://badges.gitter.im/raywo.svg)](https://gitter.im/raywo)


## How it works
After installing the module and configuring and setting up the Spotify app the module displays the song you are currently listening to on Spotify. It shows on which of your devices you’re playing the song. If you like you can also display the album cover.

To be able to display your currently playing song the module must connect to the Spotify service and query your private data. For obvious reasons this is not possible for arbitrary apps – or for that matter MagicMirror modules. There are third party solutions which will enable access to your Spotify data. This module is designed to be independent from third party services. Everything you need is in this module respectively is created by yourself.

## Screenshots
![Screenshot of a song playing with cover art](img/readme/screenshot_with_coverart.png)

## Preconditions

* MagicMirror<sup>2</sup> instance
* Node.js version >= 7
* npm


## Installing

### Step 1 – Install the module

In your MagicMirror directory: 

```bash
cd modules
git clone https://github.com/raywo/MMM-NowPlayingOnSpotify.git
cd MMM-NowPlayingOnSpotify
npm install
```

### Step 2 – Download, install, and run node-sonos-http-api
In order for this module to connect to your local sonos system, you need to install the node-sonos-http-api program and get it to host on your local network.

In your home directory:

```bash
cd ~/
git clone https://github.com/jishi/node-sonos-http-api.git
cd node-sonos-http-api
npm install

pm2 start npm -- start
pm2 save

cd 
```

When the node-sonos-http-api app is running you can access it by opening `localhost:5005` in your browser. Provided you are doing this directly on your Raspberry Pi.


## Updating

Go to the module’s folder inside MagicMirror modules folder and pull the latest version from GitHub and install:

```bash
git pull
npm install
```


## Configuring

| Option | Description |
|--------|-------------|
| `updatesEvery` | <p>An integer determining the interval for display updates.</p><p>**Type:** `integer` **OPTIONAL**<br>**Example:** `5`<br>**Default Value:** `1`</p><p>**Note:** With the default setting the display is updated every second. So when you skip to the next song it is virtually immediately visible. Also the progress bar runs smoothly. If you increase the value you may relieve the strain on your Raspberry’s processor but your display will not be as up-to-date. </p> |
| `serverIP` | <p>A string representing the local adress that node-sonos-http-api is hosted on.</p><p>**Type:** `string` **OPTIONAL**<br>**Example:** `"http://localhost:1001"`<br>**Default Value:** `"http://localhost:5005"`</p><p>**Note:** If you just run node-sonos-http-api normally you should not have to change this value. </p> |

Here is an example for an entry in `config.js`

```javascript
{
    module: "MMM-NowPlayingOnSonos",
    position: "top_right", // Can be any valid position
}
```

