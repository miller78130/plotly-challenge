function init() {
    // Read in data file
    d3.json("samples.json").then(function(data) {
        // Grab values for dropdown and default charts
        var ids = data.names;
        var sample = data.samples[0];
        var sample_values = sample.sample_values;
        var otu_ids = sample.otu_ids;
        var otu_labels = sample.otu_labels;
        var metadata = data.metadata[0];
        var wash_Freq = metadata.wfreq
        // console.log(otu_ids);

        // Populate drop down
        var counter = 0;
        ids.forEach(function(id) {
        d3.select("#selDataset").append("option").attr("value", `${counter}`).text(id);
        counter +=1;
        })

        // Bar graph
        // Limit data to top 10 and reverse order
        let top_Sample_values = sample_values.slice(0,10).reverse();
        let top_Otu_ids = otu_ids.slice(0,10).reverse();
        let top_Otu_labels = otu_labels.slice(0,10).reverse();
        // console.log(top_Otu_labels);

        // OTU to OTU ids
        let string_Otu_ids = []
        top_Otu_ids.forEach(function(num) {
            string_Otu_ids.push(`OTU ${num}`);
        });
        // console.log(string_Otu_ids);

        // bar graph
        var data = [{
        type: "bar",
        orientation: "h",
        x: top_Sample_values,
        y: string_Otu_ids,
        text: top_Otu_labels,
        marker: {color: ["#87CEFA", "#ADD8E6", "#87CEEB", "#7FB3D5", "#00BFFF", "#1E90FF", "#0000FF", "#00008B", "#000080", "#191970"]}
        }]

        var layout = {
            title: {text: "Top 10 Bacteria Cultures Found", font: {size: 20}},
            xaxis: {title: "Total in Sample"}
        }

        Plotly.newPlot("bar", data, layout);

        //Bubble Chart
        var data = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                color: otu_ids,
                size: sample_values
            }
        }];

        var layout = {
            title: {text: "Bacteria Cultures per sample", font: {size: 24}},
            xaxis: {title: "OTU id"}
        }
    
        Plotly.newPlot("bubble", data, layout);

        // Demographics
        // console.log(metadata)
        Object.entries(metadata).forEach(([key,value]) =>
            d3.select("#sample-metadata").append("p").attr("style", "font-weight: bold").text(`${key}: ${value}`));
            
         // ** BONUS **   
            var data = [
                {
                  type: "indicator",
                  mode: "gauge",
                  value: wash_Freq,
                  title: {text: "Scrubs per Week", font: {size: 24}},
                  gauge: {
                    axis: { 
                        range: [0, 9], 
                        tickmode: "linear",
                        tick0: 0,
                        dtick: 1,
                        tickwidth: 2
                    },
                    bar: { color: "Lime"},
                    borderwidth: 2,
                    bordercolor: "gray",
                    steps: [
                      {range: [0, 1], color: "#E8F6F3"},
                      {range: [1, 2], color: "#D0ECE7"},
                      {range: [2, 3], color: "#A2D9CE"},
                      {range: [3, 4], color: "#73C6B6"},
                      {range: [4, 5], color: "#45B39D"},
                      {range: [5, 6], color: "#16A085"},
                      {range: [6, 7], color: "#138D75"},
                      {range: [7, 8], color: "#117A65"},
                      {range: [8, 9], color: "#0E6655"}
                    ]
                  }
                }
              ];
            
            var layout = {
                title: "Belly Button Washing Frequency", font: {size: 18}
            }
              
              Plotly.newPlot("gauge", data, layout);
            });
        
};


//Build event listener
function optionChanged() {
    // Assign value to variable (value is id's index inside samples list)
    var selection = d3.select("#selDataset").property("value");
    console.log(selection);

    // Read in data file again
    d3.json("samples.json").then(function(data) {
        // Grab values for updated charts
        var sample = data.samples[`${selection}`];
        var sample_values = sample.sample_values;
        var otu_ids = sample.otu_ids;
        var otu_labels = sample.otu_labels;
        var metadata = data.metadata[`${selection}`];
        var wfreq = metadata.wfreq
        console.log(sample);

        // Rebuild Bar chart data
        // Limit data to top 10 and reverse order
        let top_Sample_values = sample_values.slice(0,10).reverse();
        let top_Otu_ids = otu_ids.slice(0,10).reverse();
        let top_Otu_labels = otu_labels.slice(0,10).reverse();

        // Add OTU to OTU ids
        let string_Otu_ids = []
        top_Otu_ids.forEach(function(num) {
            string_Otu_ids.push(`OTU ${num}`);
        });

        // Restyle bar chart
        Plotly.restyle("bar", "x", [top_Sample_values]);
        Plotly.restyle("bar", "y", [string_Otu_ids]);
        Plotly.restyle("bar", "text", [top_Otu_labels]);

        //Restyle Bubble Chart
        Plotly.restyle("bubble", "x", [otu_ids]);
        Plotly.restyle("bubble", "y", [sample_values]);
        Plotly.restyle("bubble", "text", [otu_labels]);
        Plotly.restyle("bubble", "marker.color", [otu_ids]);
        Plotly.restyle("bubble", "marker.size", [sample_values]);

        // Update Demographics
        //Clear previous data
        d3.select("#sample-metadata").selectAll("p").remove();

        // Add new data
        Object.entries(metadata).forEach(([key,value]) =>
            d3.select("#sample-metadata").append("p").attr("style", "font-weight: bold").text(`${key}: ${value}`));

        // Restyle Gauge Chart
        Plotly.restyle("gauge", "value", [wfreq]);

    });  
};

init();