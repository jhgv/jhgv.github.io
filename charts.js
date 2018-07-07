var svg = d3.select("#hist"),
    margin = {top: 40, right: 20, bottom: 30, left: 5},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var tooltip = d3.select("body").append("div").attr("class", "toolTip");

var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleBand().range([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var gTexts = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");    

d3.csv("http://localhost:8000/server/resources/college_data.csv", function(error, college_data) {
    if (error) throw error;
    college_data = college_data.filter(function(d) {
        return !isNaN(parseFloat(d.ADM_RATE));
    });
    
    var data = college_data.slice(0, 10);

    x.domain([0, d3.max(data, function(d) { return parseFloat(d.ADM_RATE); })]);
    y.domain(data.map(function(d) { return d.NAME; })).padding(0.3);

    g.append("g")
        .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5)
        .tickFormat(function(d) {
            return d;
        }).tickSizeInner([-height]));

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("fill", "rgb(256,150,130)")
        .attr("y", function(d) { return y(d.NAME); })
        .attr("width", function(d) {
            return x(parseFloat(d.ADM_RATE));
        })
        // .on("mousemove", function(d){
        //     tooltip
        //     .style("left", d3.event.pageX - 50 + "px")
        //     .style("top", d3.event.pageY - 70 + "px")
        //     .style("display", "inline-block")
        //     .html((d.NAME) + "<br>" + (parseFloat(d.ADM_RATE)));
        // })  
        // .on("mouseout", function(d){ tooltip.style("display", "none");});
        ;
    
    
    console.log(data);
    var texts = gTexts.selectAll("text")
        .data(data)
        .enter().append("text");
    
    
    texts.text(function(d) {return d.NAME})
        .attr("y", function(d) {
            return y(d.NAME) + 20;
        })
        .attr("x",10);    
});