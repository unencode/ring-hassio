//Far majority of this code by Dgreif https://github.com/dgreif/ring/examples/browser_example.ts

import 'dotenv/config'
import { RingApi } from 'ring-client-api'
import { promisify } from 'util'
const fs = require('fs'),
  path = require('path'),
  http = require('http'),
  url = require('url'),
  zlib = require('zlib')  

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

//var response = snapshot.Read();
var text = await camera.getSnapshot()

fs.writefile("lastSnapShot.jpg", text);


}






if(!('RING_REFRESH_TOKEN' in process.env) || !('RING_PORT' in process.env) || !('CAMERA_NAME' in process.env)) {
  console.log('Missing environment variables. Check RING_REFRESH_TOKEN, RING_PORT and CAMERA_NAME are set.')
  process.exit()
}
else {
  startUp()
}





