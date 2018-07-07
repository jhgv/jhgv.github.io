var toggleSection = function(el, targetId) {
    if(el.checked) {
        document.getElementById(targetId).style.display = "block";
    } else {
        document.getElementById(targetId).style.display = "none";
    }
}

var chooseState = function(option) {

    clearMap();
    filters.state = option.value;
    loadCollegeData();
    // if(option.value == "ALL") {
    //   loadMapAndPlot();
    // } else {
    //   loadStates(null, option.value);
    // }    
}

var setAdmissionRate = function() {
    var admissionRateEl = document.getElementById("admissionRateRange");
    var admissionRateValueEl = document.getElementById("admr");
    admissionRateValueEl.innerHTML = admissionRateEl.value + " %";

    var filteredCollegeData = collegeData.filter(function(d) {
        var admRate = parseFloat(d.ADM_RATE);
        var admRateInputValue = parseFloat(admissionRateEl.value) / 100.0;
        var validValues =  !isNaN(admRate) && !isNaN(admRateInputValue);
        return validValues && admRate <= admRateInputValue;
    });

    clearMap();

    filteredCollegeData.forEach(function(d) {
        
        if(d.LATITUDE != "NULL" && d.LONGITUDE != "NULL") {
            L.circle([d.LATITUDE, d.LONGITUDE], {
            color: "red",
            fillColor: "red",
            radius: 100,
            data: d          
            }).bringToFront().addTo(myCirlesLayerGroup).on("click", clickEvent);
        }
    });

    map.addLayer(myCirlesLayerGroup);
    // console.log(filteredCollegeData);
}