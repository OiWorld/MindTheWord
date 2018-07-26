// Instance the tour
var tour = new Tour({
    orphan: true,
    backdrop: true,
    steps: [
    {
        title: "Welcome To Mind The Word",
        content: "This tour will walk through the extension.",
    },
    {
        element: "#my-element",
        title: "Title of my step",
        content: "Content of my step"
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