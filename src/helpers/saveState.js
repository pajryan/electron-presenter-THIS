// This helper saves items to the userDataDirectory 
//    e.g. /Users/patrickryan/Library/Application Support/Electron Boilerplate
//    it creates a file with 'name' and drops in a string version of whatever is in options
//    the file is saved as .txt

/**


NOTE NOTE NOTE
anything done in here requires a node restart to work!!!


**/

// import { remote } from 'electron';
// const app = remote.app;

import { app } from 'electron';
import jetpack from 'fs-jetpack';

export default(name, options) => {
  var userDataDir = jetpack.cwd(app.getPath('userData'));
  var stateStoreFile = `saved-state-${name}.txt`;

  console.log('saving the following state to ' + stateStoreFile + ': ', options);
  userDataDir.write(stateStoreFile, options, { atomic: true });
}


