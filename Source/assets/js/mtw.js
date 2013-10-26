/* This script was injected by MindtheWord */
/* http://www.google.com/dictionary/json?callback=dict_api.callbacks.id100&q=example&sl=en&tl=en */

window.onload = function(){
	var tw = document.getElementsByClassName("translatedWord"),
		testIf = setInterval(function(){ // Test if MindTheWord has finished
			if(tw.length > 1){
				clearInterval(testIf);
				for(var i=0; i<tw.length; i++){ tw[i].addEventListener("click", infoMe) }
				document.addEventListener("keyup", function(e){ if(e.keyCode == 27){ hideInfo() } });
			}else{ tw = document.getElementsByClassName("translatedWord") }
		}, 500);

	var interval;
    function infoMe(){
    	clearInterval(interval);
		var _this = this,
			offset = getPos(_this),
    		infoBox = document.getElementById("MindTheInfoBox"),
    		loading = false;

    	if(!_this.dataset.phonetic){
    		loading = true;
    		jQuery.getJSON("http://www.google.com/dictionary/json?q=" + _this.dataset.query + "&sl=en&tl=en&callback=?", function(r) {
			    	console.log(r);
			    	console.log(r.primaries[0].terms[1].text, r.primaries[0].terms[2].text);
			    	_this.dataset.phonetic = r.primaries[0].terms[1].text;
			    	_this.dataset.sound = r.primaries[0].terms[2].text;
			    	loading = false;
				}
			)
    	}
    	interval = setInterval(function(){
    		if(!loading){
    			infoBox.innerHTML = "<b>" + _this.dataset.query + "</b> <span class='icon-volume'></span> [" + _this.dataset.phonetic + "]";
		    	infoBox.style.top = (offset.y - 25) + "px";
		    	infoBox.style.left = (offset.x) + "px";
		    	infoBox.style.display = "block";
		    	clearInterval(interval);
    		}
    	}, 100)
    }


    function hideInfo(){
    	var infoBox = document.getElementById("MindTheInfoBox");
    	infoBox.style.display = "none";
    	clearInterval(interval);
    }

    // http://stackoverflow.com/q/3741056/754471
    var getPos = function (obj) {
	    var pos = {'x':0,'y':0};
	    if(obj.offsetParent) {
	        while(1) {
	          pos.x += obj.offsetLeft;
	          pos.y += obj.offsetTop;
	          if(!obj.offsetParent) {
	            break;
	          }
	          obj = obj.offsetParent;
	        }
	    } else if(obj.x) {
	        pos.x += obj.x;
	        pos.y += obj.y;
	    }
	    return pos;
	  }
}