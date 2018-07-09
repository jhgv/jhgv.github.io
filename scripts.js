var toggleSection = function(el, targetId, filterRelated) {
    if(el.checked) {
        document.getElementById(targetId).style.display = "block";
    } else {
        delete filters[filterRelated];
        document.getElementById(targetId).style.display = "none";
    }
    loadCollegeData();
}

var resetFilters = function() {
    filters = {};
    loadCollegeData();
}

var chooseState = function(option) {
    filters["STATE"] =  option.value;
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

var loadChart = function(el) {
    if(el.value == "AVG_FAM_INC") {
        loadFamilyIncomeChart(false);
        loadFamilyIncomeChart(true);
    } else if(el.value == "ADM_RATE") {
        loadAdmissionRateChart(false);
        loadAdmissionRateChart(true);
    }
    
}