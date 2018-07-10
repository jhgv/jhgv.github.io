var svgBottom = d3.select("#bottomChart"),
    margin = {top: 0, right: 20, bottom: 30, left: 5},
    width = +svgBottom.attr("width") - margin.left - margin.right,
    height = +svgBottom.attr("height") - margin.top - margin.bottom;

var g = svgBottom.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var gTexts = svgBottom.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var svgTop = d3.select("#topChart"),
    margin = {top: 0, right: 20, bottom: 30, left: 5},
    width = +svgTop.attr("width") - margin.left - margin.right,
    height = +svgTop.attr("height") - margin.top - margin.bottom;

var gTop = svgTop.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var gTopTexts = svgTop.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var y = d3.scaleBand()
        .range([height, 0])
        .padding(0.1);

var x = d3.scaleLinear()
        .range([0, width]);

var xAxisCall = d3.axisBottom(x);
var yAxisCall = d3.axisLeft(y);


var topAxisPloted = false;
var bottomAxisPloted = false;

function loadAdmissionRateChart(desc) {
    var college_data = collegeData.filter(function(d) {
        return !isNaN(parseFloat(d.ADM_RATE)) && parseFloat(d.ADM_RATE) > 0;
    });

    if(!desc) {
        college_data.sort(function(a, b){
            return  parseFloat(a.ADM_RATE) - parseFloat(b.ADM_RATE);
        });
        data = college_data.slice(0,10);
    } else {
        college_data.sort(function(a, b){
            return  parseFloat(b.ADM_RATE) - parseFloat(a.ADM_RATE);
        });
        
    }

    var data = college_data.slice(0,10);

    // console.log(college_data);

    // set the ranges
    setAdmRateScale(data);

    if(desc) {
        if(!topAxisPloted) {
            initTopAxis();
        }else {
            updateTopAxis();
        }
    } else {
        if(!bottomAxisPloted){
            initBottomAxis();
        } else {
            updateBottomAxis();
        }
    }

    var rects ;

    if(desc) {
        rects = gTop.selectAll(".bar").data(data);
        
        rects.exit()
            .transition()
            .duration(300)
            .remove();
    } else {
        rects = g.selectAll(".bar").data(data);

        rects.exit()
            .transition()
            .duration(300)
            .remove();
    }

    rects
        .enter()
        .append("rect")
        .merge(rects)
        .attr("class", "bar")
        .attr("x", 1)
        .attr("height", y.bandwidth())
        .attr("fill", "#38B0DE")
        .attr("y", function(d) { return y(d.NAME); })
        .attr("width", function(d) {
            return x(parseFloat(d.ADM_RATE));
        })
        .on("click",clickRect);
    
    var texts;

    if(desc) {
        texts = gTopTexts.selectAll(".text")
            .remove()
            .exit()
            .data(data);
    } else {
        texts = gTexts.selectAll(".text")
            .remove()
            .exit()
            .data(data);
    }
        
    texts
        .enter()
        .append("text")
        .merge(texts)
        .attr("class", "text")
        .text(function(d) {return d.NAME})
        .attr("y", function(d) {
            return y(d.NAME) + 15;
        })
        .attr("x",10); 
}

function loadFamilyIncomeChart(desc) {

    var college_data = collegeData.filter(function(d) {
        return !isNaN(parseFloat(d.AVG_FAM_INC));
    });

    if(!desc) {
        college_data.sort(function(a, b){
            return  parseFloat(a.AVG_FAM_INC) - parseFloat(b.AVG_FAM_INC);
        });
        data = college_data.slice(0,10);
    } else {
        college_data.sort(function(a, b){
            return  parseFloat(b.AVG_FAM_INC) - parseFloat(a.AVG_FAM_INC);
        }); 
    }

    var data = college_data.slice(0,10);


    setFamIncomeScale(data);

    if(desc) {
        if(!topAxisPloted) {
            initTopAxis();
        }else {
            updateTopAxis();
        }
    } else {
        if(!bottomAxisPloted){
            initBottomAxis();
        } else {
            updateBottomAxis();
        }
    }

    var rects ;

    if(desc) {
        rects = gTop.selectAll(".bar").data(data);
        
        rects.exit()
            .transition()
            .duration(300)
            .remove();
    } else {
        rects = g.selectAll(".bar").data(data);

        rects.exit()
            .transition()
            .duration(300)
            .remove();
    }

    rects
        .enter()
        .append("rect")
        .merge(rects)
        .attr("class", "bar")
        .attr("x", 1)
        .attr("height", y.bandwidth())
        .attr("fill", "#38B0DE")
        .attr("y", function(d) { return y(d.NAME); })
        .attr("width", function(d) {
            return x(parseFloat(d.AVG_FAM_INC));
        })
        .on("click",clickRect);
    
    var texts;

    if(desc) {
        texts = gTopTexts.selectAll(".text")
            .remove()
            .exit()
            .data(data);
    } else {
        texts = gTexts.selectAll(".text")
            .remove()
            .exit()
            .data(data);
    }
        
    texts
        .enter()
        .append("text")
        .merge(texts)
        .attr("class", "text")
        .text(function(d) {return d.NAME})
        .attr("y", function(d) {
            return y(d.NAME) + 15;
        })
        .attr("x",10); 
}

function loadCompletionRateChart(desc) {

    var college_data = collegeData.filter(function(d) {
        return !isNaN(parseFloat(d.AVG_COMPL_RATE)) && parseFloat(d.AVG_COMPL_RATE) > 0;
    });

    if(!desc) {
        college_data.sort(function(a, b){
            return  parseFloat(a.AVG_COMPL_RATE) - parseFloat(b.AVG_COMPL_RATE);
        });
        data = college_data.slice(0,10);
    } else {
        college_data.sort(function(a, b){
            return  parseFloat(b.AVG_COMPL_RATE) - parseFloat(a.AVG_COMPL_RATE);
        }); 
    }

    var data = college_data.slice(0,10);

    setCompletionScale(data);

    if(desc) {
        if(!topAxisPloted) {
            initTopAxis();
        }else {
            updateTopAxis();
        }
    } else {
        if(!bottomAxisPloted){
            initBottomAxis();
        } else {
            updateBottomAxis();
        }
    }

    var rects ;

    if(desc) {
        rects = gTop.selectAll(".bar").data(data);
        
        rects.exit()
            .transition()
            .duration(300)
            .remove();
    } else {
        rects = g.selectAll(".bar").data(data);

        rects.exit()
            .transition()
            .duration(300)
            .remove();
    }

    rects
        .enter()
        .append("rect")
        .merge(rects)
        .attr("class", "bar")
        .attr("x", 1)
        .attr("height", y.bandwidth())
        .attr("fill", "#38B0DE")
        .attr("y", function(d) { return y(d.NAME); })
        .attr("width", function(d) {
            return x(parseFloat(d.AVG_COMPL_RATE));
        })
        .on("click",clickRect);
    
    var texts;

    if(desc) {
        texts = gTopTexts.selectAll(".text")
            .remove()
            .exit()
            .data(data);
    } else {
        texts = gTexts.selectAll(".text")
            .remove()
            .exit()
            .data(data);
    }
        
    texts
        .enter()
        .append("text")
        .merge(texts)
        .attr("class", "text")
        .text(function(d) {return d.NAME})
        .attr("y", function(d) {
            return y(d.NAME) + 15;
        })
        .attr("x",10); 
}

function initBottomAxis() {
    bottomAxisPloted = true;
    // add the x Axis
    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(xAxisCall);

    // add the y Axis
    g.append("g")
        .attr("class", "y axis")
        .call(yAxisCall);
}


function initTopAxis() {
    topAxisPloted = true;
    // add the x Axis
    gTop.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr("class", "x axis")
        .call(xAxisCall);

    // add the y Axis
    gTop.append("g")
        .attr("class", "y axis")
        .call(yAxisCall);
}


function setAdmRateScale(data) {
    x.domain([0, d3.max(data, function(d){ return d.ADM_RATE; })])
    y.domain(data.map(function(d) { return d.NAME; }));
    xAxisCall.scale(x);
    yAxisCall.scale(y);
}

function setFamIncomeScale(data) {
    x.domain([0, d3.max(data, function(d){ return d.AVG_FAM_INC; })])
    y.domain(data.map(function(d) { return d.NAME; }));
    xAxisCall.scale(x);
    yAxisCall.scale(y);
}

function setCompletionScale(data) {
    x.domain([0, d3.max(data, function(d){ return d.AVG_COMPL_RATE; })])
    y.domain(data.map(function(d) { return d.NAME; }));
    xAxisCall.scale(x);
    yAxisCall.scale(y);
}

function updateBottomAxis() {

    var t = d3.transition()
            .duration(500);
    
    g.select(".x")
        .transition(t)
        .call(xAxisCall)
    
    g.select(".y")
        .transition(t)
        .call(yAxisCall)
}

function updateTopAxis() {

    var t = d3.transition()
            .duration(500);
    
    gTop.select(".x")
        .transition(t)
        .call(xAxisCall)
    
    gTop.select(".y")
        .transition(t)
        .call(yAxisCall)
}

function clickRect(el, index) {
    var self = d3.select(this);
    var college = self.data()[0];
    var collegeCircle = findCollegeCircle(college);
    if (collegeCircle) {
        collegeCircle.openPopup();
    }
}

function findCollegeCircle(college) {
    var collegeCircle = null;
    collegeCircles.forEach(function(e){
        if(e.options.data.NAME == college.NAME) {
            collegeCircle =  e;
        }
    });
    return collegeCircle;
}