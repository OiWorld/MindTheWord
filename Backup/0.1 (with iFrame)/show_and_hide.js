function show(div_id) {
  var div = document.getElementById(div_id);
  var blanket = document.getElementById('blanket');
  var h = window.innerHeight;
  var w = window.innerWidth;
  //blanket.style.height = document.body.clientHeight + 'px';
  div.style.top = h/2 - 150 + 'px';
  div.style.left = w/2 - 150 + 'px';
  blanket.style.display = 'block';
  div.style.display = 'block';  	
}
function hide(div_id) {
  var div = document.getElementById(div_id);
  var blanket = document.getElementById('blanket');
  blanket.style.display = 'none';
  div.style.display = 'none';  	
}
function showIFrame(orig, trans) {
  var url = "http://www.logic.at/people/bruno/Programs/MindTheWord/MindTheWord.php?" + 
            "orig=" + orig + 
            "&trans=" + trans ;
  document.getElementById('MindTheWordIFrame').src = url;
  show('hiddenDiv');
}

