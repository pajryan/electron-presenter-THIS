
import yaml from 'yamljs';
import jetpack from 'fs-jetpack';

import {Page} from '../page/Page.js';


export class Chapter{

	constructor(e, toc){
		this.chapterIndex = e.target.getAttribute('data-chapterIndex');	//the index of the current chapter
		this.toc = toc;	//the table of contents in json

		//bunch of dom elements
		this.chapterHolder = document.querySelector('#chapter');
		this.pageHolder = document.querySelector('#page');
		this.chapterLeft = document.querySelector('#chapterLeft');
		this.chapterRight = document.querySelector('#chapterRight');
		this.chapterClose = document.querySelector('#chapterClose');
		this.pageTitleHolder = document.querySelector('#chapterText');

		this.build();
	}

	build() {
		var currChapter = this.toc.chapters[this.chapterIndex];
	   
		//attach event listeners to the navigation
		this.chapterClose.addEventListener('click', this.killChapter.bind(this));
		this.chapterLeft.addEventListener('click', this.incrementPage.bind(this));
		this.chapterRight.addEventListener('click', this.incrementPage.bind(this));

		new Page(this.chapterIndex, 0, this.toc);

		//finally, show the chapter
		this.chapterHolder.style.display='flex';

	}

	//kill a chapter TODO:GARBAGE COLLECT!!!!
	killChapter() {
		console.log('killing chapter index ', this.chapterIndex);
		//need to make sure we're freeing up memory etc.  should remove event listeners etc
		this.killEventListeners(this.chapterClose);
		this.killEventListeners(this.chapterLeft);
		this.killEventListeners(this.chapterRight);

		//remove nodes
		this.killChildNodes(this.pageTitleHolder);
		this.killChildNodes(this.pageHolder);
		

		//hide the whole chapter UI
		this.chapterHolder.style.display='none';
	}


	//forward/back through the pages
	incrementPage(e){
		var direction = e.target.getAttribute('data-increment');
		console.log('incrementing page: ' + direction);

	}


	killEventListeners(node){
		//easiest way to remove event listeners is to clone the node (which dumps listeners)
		if(node.parentNode){
			node.parentNode.replaceChild(node.cloneNode(true),node);
		}
	}

	killChildNodes(node){
		while (node.firstChild) {
		    node.removeChild(node.firstChild);
		}
	}
	
}

