/**
 * 
 * @param {*} width 
 * @param {*} height 
 * @param {*} radius 
 * @param {*} data 
 */
function generateMapDonut(width, height, data) {

    let radius = Math.min(width, height) / 2;

    // MAP DONUT SVG
    let svg = d3.select("#mapDonut")
        .attr("width", width)   
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    let div = d3.select("div.mapDonutTooltip");

    // GROUP ELEMENTS 
    svg.append("g")
        .attr("class", "MD_slices");
    svg.append("g")
        .attr("class", "MD_labels");
    svg.append("g")
        .attr("class", "MD_lines");


    let pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
            return d.count;
        });

    let arc = d3.svg.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);

    let outerArc = d3.svg.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

    let key = function (d) { return d.data.label; };


    // BEGIN DATA PROCESSING
    let domain = getLabels();
    let donutData = countOccurences(data);
    let color = generateColors(["#390B06", "#6F332D", "#17193C", "#647375", "#a3bcbf"], domain);

    // ASCENDING SORT
    let gData = donutData.sort(function(a, b) {
		return a.count - b.count;
    });
    
    
    change(gData);


    function change(data) {

		/* ------- PIE SLICES -------*/
		let slice = svg.select(".MD_slices").selectAll("path.slice")
			.data(pie(data), key);

		slice.enter()
			.insert("path")
			.style("fill", function(d) { return color(d.data.label); })
			.attr("class", "slice")
			
			// ON SLICE MOUSEOVER
			.on("mouseover", function(d) {
				div.transition()        
					.duration(200)      
					.style("opacity", 1);      
				div.text(getPercentage(d.data.count, gData) + "%")
					.style("left", (d3.event.pageX) + "px")     
					.style("top", (d3.event.pageY - 28) + "px");
			})

			// ON SLICE MOUSEOUT
			.on("mouseout", function(d) {       
				div.transition()        
				   .duration(200)      
				   .style("opacity", 0);   
			});


		slice.transition().duration(1000)
			.attrTween("d", function(d) {
				this._current = this._current || d;
				let interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					return arc(interpolate(t));
				};
			})


		/* ------- TEXT LABELS -------*/

		let text = svg.select(".MD_labels").selectAll("text")
			.data(pie(data), key);

		text.enter()
			.append("text")
			.attr("dy", ".35em")
			.text(function(d) {
				return d.data.label;
			});
		
		function midAngle(d) {
			return d.startAngle + (d.endAngle - d.startAngle)/2;
		}

		text.transition().duration(1000)
			.attrTween("transform", function(d) {
				this._current = this._current || d;
				let interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					let d2 = interpolate(t);
					let pos = outerArc.centroid(d2);
					pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
					return "translate("+ pos +")";
				};
			})
			.styleTween("text-anchor", function(d) {
				this._current = this._current || d;
				let interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					let d2 = interpolate(t);
					return midAngle(d2) < Math.PI ? "start":"end";
				};
			});

		text.exit()
			.remove();

		/* ------- SLICE TO TEXT POLYLINES -------*/

		let polyline = svg.select(".MD_lines").selectAll("polyline")
			.data(pie(data), key);
		
		polyline.enter()
			.append("polyline");

		polyline.transition().duration(1000)
			.attrTween("points", function(d) {
				this._current = this._current || d;
				let interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					let d2 = interpolate(t);
					let pos = outerArc.centroid(d2);
					pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
					return [arc.centroid(d2), outerArc.centroid(d2), pos];
				};			
			});
		
		polyline.exit()
			.remove();
	};
}


/**
 * 
 * @param {*} svg 
 */
function clearMapDonut(svgID, divClass) {

    let svg = d3.select(svgID);
    svg.selectAll("g")
        .transition()
        .duration(100)
        .style("opacity", 0).remove();

    let div = d3.select(divClass);
    div.transition()
        .duration(200)
        .style("opacity", 0);
}