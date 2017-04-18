$(function(){

  /* An array of colors we can use to highlight different data */
  var colors = [
    'yellow',
    'purple',
    'silver',
    'green',
    'red',
    'blue',
    'orange',
    'fuschia',
    'cyan'
  ]

  /** The Peer Review Chart
   *  This is a simple bar chart with labels and a key
   */
  // Grab the canvas and its context
  var peerReviewCanvas = $('#peer-review')[0];
  var peerReviewCtx = peerReviewCanvas.getContext('2d');

  // Draw the title for the peer review chart
  peerReviewCtx.strokeText("Peer Review", 10, 10);

  // Draw the scale for the peer review chart
  for(var i = 0; i < 11; i++) {
    // Draw the scale label
    peerReviewCtx.fillText(10 - i, 10, 30 + i * 20);
    // Draw the scale bar as segments in a path
    peerReviewCtx.moveTo(25, 30 + i * 20);
    peerReviewCtx.lineTo(90, 30 + i * 20);
  }
  // Draw a line along the path we've specified for the scale bars
  peerReviewCtx.stroke();

  // Retrieve the data to graph from the server
  $.ajax({
    url: '/peerReview.json',
    dataType: 'json',
    success: function(data) {
      // The keys in our JSON object are the categories
      var categories = Object.keys(data);
      // Draw each category's bar and labels
      categories.forEach(function(category, index){
        // The values in the JSON object are the scores
        var value = data[category];
        // Calculate the upper-left hand corner of the bar
        var x = 30 + index * 10;
        var y = 30 + (10-value) * 20;
        // Caclulate the height of the bar
        var height = value * 20;
        // Set the color to be different than prior bars
        peerReviewCtx.fillStyle = colors[index];
        // Draw the bar
        peerReviewCtx.fillRect(x, y, 5, height);
        // Draw the key's color box
        peerReviewCtx.fillRect(100, 80 + 20 * index, 10, 10);
        // Draw the category name in the key
        peerReviewCtx.strokeText(category, 120, 90 + 20 * index);
      });
    }
  })

  /** The Point Distribution chart
    * This is a pie chart with labels and a key
    */
  // Grab the canvas and its context
  var pointDistributionCanvas = $('#point-distribution')[0];
  var pointDistributionCtx = pointDistributionCanvas.getContext('2d');

  // Draw the title for the point distribution chart
  pointDistributionCtx.strokeText("Point Distribution", 10, 10);

  // Draw the point distribution graph
  $.ajax({
    url: '/pointDistribution.json',
    dataType: 'json',
    success: function(data) {
      // The keys in our JSON object correspond to team members
      var people = Object.keys(data);
      // We need to cacluate the total points for all team members
      // to determine the percentage of points each member has.
      // We'll use Array.prototype.reduce for this.
      var total = Object.values(data).reduce(function(acc, value){
        return acc + value;
      }, 0);
      // The first slice of the pie chart starts at 0 radians
      var start = 0;
      // Draw each person's slice and labels
      people.forEach(function(person, index){
        // Cacluate the percentage of the total points this person is responsible for
        var percent = data[person] / total;
        // Use the percent to determine the width of the pie slice in radians
        var end = start + percent * 2 * Math.PI;
        // Begin a new path (so that we don't draw over our old one)
        pointDistributionCtx.beginPath();
        // Move to the center of the pie
        pointDistributionCtx.moveTo(100, 100);
        // Draw the slice of our pie
        pointDistributionCtx.arc(100, 100, 80, start, end);
        // Set the color for the slice
        pointDistributionCtx.fillStyle = colors[index];
        // Fill the slice with that color
        pointDistributionCtx.fill();
        // Save the starting position for the next slice
        start = end;

        // Draw the key color
        pointDistributionCtx.fillRect(10, 200 + index * 15, 10, 10);
        pointDistributionCtx.strokeText(person, 25, 210 + index * 15);
      });
    }
  });

});
