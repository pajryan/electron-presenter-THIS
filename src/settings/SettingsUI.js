import { remote, ipcRenderer } from 'electron';
const app = remote.app;
import yaml from 'yamljs';
import jetpack from 'fs-jetpack';
import {ImportExportAssets as iea} from '../settings/ImportExportAssets.js';
import {Messages} from '../settings/Messages.js';
const dialog = remote.dialog;
//const remote = require('electron').remote;

export class SettingsUI{

	constructor(root, home){
		this.home = home; // the Home.js class that is the current UI
		this.root = root; 	//dom element at root of page
		// this.toc = yaml.parse(jetpack.read('app/presentationConfig/tocs/default.yaml'));	//the table of contents

		this.eventElements = [];

		this.msg;// = new Messages()

	}

	build() {
	    //close button
		var cls = document.createElement('P');
		cls.className = 'closeSettings';
		cls.innerHTML = 'close'
		cls.addEventListener('click', this.killSettings.bind(this))
		this.eventElements.push(cls);
		this.root.appendChild(cls);

		//message holder to communicate with user
	    var msg = document.createElement('div');
	    msg.id='userMessages'
	    msg.className = 'userMessages'
	    this.root.appendChild(msg);

	    var messages = new Messages('#userMessages')
	    this.msg = messages;


	    //select box to choose presentation flow
	    var dirList = jetpack.list(app.getAppPath() + '/app/presentationConfigs/presentationFlows/');
	    var slctDiv = document.createElement('div');
	    slctDiv.className = 'tocSelectDiv'
	    var slct = document.createElement('select');
	    slct.className = 'tocSelect'
	    dirList.forEach(function(dir){
	    	if(dir.substring(0,1)!='.'){
	    		var opt = document.createElement('option');
	    		opt.value = opt.innerHTML = dir;
	    		opt	.selected = (dir == remote.getGlobal('sharedObj').presentationFlow);
	    		slct.appendChild(opt);
	    	}
	    });
	    slct.addEventListener('change', this.selectNewFlow.bind(this))
	    slctDiv.appendChild(slct);
	    this.root.appendChild(slctDiv);


	    //download arhive button
	    var btnArchive = document.createElement('button');
	    btnArchive.textContent = 'download presentation flows';
	    btnArchive.addEventListener('click', function(){new iea(messages, this.home).export();}.bind(this))
	    this.root.appendChild(btnArchive);

	    //upload arhive button
	    var btnUpload = document.createElement('button');
	    btnUpload.textContent = 'upload presentation flows';
	    btnUpload.addEventListener('click', function(){new iea(messages, this.home).import();}.bind(this))
	    this.root.appendChild(btnUpload);


	    var tabZone = document.createElement('div');
	    tabZone.id = 'tabZone';
	    this.root.appendChild(tabZone)

	    var tabJdorn = document.createElement('div');
	    var tabImages = document.createElement('div');
	    var tabMMD = document.createElement('div');
	    tabJdorn.id = 'tabJdorn';
	    tabImages.id = 'tabImages';
	    tabMMD.id = 'tabMMD';
	    tabJdorn.className = 'tab selectedTab';
	    tabImages.className = 'tab';
	    tabMMD.className = 'tab';
	    tabJdorn.textContent = 'flow'
	    tabImages.textContent = 'images'
	    tabMMD.textContent = 'text'
	    tabZone.appendChild(tabJdorn)
	    tabZone.appendChild(tabImages)
	    tabZone.appendChild(tabMMD)
	    

	    var jdrnWrap = document.createElement('div');
	    jdrnWrap.id = 'jdrnWrap';

	    //build the save button for jdorn edits
	    var jdrnButton = document.createElement('button');
	    jdrnButton.className = 'jdrnSubmit';
	    jdrnButton.textContent = 'save'
	    jdrnWrap.appendChild(jdrnButton);
	    this.jdrnButton = jdrnButton

	    //build the jdorn editor for the schema
	    var jdrn = document.createElement('div');
	    jdrn.id = 'jdrn';
	    this.jdornHolder = jdrn;
	    jdrnWrap.appendChild(jdrn)
	    tabZone.appendChild(jdrnWrap);
	    
	    //create the editor
	    this.buildJdornEditor();


	    var imgWrap = document.createElement('div');
	    imgWrap.id = 'imgWrap';
	    tabZone.appendChild(imgWrap);

	    this.buildImageManager(imgWrap)



	    var mmdWrap = document.createElement('div');
	    mmdWrap.id = 'mmdWrap';
	    tabZone.appendChild(mmdWrap);

	    this.buildMMDManager(mmdWrap);



		tabJdorn.addEventListener('click', function(){this.changeTabsTo('jdrnWrap', 'tabJdorn')}.bind(this))
		tabImages.addEventListener('click', function(){this.changeTabsTo('imgWrap', 'tabImages')}.bind(this))
		tabMMD.addEventListener('click', function(){this.changeTabsTo('mmdWrap', 'tabMMD')}.bind(this))
	    

	}

	//just handle switching between the flow, images, and mmd
	changeTabsTo(toShow, tab){
		document.getElementById('jdrnWrap').style.display='none';
		document.getElementById('imgWrap').style.display='none';
		document.getElementById('mmdWrap').style.display='none';

		document.getElementById('tabJdorn').classList.remove('selectedTab');
		document.getElementById('tabImages').classList.remove('selectedTab');
		document.getElementById('tabMMD').classList.remove('selectedTab');


		document.getElementById(tab).className+=' selectedTab';
		document.getElementById(toShow).style.display='block';
	}

	//render the schema to the UI with jdorn editor
	buildJdornEditor(){

		if(this.jdornEditor){
			this.jdornEditor.destroy();
		}else{
			// Hook up the submit button to log to the console
			//only want to do this once (not every time the editor changes)
			this.jdrnButton.addEventListener('click',this.saveJdornEdits.bind(this));
		}
		this.jdornEditor = new JSONEditor(this.jdornHolder,{
			schema: JSON.parse(jetpack.read('app/presentationConfigs/presentationFlowSchema.json')),
			startval: yaml.parse(jetpack.read('app/presentationConfigs/presentationFlows/'+remote.getGlobal('sharedObj').presentationFlow+'/flow.yaml')),
			disable_edit_json:true,
			disable_properties:true,
			disable_collapse:true
		});
	}

	//user clicked 'save' to jdorn.  Just overwrite existing yaml
	saveJdornEdits(){
		//write to the correct template
		var flow = remote.getGlobal('sharedObj').presentationFlow
		console.log('writing the following to ' + flow +'/flow.yaml' ,this.jdornEditor.getValue());
		//convert to yaml
		var yamlString = yaml.stringify(this.jdornEditor.getValue(),30, 2);
		jetpack.write('app/presentationConfigs/presentationFlows/'+flow+'/flow.yaml', yamlString)
		this.reloadHome(flow)


	}


	buildImageManager(parentNode){
		//build an upload mechanism
	    var upImg = document.createElement('button');
	    upImg.textContent = 'upload new image (overwriting existing!)';
	    upImg.addEventListener('click', this.uploadImage.bind(this));
	    parentNode.appendChild(upImg);

		//get all of the images available to this flow		
		var imgTbl = document.createElement('table');
		imgTbl.id = 'imageTable';
		parentNode.appendChild(imgTbl)

		this.buildImageList('imageTable');
	}

	buildImageList(id){
		var tbl = document.getElementById(id);
		this.killChildNodes(tbl);
		var imgList = jetpack.list(app.getAppPath() + '/app/presentationConfigs/presentationFlows/'+remote.getGlobal('sharedObj').presentationFlow+'/images/');
		imgList.forEach(function(d,i){
			var r = document.createElement('tr');
			var c1 = document.createElement('td');
			var c2 = document.createElement('td');
			
			var im = document.createElement('img');
			im.src = 'presentationConfigs/presentationFlows/'+remote.getGlobal('sharedObj').presentationFlow+'/images/'+d;
			c1.appendChild(im)

			c2.innerHTML = d;


			r.appendChild(c1);
			r.appendChild(c2);
			tbl.appendChild(r);
		});
	}

	uploadImage() {
		this.msg.clear();
		//open a dialog asking the user to upload images
		dialog.showOpenDialog(
			{ filters: [  { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }, ], properties:['openFile', 'multiSelections'] },
			this.finisheUploadImage.bind(this)
		);
	}

	finisheUploadImage(fileNames){
		if (fileNames === undefined) return;
		var imgCnt=0;
		fileNames.forEach(function(d,i){

			var imgNameParts = d.split('/');
			var imgName = imgNameParts[imgNameParts.length-1];
			imgName = imgName.replace(/\s+/g, "-");	//replace spaces with dashes

			imgCnt++;
			var newPath = 'app/presentationConfigs/presentationFlows/'+remote.getGlobal('sharedObj').presentationFlow+'/images/' + imgName;

			jetpack.copy(d,newPath)

		}.bind(this));

		//done uploading.  tell user and rebuild image list
		this.msg.out('uploaded ' + imgCnt + ' image(s)');
		this.buildImageList('imageTable');
	}


	buildMMDManager(parentNode) {
		//build an upload mechanism
	    var newMmd = document.createElement('button');
	    newMmd.textContent = 'create new text file';
	    // newMmd.addEventListener('click', this.uploadImage.bind(this));
	    parentNode.appendChild(newMmd);

		//get all of the images available to this flow		
		var mmdTbl = document.createElement('table');
		mmdTbl.id = 'mmdTable';
		parentNode.appendChild(mmdTbl)

		this.buildMMDList('mmdTable');

		var mmdEditWrap = document.createElement('div');
		mmdEditWrap.id='mmdEditorWrap';

		var mmdEdit = document.createElement('textarea');
		mmdEdit.id='mmdEditor';
		mmdEditWrap.appendChild(mmdEdit);

		parentNode.appendChild(mmdEditWrap);

		var mmdSave = document.createElement('button');
		mmdSave.textContent = 'save changes';
		mmdSave.id='saveMMDButton';
		mmdSave.addEventListener('click', this.saveMMDFile)
		parentNode.appendChild(mmdSave);

	}

	buildMMDList(id){
		//get all the MMD files 
		var tbl = document.getElementById(id);
		this.killChildNodes(tbl);
		var mmdList = jetpack.list(app.getAppPath() + '/app/presentationConfigs/presentationFlows/'+remote.getGlobal('sharedObj').presentationFlow+'/text/');
		mmdList.forEach(function(d,i){
			//only list MMD files
			if(d.indexOf('.mmd')!=-1){
				var r = document.createElement('tr');
				var c1 = document.createElement('td');
				var s = document.createElement('span');
				s.textContent = d;
				s.dataset.filename = d;
				s.className = 'mmdLink';
				s.addEventListener('click', this.editMMDFile);

				c1.appendChild(s)

				r.appendChild(c1);
				tbl.appendChild(r);
			}
		}.bind(this));


	}


	editMMDFile(e){
		var spn = e.target;
		var mmdFile = spn.dataset.filename;
		console.log(mmdFile);
		//put the contents of the mmd into the textarea
		var txt = jetpack.read(app.getAppPath() + '/app/presentationConfigs/presentationFlows/'+remote.getGlobal('sharedObj').presentationFlow+'/text/'+mmdFile);
		document.getElementById('mmdEditor').dataset.filename=mmdFile;//store this off so I can save to the right file
		document.getElementById('mmdEditor').value=txt;
	}

	saveMMDFile(){
		//get the file from the textarea
		var mmdFile = document.getElementById('mmdEditor').dataset.filename;
		var txt = document.getElementById('mmdEditor').value;
		jetpack.write(app.getAppPath() + '/app/presentationConfigs/presentationFlows/'+remote.getGlobal('sharedObj').presentationFlow+'/text/'+mmdFile, txt);
		document.getElementById('saveMMDButton').textContent='SAVED';
		setTimeout(function(){document.getElementById('saveMMDButton').textContent='save changes';}, 1000)
	}


	//rebuild the underlying flow (for any number of reasons)
	reloadHome(newFlow){	//this takes a string-name of the flow (e.g. 'default')
		console.log('switching to new flow:' + newFlow)
		remote.getGlobal('sharedObj').presentationFlow = newFlow;
		//notify the main that this has changed (so it can be persisted)
		ipcRenderer.send('updatePresentationFlow');


		//have chosen a new toc.  So use it.  Need to kill the existing chapter/pages and reload
		if(this.home.currentChapter){
			//if we have a chapter, kill it
			this.home.currentChapter.killChapter();
		}

		//reload the toc
		this.home.killHome();
		setTimeout(function(){this.home.build();}.bind(this), 500);
		setTimeout(function(){this.msg.append('presentation has been updated')}.bind(this), 500);
		setTimeout(function(){this.buildJdornEditor()}.bind(this), 500);
	}

	selectNewFlow(e){
		//set the global variable with the new flow and rebuild the UI
		var newFlow = e.target.options[e.target.selectedIndex].value;
		this.reloadHome(newFlow);

	}


	killSettings() {
		//get rid of the settings box
		this.root.classList.remove('showSettings');

		//then clean up

		//remove event listeners
		this.eventElements.forEach(function(e){
			this.killEventListeners(e)
		}.bind(this))
		
		this.eventElements=[];

		//clean up the dom
		this.killChildNodes(this.root);

	}
	


	killEventListeners(node){
		//easiest way to remove event listeners is to clone the node (which dumps listeners)
		node.parentNode.replaceChild(node.cloneNode(true),node);
	}

	killChildNodes(node){
		while (node.firstChild) {
		    node.removeChild(node.firstChild);
		}
	}
}


