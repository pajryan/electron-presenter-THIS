import yaml from 'yamljs';
import jetpack from 'fs-jetpack';

import {Text} from '../elementTypes/Text.js';
import {Image} from '../elementTypes/Image.js';

export class Page{

	constructor(chapterIndex, pageIndex, toc){
		this.toc = toc;	//the table of contents
		this.chapterIndex = chapterIndex;
		this.pageIndex = pageIndex;
		this.page = this.toc.chapters[this.chapterIndex].pages[this.pageIndex];

		//bunch of dom elements
		this.pageTitleHolder = document.querySelector('#chapterText');
		this.pageHolder = document.querySelector('#page');

		this.toResize = [];	//elements that will need resizing when page resizes

		this.build()
	}



	build() {
	    //build the page UI
		console.log('building page ' +  this.pageIndex + ' in chapter ' + this.chapterIndex, this.page);

		//create the layout elements and kick off builds

		//add the title
		var title = document.createElement('P');
		title.innerHTML = page.title;
		this.pageTitleHolder.appendChild(title)

		//set an event listener on the #page to catch resizes
		window.addEventListener('resize', this.windowResize.bind(this))

		//build the elements
		//need to delay until the #page element has been drawn (so we can get its size)
		setTimeout(this.buildPageElementDelay.bind(this),100);

	}


	buildPageElementDelay(element,index){
		this.page.elements.forEach(this.buildPageElement.bind(this));
	}


	buildPageElement(element, index){
		//first build the container element
		var c = document.createElement('DIV');
		c.className = 'pageElement';
		this.pageHolder.appendChild(c);	//need to add to DOM to get size info.  But might want to hide it until rendering is done?

		//set the size of the element holder
		this.setElementSize(c, element.position);

		
		var elemBuilt;	//yay for this can be literally anything.
		switch(element.elementType){
			case 'text':
				elemBuilt = new Text(c, element);
				break;
			case 'image':
				elemBuilt = new Image(c, element);
				break;
			case 'chart':
				window.alert('no support for element type "chart"');
				break
			default:
				window.alert('no support for element type: ' + element.elementType);
				break;
		}


		//store each element to prepare for resize.  Will also trigger resize of the internal element (e.g. Text or Chart)
		this.toResize.push({elementDiv:c, pos:element.position, elementBuilt:elemBuilt});
	}
	
	setElementSize(node, position){
		if(!node || !node.parentElement){return;}
		//position should look like: position.fromLeftPercent:0, percents.fromTopPercent:33, percents.heightPercent:66Percent, percent.widthPercent:100
		var margin = 10;

		var dims = this.computeElementDims(node.parentElement);
		
		var topNum = +(position.fromTopPercent);
		var leftNum = +(position.fromLeftPercent);
		var widthNum = +(position.widthPercent);
		var heightNum = +(position.heightPercent);

		node.style.top = (dims.height * topNum/100 + margin) + 'px';
		node.style.left = (dims.width * leftNum/100 + margin) + 'px';
		node.style.width = (dims.width * widthNum/100 - 2*margin) + 'px';
		node.style.height = (dims.height * heightNum/100 - 2*margin) + 'px';

	}


	setElementSizeByPercent(node, position){
		//this works.  But doesn't allow for any padding/margins...
		//position should look like: position.fromLeftPercent:0, percents.fromTopPercent:33, percents.heightPercent:66Percent, percent.widthPercent:100
		node.style.top = position.fromTopPercent + '%';
		node.style.left = position.fromLeftPercent + '%';
		node.style.width = position.widthPercent + '%';
		node.style.height = position.heightPercent + '%';
	}

	windowResize(e){
		for(var e=0; e<this.toResize.length; e++){
			var ce = this.toResize[e];
			this.setElementSize(ce.elementDiv, ce.pos);
			
			//trigger the resize of the actual component (text, chart etc)
			if(ce.elementBuilt){
				ce.elementBuilt.resize();
			}
		}
	}


	computeElementDims(node){
		return node.getBoundingClientRect();
	}
	
}





