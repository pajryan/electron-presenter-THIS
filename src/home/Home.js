import { remote } from 'electron';
import yaml from 'yamljs';
import jetpack from 'fs-jetpack';
import {Chapter} from '../chapter/Chapter.js';

export class Home{

	constructor(root){
		this.root = document.querySelector(root); 	//queryable dom string (e.g. #root)
		this.toc = yaml.parse(jetpack.read('app/presentationConfigs/presentationFlows/'+remote.getGlobal('sharedObj').presentationFlow+'/flow.yaml'));	//the table of contents
		this.currentChapter = null;

		this.eventElements = [];
	}
// console.log('SETTINGSUI',remote.getGlobal('sharedObj').presentationFlow);    

	

	build() {
	    //build the toc UI
	    console.log('building home chapters')
	    //get the toc again in case it has changed (in the case of settings)
	    this.toc = yaml.parse(jetpack.read('app/presentationConfigs/presentationFlows/'+remote.getGlobal('sharedObj').presentationFlow+'/flow.yaml'));	//the table of contents
	    this.toc.chapters.forEach(this.buildOneChapterDiv.bind(this));
	}

	buildOneChapterDiv(d,i) {
		var c = document.createElement('DIV');
    	c.className = 'homeChapter';
    	c.setAttribute('data-chapterIndex', i);
    	c.innerHTML = this.toc.chapters[i].title;
    	c.addEventListener('click', this.launchChapter.bind(this));
    	this.eventElements.push(c);
    	this.root.appendChild(c);
	}

	launchChapter(e){
		this.currentChapter = new Chapter(e, this.toc);
	}

	killHome(){
		//clean up
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





