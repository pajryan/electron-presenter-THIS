
export class Messages{

	constructor(msgId){
		this.msg = document.querySelector(msgId); 	//queryable dom string (e.g. #root)
	}

	clear() {
		this.msg.innerHTML = '';
	}

	append(txt) {
	    this.msg.innerHTML += '<br />' + txt;
	}

	out(txt){
	    this.msg.innerHTML =  txt;

	}


	
	
}





