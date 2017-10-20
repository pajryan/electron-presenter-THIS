import yaml from 'yamljs';
import jetpack from 'fs-jetpack';
import {SettingsUI} from '../settings/SettingsUI.js';

export class Settings{

	constructor(root, home){
		this.home = home; // the Home.js class that is the current UI
		this.root = document.querySelector(root); 	//queryable dom string (e.g. #root)
	}

	build() {

	    //create the UI
	    var sui = new SettingsUI(this.root, this.home);
	    sui.build();

	    //show the panel
	    this.root.className='showSettings';
	    
	}

	
	
}


