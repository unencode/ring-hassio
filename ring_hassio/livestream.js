"use strict";
//Far majority of this code by Dgreif https://github.com/dgreif/ring/examples/browser_example.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
require("dotenv/config");
var ring_client_api_1 = require("ring-client-api");
var fs = require('fs'), path = require('path'), http = require('http'), url = require('url'), zlib = require('zlib');
var PORT = process.env.RING_PORT;
//
var CAMERA_NAME = process.env.CAMERA_NAME;
var chosenCamera = CAMERA_NAME;
/**
 * This example creates an hls stream which is viewable in a browser
 * It also starts web app to view the stream at http://localhost:PORT
 **/
function startUp() {
    return __awaiter(this, void 0, void 0, function () {
        function getCamera() {
            return __awaiter(this, void 0, void 0, function () {
                var cameras, camera, i, cameraName;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, ringApi.getCameras()];
                        case 1:
                            cameras = _a.sent();
                            //
                            if (chosenCamera) {
                                for (i = 0; i < cameras.length; i++) {
                                    cameraName = cameras[i].name;
                                    console.log("Checking If " + cameraName + " Is the same as the camera we are looking for (" + chosenCamera + ")");
                                    if (chosenCamera == cameraName) {
                                        camera = cameras[i];
                                        console.log("Matched " + cameraName);
                                    }
                                }
                            }
                            else {
                                camera = cameras[0];
                            }
                            //
                            if (!cameras) {
                                console.log('No cameras found');
                                return [2 /*return*/];
                            }
                            //
                            return [2 /*return*/, camera];
                    }
                });
            });
        }
        var ringApi, camera, snapshotBuffer, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    //
                    console.log('STARTING UP...');
                    ringApi = new ring_client_api_1.RingApi({
                        // Refresh token is used when 2fa is on
                        refreshToken: process.env.RING_REFRESH_TOKEN
                        // debug: true
                    });
                    return [4 /*yield*/, getCamera()
                        ///////////////
                    ];
                case 1:
                    camera = _a.sent();
                    ///////////////
                    console.log('Getting Snapshot...');
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, camera.getSnapshot()];
                case 3:
                    snapshotBuffer = _a.sent();
                    fs.writeFile("lastSnapShot.jpg", snapshotBuffer);
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    // failed to get a snapshot.  handle the error however you please
                    console.log("Attempting to save snapshot failed with " + e_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
if (!('RING_REFRESH_TOKEN' in process.env) || !('RING_PORT' in process.env) || !('CAMERA_NAME' in process.env)) {
    console.log('Missing environment variables. Check RING_REFRESH_TOKEN, RING_PORT and CAMERA_NAME are set.');
    process.exit();
}
else {
    startUp();
}
