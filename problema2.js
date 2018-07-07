var US_CENTER_PROJECTION = [37.8, -96];
var US_STATES_GEOJSON_DATA = "http://localhost:8000/server/resources/us_states_outline.geojson";
var US_COLLEGE_DATA = "http://localhost:8000/server/resources/college_data.csv";

var RED_COLOR = "#FF0000";
var GREEN_COLOR = "#00FF00";
var BLUE_COLOR = "#0000FF";

var map = L.map('brasilMap').setView(US_CENTER_PROJECTION, 4);
var myCirlesLayerGroup = L.featureGroup();
var legendLayer = L.featureGroup();
var myGeoJsonLayerGroup = L.geoJson().addTo(map);
var myFeature = null;
var colorScale = null;
var numColleges = 0;

var occurencesByState = null;

var collegeData = [];

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.light',
  accessToken: 'pk.eyJ1IjoiamhndiIsImEiOiJjamd2aDE0MXcweGplMzJwZG9ucWc2YXEwIn0.BgPWURJ8_bM6SUFvRcFvKQ'
}).addTo(map);

function load(type) {
  if (type == 'municipio-circle') {

  }
}

loadMapAndPlot();

function geoDataDottedHandler(error, data) {
  if (error) {
    console.log(error);
    return;
  }
  loadCircles(data);
}

function geoDataStateColorHandler(error, data) {
  if (error) {
    console.log(error);
    return;
  }
  loadStates(data);
}

function loadMapLayer(geoJsonData) {
  my_data = geoJsonData;
  
  if (myFeature) {
    updateFeature(geoJsonData);
  } else {
    addNewFeatureToGeoJsonLayerGroup(geoJsonData);
  }
}

function addNewFeatureToGeoJsonLayerGroup(newGeoJsonData) {
  myFeature = L.geoJson(newGeoJsonData);
  myGeoJsonLayerGroup.addLayer(myFeature);
}

function updateFeature(updatedGeoJsonData) {
  myFeature.clearLayers(); // Remove the previously created layer.
  myFeature.addData(updatedGeoJsonData); // Replace it by the new data.
}

function loadStates(data, state) {
  
  map.removeLayer(myCirlesLayerGroup);
  myCirlesLayerGroup.clearLayers();
  map.removeControl(legendLayer);
  if(data) {
    loadMapLayer(data);
    return;
  }
  loadStateDataAndPlot(state);
  
}

function loadCircles(data) {
  
  map.removeControl(legendLayer);
  map.removeLayer(myCirlesLayerGroup);
  loadMapLayer(data);
  myFeature
    .bringToBack()
    .setStyle({
      weight: 0.3,
      color: '#0000cc',
      dashArray: '',
      fillOpacity: 0
    });
  
  loadStateDataAndPlot();

}

function loadStateDataAndPlot(state) {
  d3.csv(US_COLLEGE_DATA, function(error, college_data) {

    collegeData = college_data;

    college_data = college_data.filter(function(d) {
        return !isNaN(parseFloat(d.ADM_RATE));
    });

    var maxRate = d3.max(college_data, function(d) {
      return +parseFloat(d.ADM_RATE) * 100;
    });

     var minRate = d3.min(college_data, function(d) {
      return +parseFloat(d.ADM_RATE) * 100;
    });

    document.getElementById("admissionRateRange").max = maxRate;
    document.getElementById("admissionRateRange").min = minRate;

    occurencesByState = d3.nest()
      .key(function(d) {
        return d.STATE;
      })
      .entries(college_data);

    addSelectOptions("states", occurencesByState);

    numColleges = 0;

    

    if(state) {
      college_data.forEach(function(d) {
        if(state == d.STATE && d.LATITUDE != "NULL" && d.LONGITUDE != "NULL") {
          console.log(d.STATE);
          L.circle([d.LATITUDE, d.LONGITUDE], {
            color: "red",
            fillColor: "red",
            radius: 500,
            data: d          
          }).bringToFront().addTo(myCirlesLayerGroup).on("click", clickEvent);
        }
      });
    } else {
      college_data.forEach(function(d) {
        if(d.LATITUDE != "NULL" && d.LONGITUDE != "NULL") {
          L.circle([d.LATITUDE, d.LONGITUDE], {
            color: "red",
            fillColor: "red",
            radius: 500,
            data: d          
          }).bringToFront().addTo(myCirlesLayerGroup).on("click", clickEvent);
        }
      });
    }
    map.addLayer(myCirlesLayerGroup);
    d3.select("#collegeNumber").text(numColleges + " colleges plotted");
  });
}

function loadMapAndPlot() {
  d3.json(US_STATES_GEOJSON_DATA, geoDataDottedHandler);

}

function getClassificationColor(occurenceClassification) {
  if (occurenceClassification.toUpperCase() == "ACIDENTE") {
    return RED_COLOR;
  } else if (occurenceClassification.toUpperCase() == "INCIDENTE") {
    return BLUE_COLOR;
  } else {
    return GREEN_COLOR;
  }
}

/*
 *
 *  MAP DATA LOADERS
 *
*/

// function plotColoreStatesMap

/*
 * 
 *   HELPER FUNCTIONS
 *
*/


function addSelectOptions(elementId, options) {
  options.forEach(function(e){
    var option = document.createElement("option");
    option.value = e.key;
    option.id = e.key;
    option.text = e.key;
    document.getElementById(elementId).appendChild(option);
  });
}


/*
 * 
 *   EVENT FUNCTIONS
 *
*/

function clickEvent(e) {
  var college_data = e.target.options.data;
  alert(college_data.NAME);
}

function chooseState(option) {
  if(option.value == "ALL") {
    loadMapAndPlot();
  } else {
    loadStates(null, option.value);
  }
  
}