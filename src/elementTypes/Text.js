import { remote } from 'electron';
import jetpack from 'fs-jetpack';
import mmd from 'marked';	//https://github.com/chjj/marked

export class Text{

	constructor(container, element){
		this.container = container; 	//container that holds this particular element
		this.element = element; 		//the element from the toc yaml
		this.maxFontSize = 1;		//font size in ems.  We'll keep shrinking this till it fits

		this.build();
	}



	build() {
		//get the mmd, convert it to html and display
		this.container.innerHTML = mmd(jetpack.read('app/presentationConfigs/presentationFlows/'+remote.getGlobal('sharedObj').presentationFlow+'/text/'+this.element.element));
		this.resize();
	}



	/*called whenever the external window/div is resized.  Can ignore*/
	resize(){

		//also runs when the window gets *bigger* so always start the resize iteration at the max
		var fontSize = this.maxFontSize;
    	this.container.style.fontSize = fontSize+'em';

		//check to see if the text fits.  If not, shrink it.
		while (this.container.offsetHeight < this.container.scrollHeight ||
		    this.container.offsetWidth < this.container.scrollWidth) {

			fontSize = fontSize - 0.05;
	    	this.container.style.fontSize = fontSize+'em';
		} 
	}

}


