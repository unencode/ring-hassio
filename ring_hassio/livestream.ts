//Far majority of this code by Dgreif https://github.com/dgreif/ring/examples/browser_example.ts

import 'dotenv/config'
import { RingApi } from 'ring-client-api'
import { promisify } from 'util'
const fs = require('fs'),
  path = require('path'),
  http = require('http'),
  url = require('url'),
  zlib = require('zlib')
  var express = require('express');
  var app = express();

const PORT = process.env.RING_PORT;
//
const CAMERA_NAME = process.env.CAMERA_NAME;
var chosenCamera = CAMERA_NAME;
/**
 * This example creates an hls stream which is viewable in a browser
 * It also starts web app to view the stream at http://localhost:PORT
 **/


async function startUp(){
//
console.log('STARTING UP...');
const ringApi = new RingApi({
  // Refresh token is used when 2fa is on
  refreshToken: process.env.RING_REFRESH_TOKEN!
 // debug: true
})


async function getCamera() {
  var cameras = await ringApi.getCameras();
  var camera;
  //
  if (chosenCamera) {
    for (var i=0; i < cameras.length; i++) {
      var cameraName = cameras[i].name;
      console.log(`Checking If ${cameraName} Is the same as the camera we are looking for (${chosenCamera})`);
      if (chosenCamera == cameraName) {
        camera = cameras[i];
        console.log(`Matched ${cameraName}`);
      } 
    }
  } else {
    camera = cameras[0]
  }
  //
  if (!cameras) {
    console.log('No cameras found')
    return
  }
  //
  return camera
}
///////////////
var camera = await getCamera()
///////////////

console.log('Getting Snapshot...');
//var snapshot = camera.getSnapshot() // returns a Promise<Buffer> of the latest snapshot from the camera
//console.log('SNAPSHOT CONTAINS:' + snapshot);



try {
  const snapshotBuffer = await camera.getSnapshot(()=>  fs.writeFile("/data/lastSnapShot.jpg", snapshotBuffer));
 
} catch (e) {
  // failed to get a snapshot.  handle the error however you please
  console.log("Attempting to save snapshot failed with " + e);
}




var server = http.createServer(function (req, res) {
  // Get URL
  var uri = url.parse(req.url).pathname;
  console.log('requested uri: '+uri)
  // If Accessing The Main Page
  if (uri == '/index.html' || uri == '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write('<html><head><title>Ring Livestream</title></head><body>');
    res.write('<h1>Welcome to your Ring Livestream!</h1>');
    res.write(`<video width="352" height="198" controls autoplay src="public/stream.m3u8"></video>`);
    res.write(`<br/>If you cannot see the video above open <a href="public/stream.m3u8">the stream</a> in a player such as VLC.`);
    res.end();
    return;
  }

  
  var dir = path.join(__dirname, 'public');

  var mime = {
      html: 'text/html',
      txt: 'text/plain',
      css: 'text/css',
      gif: 'image/gif',
      jpg: 'image/jpeg',
      png: 'image/png',
      svg: 'image/svg+xml',
      js: 'application/javascript'
  };
  
  app.get('*', function (req, res) {
      var file = path.join(dir, req.path.replace(/\/$/, '/index.html'));
      if (file.indexOf(dir + path.sep) !== 0) {
          return res.status(403).end('Forbidden');
      }
      var type = mime[path.extname(file).slice(1)] || 'text/plain';
      var s = fs.createReadStream(file);
      s.on('open', function () {
          res.set('Content-Type', type);
          s.pipe(res);
      });
      s.on('error', function () {
          res.set('Content-Type', 'text/plain');
          res.status(404).end('Not found');
      });
  });

  //app.listen(3000, function () {
   // console.log('Listening on http://localhost:3000/');
//});
console.log('Listening on port: ' + PORT);
}).listen(PORT);

}



if(!('RING_REFRESH_TOKEN' in process.env) || !('RING_PORT' in process.env) || !('CAMERA_NAME' in process.env)) {
  console.log('Missing environment variables. Check RING_REFRESH_TOKEN, RING_PORT and CAMERA_NAME are set.')
  process.exit()
}
else {
  startUp()
}