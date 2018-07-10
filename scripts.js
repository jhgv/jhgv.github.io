var toggleSection = function(el, targetId, filterRelated) {
    if(el.checked) {
        document.getElementById(targetId).style.display = "block";
    } else {
        if(filterRelated == "PERC_DEG_") {
            delete filters[filterRelated + "INFO"];
            delete filters[filterRelated + "MIL"];
            delete filters[filterRelated + "BUS"];
        }else {
            delete filters[filterRelated];
        }
        
        document.getElementById(targetId).style.display = "none";
    }
    loadCollegeData();
}

var resetFilters = function() {
    var checkboxes = document.getElementsByTagName("input");
    for(var i = 0 ; i < checkboxes.length; i++) {
        if(checkboxes[i].type == "checkbox"){
            checkboxes[i].checked = false;
        }
    }
    document.getElementById("adm-rate-input").style.display = "none";
    document.getElementById("f-income-input").style.display = "none";
    document.getElementById("states").value = "ALL";
    filters = {};
    loadCollegeData();
}

var chooseState = function(option) {
    filters["STATE"] =  option.value;
    console.log(filters["STATE"]);
    if(filters["STATE"] == "ALL") {
        delete filters["STATE"];
    }
    loadCollegeData();
}

var setAdmissionRate = function() {
    var admissionRateEl = document.getElementById("admissionRateRange");
    var admissionRateValueEl = document.getElementById("admr");
    admissionRateValueEl.innerHTML = admissionRateEl.value + " %";

    var admRateInputValue = parseFloat(admissionRateEl.value) / 100.0;

    if(!isNaN(admRateInputValue)){
        filters["ADM_RATE"] = parseFloat(admissionRateEl.value) / 100.0;
    }
    loadCollegeData();
}

var setFamilyIncome = function() {
    var familyIncomeRangeEl = document.getElementById("familyIncomeRange");
    var familyIncomeValueEl = document.getElementById("f-income");
    familyIncomeValueEl.innerHTML = "$ " + numberWithCommas(parseFloat(familyIncomeRangeEl.value).toFixed(2));

    var familyIncomeInputValue = parseFloat(familyIncomeRangeEl.value);

    if(!isNaN(familyIncomeInputValue)){
        filters["AVG_FAM_INC"] = parseFloat(familyIncomeInputValue);
    }
    loadCollegeData();

}

var setWomenOnly = function(el) {
    if(el.checked) {
        filters["WOMEN_ONLY"] = 1;
    } else {
        delete filters["WOMEN_ONLY"];
    }
    
    loadCollegeData();
}

var setMenOnly = function(el) {
    if(el.checked) {
        filters["MEN_ONLY"] = 1;
    } else {
        delete filters["MEN_ONLY"];
    }
    
    loadCollegeData();
}

var setPredominantlyBlack = function(el) {
    if(el.checked) {
        filters["PRED_BLACK"] = 1;
    } else {
        delete filters["PRED_BLACK"];
    }
    loadCollegeData();
}

var setCompletionRate = function(el) {
    var completionRateEl = document.getElementById("completionRange");
    var completionRateValueEl = document.getElementById("f-completion");
    completionRateValueEl.innerHTML = completionRateEl.value + " %";

    var admRateInputValue = parseFloat(completionRateEl.value) / 100.0;

    if(!isNaN(admRateInputValue)){
        filters["AVG_COMPL_RATE"] = parseFloat(completionRateEl.value) / 100.0;
    }
    loadCollegeData();
}

var setDegreesAwarded = function(el){
    var degreeSelectEl = document.getElementById("degree");
    var degreeRateRangeEl = document.getElementById("f-degrees");
    degreeRateRangeEl.innerHTML = el.value + " %";   

    var percDegreeAwardedForCourse = parseFloat(el.value) / 100.0;

    delete filters["PERC_DEG_INFO"];
    delete filters["PERC_DEG_BUS"];
    delete filters["PERC_DEG_MIL"];

    if(!isNaN(percDegreeAwardedForCourse)){
        filters[degreeSelectEl.value] =  percDegreeAwardedForCourse;
    }
    loadCollegeData();

}

var loadChart = function(el) {
    if(el.value == "AVG_FAM_INC") {
        loadFamilyIncomeChart(false);
        loadFamilyIncomeChart(true);
    } else if(el.value == "ADM_RATE") {
        loadAdmissionRateChart(false);
        loadAdmissionRateChart(true);
    }
    
}