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
    document.getElementById("sourceLanguageSelect").innerHTML += targetLanguageOptions;
    document.getElementById("targetLanguageSelect").innerHTML = targetLanguageOptions;
  }

  // Saves options to localStorage.
  function save_options() {
    var selectSL = document.getElementById("sourceLanguageSelect");
    var sourceLanguage = selectSL.children[selectSL.selectedIndex].value;
    var selectTL = document.getElementById("targetLanguageSelect");
    var targetLanguage = selectTL.children[selectTL.selectedIndex].value;
    var selectProb = document.getElementById("translationProbabilitySelect");
    var translationProbability = selectProb.children[selectProb.selectedIndex].value;
    var minimumSourceWordLength = document.getElementById("minimumSourceWordLength").value;
    var translatedWordStyle = document.getElementById("translatedWordStyle").value;
    var userDefinedTranslations = document.getElementById("userDefinedTranslations").value;
    var translationTimeout = document.getElementById("translationTimeout").value;

    localStorage["translationTimeout"] = translationTimeout;
    localStorage["activation"] = document.getElementById("activationOn").checked;
    localStorage["sourceLanguage"] = sourceLanguage;
    localStorage["targetLanguage"] = targetLanguage;
    localStorage["translationProbability"] = translationProbability;
    localStorage["minimumSourceWordLength"] = minimumSourceWordLength;
    localStorage["translatedWordStyle"] = translatedWordStyle;
    localStorage["userDefinedTranslations"] = userDefinedTranslations;
    try {
      JSON.parse(userDefinedTranslations);
    } catch(e) {
      alert('Your options have been saved, but your user-defined translations are badly specified and therefore will not be used. Please provide your user-defined translations according to the following format:\n\n {"word1":"translation1", "word2":"translation2", "word3":"translation3", "word4":"translation4"}');
    }
	
    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    var status2 = document.getElementById("status2");
    status.innerHTML = "Options Saved.";
    status2.innerHTML = "Options Saved.";
    setTimeout(function() {
      status.innerHTML = "";
      status2.innerHTML = "";
    }, 750);
  }

  function S(key) { return localStorage[key]; } 
  
  // Restores select box state to saved value from localStorage.
//  function restore_options() {
//	    var activation = localStorage["activation"];
//	    if (activation == null) {
//	      localStorage["activation"] = "true";
//	      activation = "true";
//	    }
//	    if (activation == "true") {
//	      document.getElementById("activationOn").checked = true;
//	    } else {
//	      document.getElementById("activationOff").checked = true;
//	    }
//
//	    var sourceLanguage = localStorage["sourceLanguage"];
//	    if (!sourceLanguage) {
//	      localStorage["sourceLanguage"] = "en";
//	      sourceLanguage = "en";
//	    }
//	    var select = document.getElementById("sourceLanguageSelect");
//	    for (var i = 0; i < select.children.length; i++) {
//	      var child = select.children[i];
//	      if (child.value == sourceLanguage) {
//	        child.selected = "true";
//	        break;
//	      }
//	    }
//
//	    var targetLanguage = localStorage["targetLanguage"];
//	    if (!targetLanguage) {
//	      localStorage["targetLanguage"] = "ru";
//	      targetLanguage = "ru";
//	    }
//	    var select = document.getElementById("targetLanguageSelect");
//	    for (var i = 0; i < select.children.length; i++) {
//	      var child = select.children[i];
//	      if (child.value == targetLanguage) {
//	        child.selected = "true";
//	        break;
//	      }
//	    }
//	    var translationProbability = localStorage["translationProbability"];
//	    if (!translationProbability) {
//	      localStorage["translationProbability"] = 15;
//	      translationProbability = 15;
//	    }
//	    var select = document.getElementById("translationProbabilitySelect");
//	    for (var i = 0; i < select.children.length; i++) {
//	      var child = select.children[i];
//	      if (child.value == translationProbability) {
//	        child.selected = "true";
//	        break;
//	      }
//	    }
//	    var minimumSourceWordLength =  localStorage["minimumSourceWordLength"];
//	    if (!minimumSourceWordLength) {
//	      localStorage["minimumSourceWordLength"] = 3;
//	      minimumSourceWordLength = 3;
//	    }
//	    document.getElementById("minimumSourceWordLength").value = minimumSourceWordLength;
//
//	    var translationTimeout =  localStorage["translationTimeout"];
//	    if (!translationTimeout) {
//	      localStorage["translationTimeout"] = 50;
//	      translationTimeout = 50;
//	    }
//	    document.getElementById("translationTimeout").value = translationTimeout;
//
//	    var translatedWordStyle =  localStorage["translatedWordStyle"];
//	    if (!translatedWordStyle) {
//	      localStorage["translatedWordStyle"] = "color : #FE642E ;\nfont-style : italic ;";
//	      translatedWordStyle = "color : #FE642E ;\nfont-style : italic ;";
//	    }
//	    document.getElementById("translatedWordStyle").value = translatedWordStyle;
//
//	    var userDefinedTranslations =  localStorage["userDefinedTranslations"];
//	    if (!userDefinedTranslations) {
//	      localStorage["userDefinedTranslations"] = '{"the":"the", "a":"a"}';
//	      userDefinedTranslations = '{"the":"the", "a":"a"}';
//	    }
//	    document.getElementById("userDefinedTranslations").value = userDefinedTranslations;
//	  }
  
  function restore_options() {
    if (S("activation") == "true") {
      document.getElementById("activationOn").checked = true;
    } else {
      document.getElementById("activationOff").checked = true;
    }

    var select = document.getElementById("sourceLanguageSelect");
    for (var i = 0; i < select.children.length; i++) {
      var child = select.children[i];
      if (child.value == S("sourceLanguage")) {
        child.selected = "true";
        break;
      }
    }

    var select = document.getElementById("targetLanguageSelect");
    for (var i = 0; i < select.children.length; i++) {
      var child = select.children[i];
      if (child.value == S("targetLanguage")) {
        child.selected = "true";
        break;
      }
    }

    var select = document.getElementById("translationProbabilitySelect");
    for (var i = 0; i < select.children.length; i++) {
      var child = select.children[i];
      if (child.value == S("translationProbability")) {
        child.selected = "true";
        break;
      }
    }

    document.getElementById("minimumSourceWordLength").value = S("minimumSourceWordLength");
    document.getElementById("translationTimeout").value = S("translationTimeout");
    document.getElementById("translatedWordStyle").value = S("translatedWordStyle");
    document.getElementById("userDefinedTranslations").value = S("userDefinedTranslations");
  }


  google_analytics('UA-1471148-14');  
}