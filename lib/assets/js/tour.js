// Instance the tour
var tour = new Tour({
    orphan: true,
    backdrop: true,
    steps: [
    {
        title: "Welcome To Mind The Word",
        content: "This tour will walk through the extension.",
        onNext: function(){
            document.getElementById("translation-settings-nav").click();
        }
    },
    {
        element: "#translation-settings-nav",
        title: "Translation Setting Tab",
        content: "You can set up which languages you want to learn from here."
    },
    {
        element: "#translator-keys",
        title: "Setting up Translator Keys",
        placement : "bottom",
        content: "First you need to set-up translation keys. MTW provides you with three options : Yandex, Bing and Google."
    },
    {
        element: "#create-new-pattern",
        placement : "bottom",
        title: "Creating a new language pattern",
        content: "Here, you can choose which service to use, as well as the language you wish to learn (Target Language)."
    },
    {
        element: "#manage-patterns",
        title: "Managing language patterns",
        placement : "bottom",
        content: "Once you have created a pattern, you can select which pattern to use from here.",
        onNext: function(){
            document.getElementById("blacklisting-nav").click();
        }
    },
    {
        element: "#blacklisting-nav",
        title: "Blacklist Setting Tab",
        content: "Let's explore the Blacklisting tab next.",
        onPrev : function(){
            document.getElementById("translation-settings-nav").click();
        }
    },
    {
        element: "#blacklist-website",
        placement : "right",
        title: "Blacklisting Websites",
        content: "If you do not want MTW to run on a particular domain, you can blacklist it from the Pop-Up Menu. You can manage the blacklisted websites from here."
    },
    {
        element: "#blacklist-words",
        placement : "left",
        title: "Blacklisting Words",
        content: "You can blacklist words from Hover-Card and manage them from here.",
        onNext: function(){
            document.getElementById("learning-nav").click();
        }
    },
    {
        element: "#learning-nav",
        title: "Learning Setting Tab",
        content: "Next, let's checkout the learning tab.",
        onPrev: function(){
            document.getElementById("blacklisting-nav").click();
        }
    },
    {
        element: "#saved-translations",
        placement : "right",
        title: "Saved Translations",
        content: "You can save words and their translations from the web. This allows you to build your very own mini-dictionary. Furthermore, you can limit the translations to this list only."
    },
    {
        element: "#learnt-words",
        placement : "right",
        title: "Learnt Words",
        content: "Once you have learnt the translation of a word, you can add mark it as learnt. These words will not be translated.",
        onNext: function(){
            document.getElementById("advanced-settings-nav").click();
        }
    },
    {
        element: "#advanced-settings-nav",
        title: "Advanced Setting Tab",
        content: "Options to change colour configurations, playback settings, user-defined translations and n-grams.",
        onPrev: function(){
            document.getElementById("learning-nav").click();
        },
        onNext: function(){
            document.getElementById("backup-nav").click();
        }
    },

    {
        element: "#backup-nav",
        title: "Backup Tab",
        content: "Use this tab to back-up, restore and delete your confifurations and keys.",
        onNext: function(){
            document.getElementById("quiz-nav").click();
        },
        onPrev: function(){
            document.getElementById("advanced-settings-nav").click();
        }
    },
    {
        element: "#quiz-nav",
        title: "Quiz Tab",
        content: "Once you have translated enought words, you will be able to take quizzes and test you knowledge.",
        onNext: function(){
            document.getElementById("statistics-nav").click();
        },
        onPrev: function(){
            document.getElementById("backup-nav").click();
        }
    },
    {
        element: "#statistics-nav",
        title: "Statistics Tab",
        placement : "bottom",
        content: "This tab provides overall statistics for the extension including total number of words translated, blacklisted words and websites etc.",
        onNext: function(){
            document.getElementById("contribute-nav").click();
        },
        onPrev: function(){
            document.getElementById("quiz-nav").click();
        }
    },
    {
        element: "#contribute-nav",
        title: "Contribute Tab",
        placement : "bottom",
        content: "If you wish to contribute or donate to Mind The Word, feel free to do so.",
        onNext: function(){
            document.getElementById("translation-settings-nav").click();
        },
        onPrev: function(){
            document.getElementById("statistics-nav").click();
        }
    },
    {
        title: "The End",
        content: "The tour has ended. Hope you like the extension.",
    }

  ]});
  
  // Initialize the tour
  tour.init();
  
  // Start the tour
  chrome.storage.local.get(['newInstallUpdate'], (result) => {
    if(result.newInstallUpdate){
        tour.restart(true);
    }
    chrome.storage.local.set({
        'newInstallUpdate': false
    });
  });