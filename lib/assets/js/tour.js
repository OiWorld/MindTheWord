// Instance the tour
var tour = new Tour({
    steps: [
    {
      element: "#my-element",
      title: "Title of my step",
      content: "Content of my step"
    }
  ]});
  
  // Initialize the tour
  tour.init();
  
  // Start the tour
  tour.start(true);