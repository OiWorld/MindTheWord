function e(id) {
  return document.getElementById(id);
}

function options() {
	
  google.load("language", "1");

  window.onload = init;
  function init(){
	  set_languages();
    restore_options();
    showCSSExample();
  }

  document.addEventListener("DOMContentLoaded", function () {
    e("addTranslationBtn").addEventListener("click", createPattern);
    e("translatedWordStyle").addEventListener("keyup", showCSSExample);
    e("minimumSourceWordLength").addEventListener("blur", save_minimumSourceWordLength);
    e("translatedWordStyle").addEventListener("blur", save_translatedWordStyle);
    e("blacklist").addEventListener("blur", save_blacklist);
    e("userDefinedTranslations").addEventListener("blur", save_userDefinedTranslations);
    e("userBlacklistedWords").addEventListener("blur", save_userBlacklistedWords);
  });

  /***
  * Text: String, what you'd like it to say
  * Duration: int, how long before it disappears
  * Fade: int, how long before it'd completely hidden (I'd recommend this to be lower than duration time)
  * Type: "success", "error", ...
  */
  function status(text, duration, fade, type) {
    (function(text, duration, fade){
      var status = document.createElement("div");
          status.className = "alert alert-" + type;
          status.innerText = text;
          e("status").appendChild(status);

      setTimeout(function(){
        var opacity = 1,
            ntrvl = setInterval(function(){
              if(opacity <= 0.01){ clearInterval(ntrvl); e("status").removeChild(status); }
              status.style.opacity = opacity;
              opacity -= (1 / fade);
            }, 1)
      }, (duration - fade))
      console.log(text);
    })(text, duration, fade)
  }
  function statusDefault(text) {
    status(text, 1500, 100, "success");
  }

  function showCSSExample(){
    if(!oldNum){ var oldNum = 0 }
    var synonyms = ["awesome", "magnificent", "fabulous", "impressive", "great",
                    "beautiful", "amazing", "awe-inspiring", "astonishing", "astounding",
                    "noble", "formidable", "heroic", "spectacular", "important-looking",
                    "majestic", "dazzling", "splendid", "brilliant", "glorious"],
        num = Math.floor(Math.random()*synonyms.length);
    while(num == oldNum){ num = Math.floor(Math.random()*synonyms.length) } // We should not use the same word again. Now, should we?
    oldNum = num;
    e("resultSpan").style.cssText = e("translatedWordStyle").value;
    e("resultSpan").innerText = synonyms[num];
  }
  
  //Sets Languages
  function set_languages(){
    var languages = google.language.Languages
    var targetLanguageOptions = " "
    for(var language in languages) {
      var name = language.substring(0, 1) + language.substring(1).toLowerCase().replace('_', ' - ');
      targetLanguageOptions += '<option value="' + languages[language] + '">' + name + '</option>'
    }
    e("sourceLanguage").innerHTML = targetLanguageOptions;
    e("targetLanguage").innerHTML = targetLanguageOptions;
  }

  function S(key) { return localStorage[key]; } 

  function save(id, message) {
    var elem = e(id);
    
    var v;
    if (elem.tagName.toLowerCase() == "select") {
      v = elem.children[elem.selectedIndex].value;    
    }
    else {
      v = elem.value; 
    }

    if (localStorage[id] != v) {
      localStorage[id] = v;
      statusDefault(message);
    }
  }

  // Save to localStorage.
  function save_userDefinedTranslations() {
    try { 
      JSON.parse(e("userDefinedTranslations").value);
      save("userDefinedTranslations", "User-defined translations saved");
    } 
    catch(e) {
      console.debug(S("userDefinedTranslations"))
      status('Your user-defined translations are badly specified and therefore will not be used. \
              Please provide your user-defined translations according to the following format: \
              \n\n {"word1":"translation1", "word2":"translation2", "word3":"translation3", "word4":"translation4"}', 9000, 600, "error");
    }
  }


  function save_minimumSourceWordLength() {
    // ToDo: Implement validation
    save("minimumSourceWordLength", "Minimum word length saved");
  }

  function save_translatedWordStyle() {
    // ToDo: Implement validation
    save("translatedWordStyle","Translated word style saved");
  }

  function save_blacklist() {
    // ToDo: Implement validation
    save("blacklist", "Blacklist saved");
  }

  function save_userBlacklistedWords() {
    // ToDo: Implement validation
    save("userBlacklistedWords", "Blacklisted words saved");
  }

  

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
    statusDefault("New translation configuration created");
  }


  function restorePatterns(){
    e("savedTranslationPatterns").innerHTML = "";
    var pttrns = JSON.parse(localStorage["savedPatterns"]),
        html = "";

    for(var i in pttrns){
      html += "<p class='alert alert-"+((pttrns[i][3] && S("activation") == "true") ? "success" : "nothing")+" tPattern'> \
                Translate \
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

    e("savedTranslationPatterns").innerHTML = html;
    var pttrns = document.getElementsByClassName("tPattern");
    for(var i=0; i<pttrns.length; i++){ pttrns[i].addEventListener("click", activatePattern); }
    var delPattern = document.getElementsByClassName("deletePattern");
    for(var i=0; i<delPattern.length; i++){ delPattern[i].addEventListener("click", deletePattern); }
  }


  function deletePattern(c){
    c.stopPropagation();
    var _id = this.parentNode.getElementsByTagName("input")[0].value,
        pttrns = JSON.parse(localStorage["savedPatterns"]),
        moveTrue = false; // Are you deleting the active pattern?
    
    if(pttrns.length > 1){
      if(pttrns[_id][3]){ moveTrue = true; }
      pttrns.splice(_id,1);
      if(moveTrue){ pttrns[0][3] = true; }
      localStorage["savedPatterns"] = JSON.stringify(pttrns);
      restorePatterns();
    }
  }

  function activatePattern(){
    var _id = this.getElementsByTagName("input")[0].value,
        pttrns = JSON.parse(localStorage["savedPatterns"]);

    if (_id == -1) {
      localStorage["activation"] = "false";
    }
    else {
      localStorage["activation"] = "true";

      var selectedPattern = pttrns[_id];      
      
      localStorage["sourceLanguage"] = selectedPattern[0][0];
      localStorage["targetLanguage"] = selectedPattern[1][0];
      localStorage["translationProbability"] = selectedPattern[2];
    }

    for(var i in pttrns){ pttrns[i][3] = (i == _id ? true : false); }
    localStorage["savedPatterns"] = JSON.stringify(pttrns);

    restorePatterns();
  }


  function restore_options() {
    fixLocalStorage();

    var options = ["sourceLanguage", "targetLanguage", "translationProbability", 
               "minimumSourceWordLength", "translatedWordStyle", "blacklist",
               "userDefinedTranslations", "userBlacklistedWords"];

    for (index in options) {
      console.log("Restoring:", options[index]);
      restore(options[index]);
    }
    restorePatterns();
  }

    // Fix any localStorage if needed
  function fixLocalStorage(){
    console.debug("fixLocalStorage");

    var ls = { // localStorage
      "blacklist"               : "(stackoverflow.com|github.com|code.google.com)",
      "activation"              : "true",
      "savedPatterns"           : JSON.stringify([[["en","English"],["ru","Russian"],"15",true], [["da","Danish"],["en","English"],"15",false]]),
      "sourceLanguage"          : "en",
      "targetLanguage"          : "ru",
      "translatedWordStyle"     : "color: #FE642E;\nfont-style: normal;",
      "userBlacklistedWords"    : "(this|that)",
      "translationProbability"  : 15,
      "minimumSourceWordLength" : 3,
      "userDefinedTranslations" : '{"the":"the", "a":"a"}'
    }
    for(var name in ls){
      if(S(name) == null || S(name) == "undefined" || S(name) == ""){ 
        console.log("Fixing: " + name);
        localStorage[name] = ls[name]; 
      }
    }
  }

  function restore(option) {
    console.debug("restore(" + option + ")");

    var elem = e(option);
    var type = elem.tagName.toLowerCase();

    console.debug("Value for " + option + "in localStorage is: " + S(option));

    if (type == "select") {
      for (var i = 0; i < elem.children.length; i++) {
        var child = elem.children[i];
        if (child.value == S(option)) {
          child.selected = "true";
          break;
        }
      }
    }
    else {
      elem.value = S(option);
    }   
  }

  google_analytics('UA-1471148-14');  
}