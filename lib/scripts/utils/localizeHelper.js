
 export function localizeHtmlPage(){
      //Localize by replacing __MSG_***__ meta tags
      var objects = document.querySelectorAll('[data-translate]');
      for (var j = 0; j < objects.length; j++)
      {
          var obj = objects[j];

          var valStrH = obj.innerHTML.toString();
          var dataVal = obj.getAttribute('data-translate');
          var valNewH = chrome.i18n.getMessage(dataVal);

          if(valNewH != valStrH)
          {
              obj.innerHTML = valNewH;
          }
      }
  }