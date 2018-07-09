var US_CENTER_PROJECTION = [37.8, -96];
var US_STATES_GEOJSON_DATA = "server/resources/us_states_outline.geojson";
var US_COLLEGE_DATA = "server/resources/college_data.csv";

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

var collegeCircles = [];

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.light',
  accessToken: 'pk.eyJ1IjoiamhndiIsImEiOiJjamd2aDE0MXcweGplMzJwZG9ucWc2YXEwIn0.BgPWURJ8_bM6SUFvRcFvKQ'
}).addTo(map);


var filters = {
}

var inputsOk = false;

loadMapAndPlot();

function geoDataDottedHandler(error, data) {
  if (error) {
    console.log(error);
    return;
  }
  loadCircles(data);
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

function loadStates(data) {
  
  map.removeLayer(myCirlesLayerGroup);
  myCirlesLayerGroup.clearLayers();
  map.removeControl(legendLayer);
  if(data) {
    loadMapLayer(data);
    return;
  }
  loadCollegeData();
  
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
  
  loadCollegeData();

}

function loadCollegeData() {
  clearMap();
  d3.csv(US_COLLEGE_DATA, function(error, college_data) {

    // TODO: Remove after cleaning the csv file data
    // college_data = college_data.filter(function(d) {
    //   return !isNaN(parseFloat(d.ADM_RATE));
    // });

    if(!inputsOk) {
      occurencesByState = d3.nest()
      .key(function(d) {
        return d.STATE;
      })
      .entries(college_data);

      addSelectOptions("states", occurencesByState);

      var maxRate = d3.max(college_data, function(d) {
        return +parseFloat(d.ADM_RATE) * 100;
      });
      var minRate = d3.min(college_data, function(d) {
        return +parseFloat(d.ADM_RATE) * 100;
      });
      document.getElementById("admissionRateRange").max = maxRate;
      document.getElementById("admissionRateRange").min = minRate;

      var maxFamilyIncome = d3.max(college_data, function(d) {
        return +parseFloat(d.AVG_FAM_INC);
      });
      var minFamilyIncome = d3.min(college_data, function(d) {
        return +parseFloat(d.AVG_FAM_INC);
      });

      document.getElementById("familyIncomeRange").max = maxFamilyIncome;
      document.getElementById("familyIncomeRange").min = minFamilyIncome;
      inputsOk = true;

    }

    var filteredCollegeData = filterCollegeData(college_data);
    collegeData = filteredCollegeData.slice();

    filteredCollegeData.forEach(function(d) {
      if(d.LATITUDE != "NULL" && d.LONGITUDE != "NULL") {
        collegeCircles.push(
        L.circle([d.LATITUDE, d.LONGITUDE], {
          color: "red",
          fillColor: "red",
          radius: 500,
          data: d          
        }).bringToFront()
        .addTo(myCirlesLayerGroup)
        .bindPopup(getPopupValue(d)));
      }
    });

    if(document.getElementById("chart").value == "ADM_RATE") {
      loadAdmissionRateChart(false);
      loadAdmissionRateChart(true);
    } else if(document.getElementById("chart").value == "AVG_FAM_INC"){
      loadFamilyIncomeChart(false);
      loadFamilyIncomeChart(true);
    }
    
    // loadAdmissionRateChart(false);

    map.addLayer(myCirlesLayerGroup);
    d3.select("#collegeNumber").text(filteredCollegeData.length + " colleges plotted");

    // var collegeData = 
    
    // collegeData = college_data.filter(function(d) {
    //   return parseFloatOrFalse(d.ADM_RATE) == parseFloatOrFalse(filters.admission_rate);
    // });

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

/*
 * 
 *   HELPER FUNCTIONS
 *
*/

function clearMap() {
  map.removeLayer(myCirlesLayerGroup);
  myCirlesLayerGroup.clearLayers();
  map.removeControl(legendLayer);
}

function getValueOrFalse(value) {
  if(value != null && value != "" && value != "NULL" && value != "PrivacySuppressed") {
    return value;
  }
  return false;
}

function parseFloatOrFalse (value) {
  if(getValueOrFalse(value) != false && !isNaN(parseFloat(value))) {
    return value;
  }
  return false;
}


function addSelectOptions(elementId, options) {
  options.forEach(function(e){
    var option = document.createElement("option");
    option.value = e.key;
    option.id = e.key;
    option.text = e.key;
    document.getElementById(elementId).appendChild(option);
  });
}

function filterCollegeData(college_data) {
  
  var attributesToBeFiltered = Object.keys(filters);
  var filteredCollegeData = [];
  college_data.forEach(function(d){
      var attrMatches = 0;
      attributesToBeFiltered.forEach(function(attr){
        if(attr == "ADM_RATE" || attr == "AVG_FAM_INC") {
          if(filters[attr] >= parseFloat(d[attr])) {
            attrMatches++;
          }
        } else {
          if(filters[attr] == d[attr]) {
            attrMatches++;
          }
        } 
      });
      if(attrMatches == attributesToBeFiltered.length) {
        filteredCollegeData.push(d);
      }
  });

  return filteredCollegeData;
}

function isValidValue(value) {
  return value != null && value != "" && value != "NULL" && value != "PrivacySuppressed";
}


function getPopupValue(college) {
  var value = "<b>";
  value += college.NAME;
  value += "</b><br>";
  value += "City: " + college.CITY + "<br>";
  value += "Admission rate: " + (parseFloat(college.ADM_RATE) * 100) + "%<br>";
  value += "Family income: $ " + numberWithCommas ((parseFloat(college.AVG_FAM_INC).toFixed(2))) + "<br>";
  value += "Women only: " + (college.WOMEN_ONLY == "1" ? "Yes":"No") + "<br>";
  value += "Men only: " + (college.MEN_ONLY == "1" ? "Yes":"No") + "<br>";
  value += "Pred. black: " + (college.PRED_BLACK == "1" ? "Yes":"No") + "<br>";
  return value;
}

const numberWithCommas = (x) => {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
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


