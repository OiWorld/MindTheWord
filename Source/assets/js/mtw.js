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
			// + "&tl=" + _this.dataset.tl 
			jQuery.getJSON("http://www.google.com/dictionary/json?q=" + _this.innerText + "&sl=" + _this.dataset.sl + "&tl=" + _this.dataset.tl + "&callback=?", 
				function(r) {
					if(typeof r.primaries === "object"){
						_this.dataset.phonetic = r.primaries[0].terms[1].text;
						_this.dataset.sound = r.primaries[0].terms[2].text;
					}else{
						_this.dataset.phonetic = "_UNKNOWN_";
					}
					loading = false;
				}
			)
		}
		interval = setInterval(function(){
			if(!loading || _this.dataset.phonetic){
				var sound = "", phonetic = "";
				if(_this.dataset.sound){ sound = "<span class='icon-volume'></span> " }
				if(_this.dataset.phonetic != "_UNKNOWN_"){ phonetic = "[" + _this.dataset.phonetic + "]" }
				infoBox.innerHTML = "<b>" + _this.dataset.query + "</b> " + sound + phonetic;
				infoBox.style.top = (offset.y - 25) + "px";
				infoBox.style.left = (offset.x) + "px";
				infoBox.style.display = "block";
				clearInterval(interval);

				if(_this.dataset.sound){
					infoBox.getElementsByClassName("icon-volume")[0].addEventListener("click", function(){
						var audioElm = document.createElement("audio");
						audioElm.setAttribute("src", _this.dataset.sound);
						audioElm.play();
					})
				}
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
