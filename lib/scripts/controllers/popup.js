import angular from 'angular';
import $ from 'jquery';
import bootstrap from 'bootstrap';

/** Class for popup angular controller */
export class PopupCtrl {
  /**
   * Initialize activation data.
   * @constructor
   * @param {Object} $scope - Angular scope
   * @param {Object} $timeout - Angular timeout
   * @param {Object} $window - Angular window
   */
  constructor($scope, $timeout, $window) {
    this.$timeout = $timeout;
    this.$window = $window;
    this.$scope = $scope;
    
    chrome.storage.local.get(['activation', 'autoBlacklist', 'activationToggles', 'stats'], (data) => {
      this.activation = data.activation;
      this.stats = data.stats;
      this.autoBlacklist = data.autoBlacklist;
      this.activationToggles = data.activationToggles;
      this.$timeout(() => {
        this.$scope.$apply();
      });
      var node = document.createElement("LI");                 
	  var textnode = document.createTextNode("Words Translated : " + this.stats.totalWordsTranslated);         
	  node.appendChild(textnode);                              
	  document.getElementById("mtw_data_display").appendChild(node);
	  if(!this.activation){
	  	document.getElementById("mtw_data_display").style.display = "none";
	  }
    });
  }

  /**
   * Store user activation data to chrome local storage
   * @param {string} - activation value set by the user
   */
  setActivation(value) {
    if (this.activation !== value) {
      this.activation = value;
      chrome.storage.local.set({activation: value});
      chrome.tabs.getSelected(null, (tab) => {
        this.autoBlacklistWebsite(tab.url);
        var code = 'window.location.reload();';
        chrome.tabs.executeScript(tab.id, {code: code});
      });
    }
    if(value){
      document.getElementById("mtw_data_display").style.display = "block";
    }
    else{
      document.getElementById("mtw_data_display").style.display = "none";
    }
  }

  /**
   * Given a url, it checks whether a URL should be
   * blacklisted or not.
   * @param {string} - website URL
   */
  autoBlacklistWebsite(url) {
    if (this.autoBlacklist) {
      chrome.storage.local.get(['blacklist', 'activationFrequency'], (data) => {
        let blacklistURLs = data.blacklist.slice(1, -1).split('|'),
          activationFrequency = JSON.parse(data.activationFrequency),
          re = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im,
          domainName = url.match(re)[0];
        if (blacklistURLs.indexOf(domainName) > -1) {
          return;
        } else {
          if (domainName in activationFrequency) {
            if (activationFrequency[domainName] > this.activationToggles) {
              blacklistURLs.push(domainName);
              chrome.storage.local.set({
                'blacklist': '(' + blacklistURLs.join('|') + ')',
                'activationFrequency': JSON.stringify(activationFrequency)
              });
              delete activationFrequency[domainName];
            } else {
              activationFrequency[domainName] += 1;
              chrome.storage.local.set({'activationFrequency': JSON.stringify(activationFrequency)});
            }
          } else {
            activationFrequency[domainName] = 1;
            chrome.storage.local.set({'activationFrequency': JSON.stringify(activationFrequency)});
          }
        }

      });

    }
  }

  /**
   * Redirect user to options.html from popup
   */
  openOptions() {
    this.$window.open('options.html');
  }
  
  /**
   * Toggle all translated words on active tab.
   * Sends a message to the content script to run
   * its toggle function on the tab.
   */
  toggleTranslations() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {type: 'toggleAllElements'});
    });
  }

}

angular.module('MTWPopup', [])
  .controller('PopupCtrl', PopupCtrl);
