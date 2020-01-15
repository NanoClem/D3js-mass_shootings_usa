let dWidth = 960;
let dHeight = 450;
let radius = Math.min(dWidth, dHeight) / 2;

let svgDonut = d3.select("#donut")
	.attr("width", dWidth)
	.attr("height", dHeight)
	.append("g")
	.attr("transform", "translate(" + dWidth / 2 + "," + dHeight / 2 + ")");

let divDonut = d3.select("body")
	.append("div")   
	.attr("class", "tooltip")               
	.style("opacity", 0);


// GROUPS
svgDonut.append("g")
	.attr("class", "slices");
svgDonut.append("g")
	.attr("class", "labels");
svgDonut.append("g")
	.attr("class", "lines");


let pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.count;
	});

let arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

let outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

let key = function(d){ return d.data.label; };


// IMPORT DATA
d3.dsv(';')("datasets/mass-shootings-in-america.csv", function(data) {

	// ALL TYPES OF PLACES WHERE SHOOTINGS HAPPENED
	let domain = getLabels();

	// COUNT OCCURRENCES IN PLACE CATEGORIES
	let donutData = countOccurences(data);
	// console.log(countPlaces);

	// COLORS
	let color = generateColors(["#390B06", "#6F332D", "#17193C", "#3A6B45", "#568A62"], domain)

	// ASCENDING SORT
	let gData = donutData.sort(function(a, b) {
		return a.count - b.count;
	});
		
	console.log(gData);
	change(gData);


	function change(data) {

		/* ------- PIE SLICES -------*/
		let slice = svgDonut.select(".slices").selectAll("path.slice")
			.data(pie(data), key);

		slice.enter()
			.insert("path")
			.style("fill", function(d) { return color(d.data.label); })
			.attr("class", "slice")
			
			// ON SLICE MOUSEOVER
			.on("mouseover", function(d) {
				divDonut.transition()        
					.duration(200)      
					.style("opacity", 1);      
				divDonut.text(d.data.count + " Victimes")
					.style("left", (d3.event.pageX) + "px")     
					.style("top", (d3.event.pageY - 28) + "px");
			})

			// ON SLICE MOUSEOUT
			.on("mouseout", function(d) {       
				divDonut.transition()        
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

		let text = svgDonut.select(".labels").selectAll("text")
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

		let polyline = svgDonut.select(".lines").selectAll("polyline")
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
});