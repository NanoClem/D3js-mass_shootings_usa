var margin = { top: 20, right: 20, bottom: 70, left: 40 },
    Bwidth = 600 - margin.left - margin.right,
    Bheight = 300 - margin.top - margin.bottom;

let Branges = [
    { label: "10-15", sub: [10, 15], count: 0 },
    { label: "16-21", sub: [16, 21], count: 0 },
    { label: "22-30", sub: [22, 30], count: 0 },
    { label: "31-40", sub: [31, 40], count: 0 },
    { label: "41-70", sub: [41, 70], count: 0 }
];

var x = d3.scale.ordinal().rangeRoundBands([0, Bwidth], .05);
var y = d3.scale.linear().range([Bheight, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(6);

var Bsvg = d3.select("#age_balance").append("svg")
    .attr("width", Bwidth + margin.left + margin.right)
    .attr("height", Bheight + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

d3.dsv(';')("datasets/mass-shootings-in-america.csv", function (error, data) {

    Branges = countBarOccurences(Branges, data);
    x.domain([10, 70]);
    y.domain([0, d3.max(data, function (d) { return d.Average_Shooter_Age; })]);

    Bsvg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + Bheight + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)");

    Bsvg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Value ($)");

    Bsvg.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .style("fill", "steelblue")
        .attr("x", function (Branges) { return x(Branges.count); })
        .attr("width", x.rangeBand())
        .attr("y", function (Branges) { return y(Branges.count); })
        .attr("height", function (Branges) { return Bheight - y(Branges.count); });

});