
/* 
    Use the following data
    -	Geo-map of all Vietnamese provinces https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json
    -	Vietnamese data by provinces https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces-data.csv
    
    1.	Draw a choropleth of Vietnam (using one of the attributes on the dataset)
    2.	Follow instruction in https://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object to center the map
    3.	Draw a choropleth map of Vietnam for COVID confirmed cases by provinces using data from https://vi.wikipedia.org/wiki/%C4%90%E1%BA%A1i_d%E1%BB%8Bch_COVID-19_t%E1%BA%A1i_Vi%E1%BB%87t_Nam
    4.	(Optional) Implement zoom to bounding box of a province on click
    https://observablehq.com/@d3/zoom-to-bounding-box
    


Reference: 
- https://observablehq.com/@floledermann/drawing-maps-from-geodata-in-d3
- Map: https://github.com/blaurt/map-app-v1/blob/master >> https://medium.com/@suverov.dmitriy/how-to-convert-latitude-and-longitude-coordinates-into-pixel-offsets-8461093cb9f5
*/

// Credit to Marty"s answer in this following StackOverflow post: 
// https://stackoverflow.com/questions/73715465/how-to-wrap-or-break-long-text-in-a-fixed-width-on-d3-js-chart-library-javascr
function wrap(text, width, lineHeight = 0.75) {
	text.each(function () {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			y = text.attr("y"),
			dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
		while (word = words.pop()) {
			line.push(word);
			tspan.text(line.join(" "));
			if (tspan.node().getComputedTextLength() > width) // this part plays big role
			{
				line.pop();
				tspan.text(line.join(" "));
				line = [word];
				tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
			}
		}
	});
}

function ChartTransition(g, timing) {
	if (timing == 0) { return g.enter() }
	return g.transition().duration(timing);
}


var colorArray = ["#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231", "#911eb4",
"#46f0f0", "#f032e6", "#bcf60c", "#fabebe", "#008080", "#e6beff",
"#9a6324", "#fffac8", "#800000", "#aaffc3", "#808000", "#ffd8b1",
"#000075", "#808080", "#ffffff", "#000000"];

function ConvertDateJS(date) {
	let month = date.getMonth() + 1;
	let day = date.getDate();
	let year = date.getFullYear().toString();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    return month + "/" + day + "/" + year;
}

function drawChart(code, json, json_vn) {
	let margin = { top: 50, right: 100, bottom: 50, left: 50 };
	let width = 720;
	let height = 480;
	let full_width = width + margin.left + margin.right;
	let full_height = height + margin.top + margin.bottom;

	// Create the svg element
	var svg = d3.select(code)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.attr("viewBox", [0, 0, full_width, full_height]);

	// 1: Initiate the projection. See Ref [2]
	let center = d3.geoCentroid(json);           
	var projection = d3.geoMercator()
		.center(center)
		.fitSize([full_width, full_height], json);
	
	var path = d3.geoPath().projection(projection);

	// 2: Create the map, use the random color for each province
	let color_array = ["#911eb4", "#e6194b", "#ffe119", "#f032e6", "#46f0f0", "#808080", 
		"#ffffff", "#808000", "#e6beff", "#000075", "#4363d8", "#f58231", "#3cb44b", "#bcf60c", 
		"#fffac8", "#aaffc3", "#9a6324", "#ffd8b1", "#000000", "#fabebe", "#800000", "#008080"];
	// Sort the color array by the number of cases by the format #xxxxxx

	color_array.sort(function (a, b) {
		// Convert from hexacolor to number in base 10 
		a_red = parseInt(a.toString().substring(1, 3), 16);
		a_green = parseInt(a.toString().substring(3, 5), 16);
		a_blue = parseInt(a.toString().substring(5, 7), 16);

		b_red = parseInt(b.toString().substring(1, 3), 16);
		b_green = parseInt(b.toString().substring(3, 5), 16);
		b_blue = parseInt(b.toString().substring(5, 7), 16);

		// https://stackoverflow.com/questions/25680108/how-to-sort-color-codes-from-light-to-dark-in-java
		// Use this formula to compute the distance: 0.21 * R + 0.72 * G + 0.07 * B
		a_distance = 0.21 * a_red + 0.72 * a_green + 0.07 * a_blue;
		b_distance = 0.21 * b_red + 0.72 * b_green + 0.07 * b_blue;

		return a_distance - b_distance;
	});
	console.log(color_array);

	let color = d3.scaleOrdinal(color_array);
	var map = svg.append("g")
		.attr("id", "map")
		.selectAll("path")
		.data(json.features)
		.enter()
		.append("path")
		.attr("d", path)
		.style("fill", function (d) {
			return color(d.properties.Cases);
		})
		.style("stroke", "#fff")
		.style("stroke-width", "0.5px")
		.attr("cursor", "pointer")
		.on("mouseover", function (d) {
			d3.select(this)
				.style("fill", function (d) {
					return (new d3.color(color(d.properties.Cases))).darker(1.5).copy({opacity: 0.8});
				});
		})
		.on("mouseout", function (d) {
			d3.select(this)
				.style("fill", function (d) {
					return new d3.color(color(d.properties.Cases));
				});
		})
		.append("title")
		.text(function (d) {
			return d.properties.Ten + ": " + d.properties.Cases;
		});
	
}
