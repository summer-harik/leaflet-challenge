// creating the map
let myMap = L.map("map", {
    center: [50.1, -128.5],
    zoom: 2
});

// add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// store the url variable
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"

// get the data with d3
d3.json(url).then(function(response) {

    let features = response.features;

    // loop thru the data *received help from BCS LA
    for (let i = 0; i < features.length; i++) {
        
        let location = features[i].geometry;

        let properties = features[i].properties;

        let magnitude = properties.mag;

        let depth = location.coordinates[2];
        
        // create function for the marker size to be based on the magnitude *found on Stack Overflow
         function depthColor(depth) {
            return depth >= 90 ? "#000000" :
            depth < 90 && depth >= 70 ? "#702963" :
            depth < 70 && depth >= 50 ? "#7f1734":
            depth < 50 && depth >= 30 ? "#bd33a4" :
            depth < 30 && depth >= 10 ? "#d891ef" :
                                        "#e6e6fa";
         }

        // check for the location
        if (location) {
            // add a new marker
            L.circle([location.coordinates[1], location.coordinates[0]], {
                color: depthColor(depth),
                fillColor: depthColor(depth),
                fillOpacity: 0.75,
                radius: magnitude * 40000
            }).bindPopup(`<h1> Place: ${features[i].properties.place}</h1> <hr> <h3> Magnitude ${magnitude}</h3> <hr> <h3> Depth ${depth}</h3>`).addTo(myMap);
        }
    }
// create the legend
 let legend = L.control({ position: "bottomright" });
 legend.onAdd = function() {
   let div = L.DomUtil.create("div", "info legend");
   let steps = [5, 10, 30, 50, 70, 90]
   let colors = ["#e6e6fa", "#d891ef", "#bd33a4", "#7f1734", "#702963", "#000000"];
   let labels = [];

   let legendInfo = "<h3>Depth of Earthquake</h3>" 

   div.innerHTML = legendInfo;

   steps.forEach(function(limit, index) {
     labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
   });

   
   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
   return div;
 };

 // Adding the legend to the map
 legend.addTo(myMap);
});