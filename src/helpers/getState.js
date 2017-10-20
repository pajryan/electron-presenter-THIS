// This helper saves items to the userDataDirectory 
//    e.g. /Users/patrickryan/Library/Application Support/Electron Boilerplate
//    it creates a file with 'name' and drops in a string version of whatever is in options
//    the file is saved as .txt

/**


NOTE NOTE NOTE
anything done in here requires a node restart to work!!!


**/

import { remote } from 'electron';
const app = remote.app;

import jetpack from 'fs-jetpack';
import path from 'path';



export default(name,defaultValue) => {
  const userDataDir = jetpack.cwd(app.getPath('userData'));
  const stateStoreFile = `saved-state-${name}.txt`;
  let restoredState = {};
  try {
  	// console.log('getting state from ', path.join(app.getPath('userData') + '/' +stateStoreFile))
  	var haveFile = jetpack.exists(path.join(app.getPath('userData') + '/' +stateStoreFile));
  	if(haveFile){
    	restoredState = userDataDir.read(stateStoreFile, 'utf8');

  	}else{
  		console.error('tried to get a saved state for ' + name + ' but file ('+userDataDir + '/' +stateStoreFile+') didnt exist. Sending default instead: '+defaultValue);
  		//not trying to save this new default as the state since it'll just work. and trying to keep this generic (not make a call to save)
	    return defaultValue
	  }
	    
  } catch (err) {
    // For some reason json can't be read (might be corrupted).
    // No worries, we have defaults.
    console.error('tried to get a saved state for ' + name + ' but failed. Sending default instead: '+defaultValue);
    console.error(err);
    return defaultValue;
  }

  console.log('successfully got restored state: ', restoredState)
  return restoredState;

};











