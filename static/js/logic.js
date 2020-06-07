// Create variable for URL and link to earthquake data   
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
// var url = 'static/js/earthquakes_data_json.geojson';
// Create variable to adjust circle size when zooming in and out
var zoomMap = 4

//  Load json data
d3.json(url,function(data){
console.log(data);

// Create circles for earthquake data 
function createCircles(feature,latlong){
      let options = {
          radius:feature.properties.mag*zoomMap,
          fillColor: getColor(feature.properties.mag),
          color: "brown",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.6
      }
      return L.circleMarker( latlong, options );

    }
// Create popups to display earthquake info
var earthQuakes = L.geoJSON(data,{
    onEachFeature: function(feature,layer){
        layer.bindPopup("Place:"+feature.properties.place + "<br> Magnitude: "+feature.properties.mag+"<br> Time: "+new Date(feature.properties.time));
    },
      pointToLayer: createCircles

});

createMap(earthQuakes);

});

function createMap(earthQuakes) {
  // Add layer for map
  var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });
 
  // Create variable and define map
  var myMap = L.map("map", {
    center: [
      37.383064, -109.071236
    ],
    zoom: zoomMap,
    layers: [lightMap, earthQuakes]
  });

  // console.log(myMap)

  // Create a legend for map
  var magLegend = L.control({
    position: "bottomright"
  });
  
  // Add earthquake magnitude legend to map
  magLegend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend"),
      labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
  
    for (var i = 0; i < labels.length; i++) {
      div.innerHTML += '<i style="background:' + getColor(i) + '"></i> ' +
              labels[i] + '<br>' ;
    }
    return div;
  };magLegend.addTo(myMap);
}
// Create function to set the color dependent on magnitude
function getColor(mag) {
  
  if (mag >= 5) {
    return "red";
  }
  else if (mag >= 4) {
    return "peru";
  }
  else if (mag >= 3) {
   return "darkorange";
  }
  else if (mag >= 2) {
    return "yellow";
  }
  else if (mag >= 1) {
    return "yellowgreen";
  }
  else {
    return "green";
  }
};
