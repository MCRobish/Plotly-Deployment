function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("./static/data/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("./static/data/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("./static/data/samples.json").then((data) => {console.log(data);
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var selectSample = samples.filter(sampleObj => sampleObj.id == sample);

    //Create the variable that filters the metadata array for the object with the desired sample number (deliverable 3)
    let metadataSample = data.metadata.filter(metaObj => metaObj.id == sample);

    //create a variable that holds the first sample in the metadata array (Deliverable 3)
    let metadataResult = metadataSample[0];
    //  5. Create a variable that holds the first sample in the array.
    var first = selectSample[0];
    console.log(first);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = first.otu_ids;
    //console.log(otu_ids);
    var otu_labels = first.otu_labels;
    var sample_variables = first.sample_values.sort((a,b) => b-a);
    //console.log(sample_variables);
    //create washing frequency variable 
    var washFreq=parseFloat(metadataResult.wfreq)
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0,10).map(ID => `OTU ${ID}`);
    console.log(yticks);
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_variables,
      y: yticks,
      text: otu_labels,
      type: "bar",
      orientation: "h"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found",
    
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  //});

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_ids,
      y: sample_variables,
      mode: "markers",
      marker: {color: otu_ids, size: sample_variables,colorscale: 'YlGnBu',},
      text: otu_labels
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacterial Cultures per sample",
      xaxis: {title: "OTU ID"}
      
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble",bubbleData,bubbleLayout); 
 
    // 4. Create the trace for the gauge chart.
 var gaugeData = [{
  value: washFreq,
  type: "indicator",
  mode: "gauge+number",
  title: {text: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week", font: {size: 24}},
  gauge: {
    axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
    bar: { color: "black" },
    bgcolor: "white",
    borderwidth: 2,
    bordercolor: "gray",
    steps: [
      { range: [0, 2], color: "red" },
      { range: [2, 4], color: "orange" },
      {range: [4, 6], color: "yellow" },
      { range: [6, 8], color: "springgreen" },
      { range: [8, 10], color: "green" },

    ],
    }
  }
     
];

// 5. Create the layout for the gauge chart.
var layout = {
  margin: { t: 25, r: 25, l: 25, b: 25 },
  paper_bgcolor: "white",
  font: { color: "black", family: "Arial" }
};

// 6. Use Plotly to plot the gauge data and layout.
Plotly.newPlot("gauge",gaugeData,layout);
  });

};

