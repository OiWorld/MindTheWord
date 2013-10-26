function options() {

  var options;
	
  google.load("language", "1");

  window.onload = init;
  function init(){
	  set_languages();
    fixLocalStorage();
    showCSSResults();
  }

  // Fix any localStorage if needed
  function fixLocalStorage(){
    var ls = { // localStorage
      "blacklist"               : "(stackoverflow.com|github.com|code.google.com)",
      "activation"              : "true",
      "savedPatterns"           : JSON.stringify([[["en","English"],["ru","Russian"],"15",true], [["da","Danish"],["en","English"],"15",false]]),
      "sourceLanguage"          : "en",
      "targetLanguage"          : "ru",
      "translatedWordStyle"     : "color: #fe642e;\nfont-style: normal;",
      "userBlacklistedWords"    : "(this|that)",
      "translationProbability"  : 15,
      "minimumSourceWordLength" : 3,
      "userDefinedTranslations" : '{"the":"the", "a":"a"}'
    }
    for(var name in ls){
      if(S(name) == null || S(name) == "undefined"){ localStorage[name] = ls[name] }
    }
    restore_options(); // Restore when everything's been fixed
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('save-button').addEventListener('click', save_options);
    document.getElementById("addTranslationBtn").addEventListener("click", createPattern);
    document.getElementById("translatedWordStyle").addEventListener("keyup", showCSSResults);
  });

  /***
  * Text: String, what you'd like it to say
  * Duration: int, how long before it disapears
  * Fade: int, how long before it'd completely hidden (I'd recommend this to be lower than duration time)
  */
  function status(text, duration, fade){
    (function(text, duration, fade){
      var status = document.createElement("div");
          status.className = "alert alert-success";
          status.innerText = text;
          document.getElementById("status").appendChild(status);

      setTimeout(function(){
        var opacity = 1,
            ntrvl = setInterval(function(){
              if(opacity <= 0.01){ clearInterval(ntrvl); document.getElementById("status").removeChild(status); }
              status.style.opacity = opacity;
              opacity -= (1 / fade);
            }, 1)
      }, (duration - fade))
      console.log(text);
    })(text, duration, fade)
  }

  function showCSSResults(){
    if(!oldNum){ var oldNum = 0 }
    var synonyms = ["awesome", "magnificent", "fabolous", "impressive", "great",
                    "beautiful", "amazing", "awe-inspiring", "astonishing", "astounding",
                    "noble", "formidable", "heroic", "spectacular", "important-looking",
                    "majestic", "dazzling", "splendid", "brilliant", "glorious"],
        num = Math.floor(Math.random()*synonyms.length);
    while(num == oldNum){ num = Math.floor(Math.random()*synonyms.length) } // We should not use the same word again. Now, should we?
    oldNum = num;
    document.getElementById("resultSpan").style.cssText = document.getElementById("translatedWordStyle").value;
    document.getElementById("resultSpan").innerText = synonyms[num];
  }
  
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

  // Saves options to localStorage.
  function save_options() {
    options = ["minimumSourceWordLength", "translatedWordStyle", "blacklist", "userDefinedTranslations", "userBlacklistedWords"];

    localStorage["activation"] = document.getElementById("activationOn").checked;

    for (index in options) {
      save(options[index]);
    }

    try { JSON.parse(S("userDefinedTranslations"));} 
    catch(e) {
      alert('Your options have been saved, but your user-defined translations are badly specified and therefore will not be used. Please provide your user-defined translations according to the following format:\n\n {"word1":"translation1", "word2":"translation2", "word3":"translation3", "word4":"translation4"}');
    }
	
    // Update status to let user know options were saved.
    status("Options Saved", 1500, 100);
  }

  // Create new translation pattern
  function createPattern(){
    var pttrns = JSON.parse(localStorage["savedPatterns"]),
        src = new Array(),
        trg = new Array(),
        prb = new Array();

    src[0] = document.getElementById("sourceLanguage");
    src[1] = src[0].children[src[0].selectedIndex].value;
    src[2] = src[0].children[src[0].selectedIndex].text;
    trg[0] = document.getElementById("targetLanguage");
    trg[1] = trg[0].children[trg[0].selectedIndex].value;
    trg[2] = trg[0].children[trg[0].selectedIndex].text;
    prb[0] = document.getElementById("translationProbability");
    prb[1] = prb[0].children[prb[0].selectedIndex].value;

    pttrns.push([[src[1], src[2]],
                 [trg[1], trg[2]],
                 prb[1],
                 false
                ]);
    localStorage["savedPatterns"] = JSON.stringify(pttrns);
    restorePatterns();
    status("New translation configuration created", 1500, 100);
  }

  // Restore those old patterns
  function restorePatterns(){
    document.getElementById("savedTranslationPatterns").innerHTML = "";
    var pttrns = JSON.parse(localStorage["savedPatterns"]),
        html = "";

    for(var i in pttrns){
      html += "<p class='alert alert-"+((pttrns[i][3] && S("activation") == "true") ? "success" : "nothing")+" tPattern'> \
                Translate approx. \
                <span class='label label-info'>"+pttrns[i][2]+"%</span> \
                of all \
                <span class='label label-info'>"+pttrns[i][0][1]+"</span> \
                words into \
                <span class='label label-info'>"+pttrns[i][1][1]+"</span> \
                <button class='btn btn-danger pull-right deletePattern'>Delete</button>\
                <input type='hidden' value='"+i+"' />\
              </p>";
    }

    html += "<p class='alert alert-"+((S("activation") == "false") ? "success" : "nothing")+" tPattern'> \
              Do not translate \
              <input type='hidden' value='-1' \
            </p>";

    document.getElementById("savedTranslationPatterns").innerHTML = html;
    var pttrns = document.getElementsByClassName("tPattern");
    for(var i=0; i<pttrns.length; i++){ pttrns[i].addEventListener("click", activatePattern); }
    var delPattern = document.getElementsByClassName("deletePattern");
    for(var i=0; i<delPattern.length; i++){ delPattern[i].addEventListener("click", deletePattern); }
  }

  // I don't like that pattern
  function deletePattern(e){
    e.stopPropagation();
    var _id = this.parentNode.getElementsByTagName("input")[0].value,
        pttrns = JSON.parse(localStorage["savedPatterns"]),
        moveTrue = false; // Are you deleting active one?
    
    if(pttrns.length > 1){
      if(pttrns[_id][3]){ moveTrue = true; }
      pttrns.splice(_id,1);
      if(moveTrue){ pttrns[0][3] = true; }
      localStorage["savedPatterns"] = JSON.stringify(pttrns);
      restorePatterns();
      status("Pattern deleted", 1500, 100); 
    }
  }

  // Pattern, activate!
  function activatePattern(){
    var _id = this.getElementsByTagName("input")[0].value,
        pttrns = JSON.parse(localStorage["savedPatterns"]);

    if (_id == -1) {
      localStorage["activation"] = "false";
      status("Translation was deactivated", 1500, 100);
    }
    else {
      localStorage["activation"] = "true";

      var selectedPattern = pttrns[_id],
          o = ["sourceLanguage", "targetLanguage", "translationProbability"];      
      
      localStorage[o[0]] = selectedPattern[0][0];
      localStorage[o[1]] = selectedPattern[1][0];
      localStorage[o[2]] = selectedPattern[2];

      status("Selected translation configuration was activated", 1500, 100);
    }

    for(var i in pttrns){ pttrns[i][3] = (i == _id ? true : false); }
    localStorage["savedPatterns"] = JSON.stringify(pttrns);

    restorePatterns();
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
    options = ["sourceLanguage", "targetLanguage", "translationProbability", 
               "minimumSourceWordLength", "translatedWordStyle", "blacklist",
               "userDefinedTranslations", "userBlacklistedWords"];

    for (index in options) {
      console.log("Restoring:", options[index]);
      restore(options[index]);
    }
    restorePatterns();
  }

  google_analytics('UA-1471148-14');  
}