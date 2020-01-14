let dWidth = 960;
let dHeight = 450;
let radius = Math.min(dWidth, dHeight) / 2;

let svgDonut = d3.select("#donut")
	.attr("width", dWidth)
	.attr("height", dHeight)
	.append("g")
	.attr("transform", "translate(" + dWidth / 2 + "," + dHeight / 2 + ")");


// GROUPS
svgDonut.append("g")
	.attr("class", "slices");
svgDonut.append("g")
	.attr("class", "labels");
svgDonut.append("g")
	.attr("class", "lines");

console.log(svgDonut);

var pie = d3.layout.pie()
	.sort(null)
	.value(function(d) {
		return d.value;
	});

var arc = d3.svg.arc()
	.outerRadius(radius * 0.8)
	.innerRadius(radius * 0.4);

var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

var key = function(d){ return d.data.label; };


// IMPORT DATA
d3.dsv(';')("datasets/mass-shootings-in-america.csv", function(data) {
	

	// ALL TYPES OF PLACES WHERE SHOOTINGS HAPPENED
	var domains = d3.map(data, function(d) {return d.Place_Type;}).keys();

	// COUNT OCCURRENCES IN PLACES
	var countPlaces = {};
	data.forEach( function(d) {
		var place = d.Place_Type;
		if(countPlaces[place] === undefined) {
			countPlaces[place] = 0;
		} else {
			countPlaces[place] += 1;
		}
	});


	// COLORS
	var color = d3.scale.ordinal()
		.domain(domains)
		.range(["#7d0956", "#07adad", "#FF0000", "#07423d"]);


	// GENERATE OUR DATA FOR THE CHART
	function generateData() {
		var labels = color.domain();
		return labels.map(function(label){
			return { label: label, value: countPlaces[label] };
		});
	}

	// ASCENDING SORT
	var gData = generateData().sort(function(a, b) {
		return a.value - b.value;
	});
		
	change(gData);


	function change(data) {

		/* ------- PIE SLICES -------*/
		var slice = svgDonut.select(".slices").selectAll("path.slice")
			.data(pie(data), key);

		slice.enter()
			.insert("path")
			.style("fill", function(d) { return color(d.data.label); })
			.attr("class", "slice");

		slice.transition().duration(1000)
			 .attrTween("d", function(d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					return arc(interpolate(t));
				};
			})

		slice.exit()
			.remove();

		/* ------- TEXT LABELS -------*/

		var text = svgDonut.select(".labels").selectAll("text")
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
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
					return "translate("+ pos +")";
				};
			})
			.styleTween("text-anchor", function(d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					var d2 = interpolate(t);
					return midAngle(d2) < Math.PI ? "start":"end";
				};
			});

		text.exit()
			.remove();

		/* ------- SLICE TO TEXT POLYLINES -------*/

		var polyline = svgDonut.select(".lines").selectAll("polyline")
			.data(pie(data), key);
		
		polyline.enter()
			.append("polyline");

		polyline.transition().duration(1000)
			.attrTween("points", function(d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					var d2 = interpolate(t);
					var pos = outerArc.centroid(d2);
					pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
					return [arc.centroid(d2), outerArc.centroid(d2), pos];
				};			
			});
		
		polyline.exit()
			.remove();
	};
});