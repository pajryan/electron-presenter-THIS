import { remote } from 'electron';
const app = remote.app;
import yaml from 'yamljs';
import jetpack from 'fs-jetpack';

import archiver from 'archiver';
import unzipper from 'unzipper';
import path from 'path';

// var remote = require('remote'); 

//  var dialog = remote.require('dialog'); 

const dialog = remote.dialog;


export class ImportExportAssets{

	constructor(msg, home){
		this.home = home; // the Home.js class that is the current UI
		this.msg = msg;	// the Message.js class to write messags to the UI
		this.localDir = app.getAppPath() + '/app/presentationConfigs/';
		this.downloadDir = app.getPath('downloads')+'/presentationFlows.pres';
	}

	/* run when download is clicked in the settings section
		the goal is to download a zip of relevant assets */
	export() {
	    //want to bundle up the images, the texts, the tocs and maybe the charts
	    this.msg.clear();

	    //directories to zip (relative to this.localDir above)
		var dirNames = [
							'presentationFlows'
						]; 

		var fileNames =[
							//'elements/text/someText.mmd' //as example.  In this case it just puts the same file in, but want to allow inidvidual files
						];

		var archive = archiver.create('zip', {});
		archive.on('error', function(err){
		    throw err;
		});

		var output = jetpack.createWriteStream(this.downloadDir); //path to create .zip file
		output.on('close', function() {
			this.msg.out('presentationFlows.zip has been saved to your downloads folder');
		    console.log('archive complete: ' + archive.pointer() + ' total bytes written to ' + this.downloadDir);
		}.bind(this));
		archive.pipe(output);

		dirNames.forEach(function(dirName) {
		    archive.directory(this.localDir + dirName, dirName);
		}.bind(this));


		fileNames.forEach(function(fileName) {
			var stream = jetpack.read(path.join(this.localDir, fileName));
    		archive.append(stream, { name: fileName });
		}.bind(this));

		archive.finalize();
	}




	/* run when upload is clicked in the settings section
		the goal is to upload a zip of relevant assets

		things to think about include: this will overwrite existing... oof. */
	import() {
		this.msg.clear();
		//open a dialog asking the user to upload
		//must be named 'presentationConfig.pres'
		//  .pres is just a rename of .zip
		//  but must be 'presentationConfig' to match the directory name here
		dialog.showOpenDialog(
			{ filters: [ { name: 'presentationFlow', extensions: ['pres'] } ], properties:['openFile'] },
			this.importChosenFiles.bind(this)
		);

	}

	importChosenFiles(fileNames){
		if (fileNames === undefined) return;
		console.log('reading ' + fileNames[0]);
		//unpack the zip right to the same directory - THIS OVERWRITES EVERYTHING!!!!
		jetpack.createReadStream(fileNames[0]).pipe(
			unzipper.Extract({ path: this.localDir })
			// unzipper.Extract({ path: this.localDir+'dump' })
		)
		.on('error', function(e){
			console.error('error unzipping',e);
			this.msg.out('ERROR UPLOADING FILE!');
		})
		.on('finish', function(){
			console.log('upload finished')
			this.msg.out('file uploaded');
			this.importComplete();
		}.bind(this));
	}

	importComplete(){
		//have uploaded new stuff.  So use it.  Need to kill the existing chapter/pages and reload
		if(this.home.currentChapter){
			//if we have a chapter, kill it
			this.home.currentChapter.killChapter();
		}

		//reload the toc
		this.home.killHome();
		setTimeout(function(){console.log(this.home);this.home.build();}.bind(this), 500);
		setTimeout(function(){this.msg.append('presentation has been updated')}.bind(this), 500);

	}
	
	
}


