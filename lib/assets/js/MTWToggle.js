/* This script was injected by MindTheWord */
toggleElement = function(elem) {
  var word = elem.innerHTML;
  var newword = (word == elem.dataset.translated) ? elem.dataset.original : elem.dataset.translated;
  elem.innerHTML = newword;
}
