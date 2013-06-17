function options() {
  
	
  google.load("language", "1");

  window.onload = init;
  function init(){
	  set_languages();
	  restore_options();
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('save-button').addEventListener('click', save_options);
  });
  
  //Sets Languages
  function set_languages(){
    var languages = google.language.Languages
    var targetLanguageOptions = " "
    for(var language in languages) {
      var name = language.substring(0, 1) + language.substring(1).toLowerCase().replace('_', ' - ');
      targetLanguageOptions += '<option value="' + languages[language] + '">' + name + '</option>'
    }
    document.getElementById("sourceLanguage").innerHTML = targetLanguageOptions;
    document.getElementById("targetLanguage").innerHTML = targetLanguageOptions;
  }

  function S(key) { return localStorage[key]; } 


  function save(id) {
    var e = document.getElementById(id);
    var type = e.tagName.toLowerCase();
    if (type == "select") {
      localStorage[id] = e.children[e.selectedIndex].value;
    }
    else {
      localStorage[id] = e.value; 
    }
  }

  var options = ["translationTimeout", 
                 "sourceLanguage", "targetLanguage", "translationProbability", 
                 "minimumSourceWordLength", "translatedWordStyle", "blacklist",
                 "userDefinedTranslations"];


  // Saves options to localStorage.
  function save_options() {

    localStorage["activation"] = document.getElementById("activationOn").checked;

    for (index in options) {
      save(options[index]);
    }

    try { JSON.parse(S("userDefinedTranslations"));} 
    catch(e) {
      alert('Your options have been saved, but your user-defined translations are badly specified and therefore will not be used. Please provide your user-defined translations according to the following format:\n\n {"word1":"translation1", "word2":"translation2", "word3":"translation3", "word4":"translation4"}');
    }
	
    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.style.visibility = "visible";
    setTimeout(function() {
      status.style.visibility = "hidden";;
    }, 1500);
    console.log("Options saved")
  }


  

  function restore(id) {
    var e = document.getElementById(id);
    var type = e.tagName.toLowerCase();
    if (type == "select") {
      for (var i = 0; i < e.children.length; i++) {
        var child = e.children[i];
        if (child.value == S(id)) {
          child.selected = "true";
          break;
        }
      }
    }
    else {
      e.value = S(id);
    }   
  }

  
  function restore_options() {
    if (S("activation") == "true") {
      document.getElementById("activationOn").checked = true;
    } else {
      document.getElementById("activationOff").checked = true;
    }

    for (index in options) {
      console.log("restoring " + options[index]);
      restore(options[index]);
    }
  }


  google_analytics('UA-1471148-14');  
}