var toggleSection = function(el, targetId) {
    if(el.checked) {
        document.getElementById(targetId).style.display = "block";
    } else {
        document.getElementById(targetId).style.display = "none";
    }
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
    familyIncomeValueEl.innerHTML = "$ " + parseFloat(familyIncomeRangeEl.value).toFixed(2);

    var familyIncomeInputValue = parseFloat(familyIncomeRangeEl.value);

    if(!isNaN(familyIncomeInputValue)){
        filters["AVG_FAM_INC"] = parseFloat(familyIncomeInputValue);
    }
    loadCollegeData();

}