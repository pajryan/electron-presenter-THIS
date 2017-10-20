// Here is the starting point for your application code.

// Small helpers you might want to keep
import './helpers/context_menu.js';
import './helpers/external_links.js';
import getState from './helpers/getState.js';

// All stuff below is just to show you how it works. You can delete all of it.
import { remote } from 'electron';
import jetpack from 'fs-jetpack';
import { greet } from './hello_world/hello_world';
import env from './env';



//https://www.npmjs.com/package/yamljs

import {Home} from './home/Home.js';
import {Settings} from './settings/Settings.js';
// import {Chapter} from './chapter/Chapter.js';
const ipcRenderer = require('electron').ipcRenderer;

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());

// Holy crap! This is browser window with HTML and stuff, but I can read
// here files form disk like it's node.js! Welcome to Electron world :)
const manifest = appDir.read('package.json', 'json');

const osMap = {
  win32: 'Windows',
  darwin: 'macOS',
  linux: 'Linux',
};

console.log('run state',{path: process.cwd(), process:process, environment:env, manifest:manifest});



//GLOBAL VARIABLES
//  these are created in background.js (will need to restart node)
//  but can be set and read 

//get the presentationFlow from the saved object, defaulting to 'default'
var savedPresentationFlow = getState('presentationFlow', 'default');
remote.getGlobal('sharedObj').presentationFlow = savedPresentationFlow;





//build home
var h = new Home('#home')
h.build();




//called from the menu: Electron->Settings
var s = new Settings('#settings', h);
console.log('-------------------------')
console.log('-----  temporarily launching the settings panel!!')
console.log('-----  turn off in app.js #54')
console.log('-------------------------')
s.build();
ipcRenderer.on('open-settings', function() {
	s.build();
});