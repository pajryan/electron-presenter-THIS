import { remote } from 'electron';

export class Image{

	constructor(container, element){
		this.container = container; 	//container that holds this particular element
		this.element = element; 		//the element from the toc yaml

		this.img = document.createElement('IMG');

		this.build();
	}



	build() {
		//build an image tag and point to the right image
		this.img.src = 'presentationConfigs/presentationFlows/'+remote.getGlobal('sharedObj').presentationFlow+'/images/'+this.element.element;
		this.img.className = 'standalone';

		this.container.appendChild(this.img);

		this.resize();
	}


	/*called whenever the external window/div is resized.  Can ignore*/
	resize(){

		//need to get the h/w of the image AND the container and 
		
	}

}


