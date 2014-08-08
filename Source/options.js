var storage = chrome.storage.local;
var cachedStorage = {};

function e(id) {
  return document.getElementById(id);
}

$(function() {	
  var languageLoaded = function(){
    loadStorageAndUpdate(function(data) {
      initUi();
      updateUi(data);
    });
  };
  google.load("language", "1", {callback: languageLoaded});

  function setupListeners() {
    e("addTranslationBtn").addEventListener("click", createPattern);
    e("translatedWordStyle").addEventListener("keyup", showCSSExample);
    e("minimumSourceWordLength").addEventListener("blur", save_minimumSourceWordLength);
    e("translatedWordStyle").addEventListener("blur", save_translatedWordStyle);
    e("blacklist").addEventListener("blur", save_blacklist);
    e("userDefinedTranslations").addEventListener("blur", save_userDefinedTranslations);
    e("userBlacklistedWords").addEventListener("blur", save_userBlacklistedWords);
  }

  function initUi() {
    setLanguages();
    setupListeners();
  }

  //Sets Languages
  function setLanguages(){
    var languages = google.language.Languages
    var targetLanguageOptions = " "
    for(var language in languages) {
      var name = language.substring(0, 1) + language.substring(1).toLowerCase().replace('_', ' - ');
      targetLanguageOptions += '<option value="' + languages[language] + '">' + name + '</option>'
    }
    e("sourceLanguage").innerHTML = targetLanguageOptions;
    e("targetLanguage").innerHTML = targetLanguageOptions;
  }


  function updateUi(data) {
      console.log("Updating UI");
      restoreOptions(data);
      restorePatterns(data);
      showCSSExample();
  }

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
  



  

  function createPattern(){
    var pttrns = JSON.parse(S("savedPatterns")),
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
    saveBulk({"savedPatterns": JSON.stringify(pttrns)});
  }


  function restorePatterns(data){
    e("savedTranslationPatterns").innerHTML = "";
    var patterns = JSON.parse(data["savedPatterns"]);
    var patternsElem = $("#savedTranslationPatterns").html("");

    $.each(patterns, function(i, pattern) {
      var listElem = $("<p class='alert alert-"+((pattern[3] && !!data["activation"]) ? "success" : "nothing")+" tPattern'> \
                Translate \
                <span class='label label-info'>"+pattern[2]+"%</span> \
                of all \
                <span class='label label-info'>"+pattern[0][1]+"</span> \
                words into \
                <span class='label label-info'>"+pattern[1][1]+"</span> \
                <button class='btn btn-danger pull-right deletePattern'>Delete</button>\
                <input type='hidden' value='"+i+"' />\
              </p>");
      listElem.click(function() {
        activatePattern(i, patterns);
      });
      listElem.find('.deletePattern').click(function(e) {
        deletePattern(i, patterns, e);
      });
      patternsElem.append(listElem);
    });

    var nonElem = $("<p class='alert alert-"+((!data["activation"]) ? "success" : "nothing")+" tPattern'> \
              Do not translate \
              <input type='hidden' value='-1' \
            </p>");
    nonElem.click(function() {
      activatePattern(-1, data);
    });
    patternsElem.append(nonElem);
  }


  function deletePattern(index, patterns, e){
    e.stopPropagation();
    var _id = index,
        moveTrue = false; // Are you deleting the active pattern?
    
    if(patterns.length > 1){
      if(patterns[_id][3]) { 
        moveTrue = true;
      }
      patterns.splice(_id,1);
      if(moveTrue){
        patterns[0][3] = true;
        activatePattern(0, patterns);
      } else {
        saveBulk({"savedPatterns": JSON.stringify(patterns)});
      }
    }
  }

  function activatePattern(index, patterns){
    var _id = index;

    var toSave = {};
    if (_id == -1) {
      toSave["activation"] = false;
    } else {
      toSave["activation"] = true;

      var selectedPattern = patterns[_id];      
      
      toSave["sourceLanguage"] = selectedPattern[0][0];
      toSave["targetLanguage"] = selectedPattern[1][0];
      toSave["translationProbability"] = selectedPattern[2];
    }

    for(var i in patterns){ patterns[i][3] = (i == _id ? true : false); }
    toSave["savedPatterns"] = JSON.stringify(patterns);
    saveBulk(toSave);
  }


  function restoreOptions(data) {
    var options = ["sourceLanguage", "targetLanguage", "translationProbability", 
               "minimumSourceWordLength", "translatedWordStyle", "blacklist",
               "userDefinedTranslations", "userBlacklistedWords"];

    for (index in options) {
      restore(options[index], data);
    }
  }

  function restore(option, data) {
    var elem = e(option);
    var type = elem.tagName.toLowerCase();

    console.debug("Restore " + option + " to: " + data[option]);

    if (type == "select") {
      for (var i = 0; i < elem.children.length; i++) {
        var child = elem.children[i];
        if (child.value == data[option]) {
          child.selected = "true";
          break;
        }
      }
    } else {
      elem.value = data[option];
    }   
  }
















  /** Storage **/
  function S(key) { return cachedStorage[key]; } 

  function loadStorageAndUpdate(callback) {
    storage.get(null, function(data) {
      console.log("Loaded storage");
      cachedStorage = data;
      if (!!callback) {
        callback(data);
      } 
    });
  }

  function saveBulk(data, message) {
    storage.set(data, function() {
      statusDefault(message);
      loadStorageAndUpdate(function(data) {
        updateUi(data);
      });
    });
  }

  function save(id, message) {
    var elem = e(id);
    
    var v;
    if (elem.tagName.toLowerCase() == "select") {
      v = elem.children[elem.selectedIndex].value;    
    }
    else {
      v = elem.value; 
    }
    console.log("Saving "+id+" as "+v);
    if (cachedStorage[id] != v) {
      var map = {};
      map[id] = v;
      saveBulk(map, message);
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


  google_analytics('UA-1471148-14');  
});
