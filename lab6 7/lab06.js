function wrap(text, width, lineHeight = 0.75) {
	text.each(function () {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			y = text.attr("y"),
			dy = parseFloat(text.attr("dy")),
			tspan = text
				.text(null)
				.append("tspan")
				.attr("x", 0)
				.attr("y", y)
				.attr("dy", dy + "em");
		while ((word = words.pop())) {
			line.push(word);
			tspan.text(line.join(" "));
			if (tspan.node().getComputedTextLength() > width) {
				line.pop();
				tspan.text(line.join(" "));
				line = [word];
				tspan = text
					.append("tspan")
					.attr("x", 0)
					.attr("y", y)
					.attr("dy", ++lineNumber * lineHeight + dy + "em")
					.text(word);
			}
		}
	});
}

function ChartTransition(g, timing) {
	if (timing == 0) {
		return g.enter();
	}
	return g.transition().duration(timing);
}

var colorArray = [
	"#e41a1c",
	"#377eb8",
	"#4daf4a",
	"#ff7f00",
	"#ffff33",
	"#a65628",
	"#f781bf",
	"#999999",
];

function ConvertDateJS(date) {
	let month = date.getMonth() + 1;
	let day = date.getDate();
	let year = date.getFullYear().toString();

	if (month < 10) month = "0" + month;
	if (day < 10) day = "0" + day;

	return month + "/" + day + "/" + year;
}

function drawChart(code, source) {
	var margin = { top: 50, right: 100, bottom: 50, left: 50 };
	var width = 720;
	var height = 480;

	source.sort(
		(a, b) =>
			d3.ascending(a.Country, b.Country) || d3.ascending(a.Date, b.Date)
	);

	let COUNTRY = source.map((d) => d.Country);
	let DATE = source.map((d) => d.Date);
	let CASES = source.map((d) => d.Cases);

	var yScale = d3
		.scaleLog()
		.domain([d3.min(CASES), d3.max(CASES)])
		.range([height, 0]);
	var yAxis = d3.axisLeft(yScale).ticks(20);

	var xScale = d3
		.scaleTime()
		.domain([d3.min(DATE), d3.max(DATE)])
		.range([0, width]);
	var xAxis = d3
		.axisBottom(xScale)
		.ticks(10)
		.tickFormat(d3.timeFormat("%m/%d"));

	var svg = d3
		.select(code)
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom);

	svg.append("g")
		.attr("class", "xAxis")
		.attr(
			"transform",
			"translate(" + margin.left + ", " + (height + margin.top) + ")"
		)
		.call(xAxis);
	svg.append("g")
		.attr("class", "yAxis")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
		.call(yAxis);

	svg.append("text")
		.attr("class", "xAxisLabel")
		.attr(
			"transform",
			"translate(" +
				(margin.left + width / 2) +
				"," +
				(height + margin.top + margin.right / 2) +
				")"
		)
		.style("text-anchor", "middle")
		.text("Date");

	svg.append("text")
		.attr("class", "yAxisLabel")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin.left)
		.attr("x", 0 - height / 2)
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.text("Number of Cases (Log10 Scale)");

	svg.append("text")
		.attr("class", "title")
		.attr(
			"transform",
			"translate(" +
				(width + margin.left + margin.right) / 2 +
				"," +
				margin.top / 2 +
				")"
		)
		.style("text-anchor", "middle")
		.text(
			"COVID-19 Cases in Vietnam, US, Italy, and Australia from " +
				ConvertDateJS(d3.min(DATE)) +
				" to " +
				ConvertDateJS(d3.max(DATE))
		);

	let data = d3.group(source, (d) => d.Country);
	let COUNTRIES = Array.from(data.keys());

	for (let i = 0; i < COUNTRIES.length; i++) {
		var country = COUNTRIES[i];
		var countryData = data.get(country);
		var line = d3
			.line()
			.defined(function (d) {
				return d.Country === country;
			})
			.x(function (d) {
				return xScale(d.Date) + margin.left;
			})
			.y(function (d) {
				return yScale(d.Cases) + margin.top;
			});

		svg.append("path")
			.datum(countryData)
			.attr("class", "line")
			.attr("d", line)
			.style("stroke", colorArray[i])
			.style("stroke-width", 2)
			.style("fill", "none")
			.append("title")
			.text(country + ": " + countryData[countryData.length - 1].Cases)
			.on("mouseover", function () {
				d3.select(this)
					.style("stroke-width", 4)
					.text(
						country +
							": " +
							countryData[countryData.length - 1].Cases
					);
			})
			.on("mouseout", function () {
				d3.select(this).style("stroke-width", 2);
			});

		svg.selectAll("circle " + country)
			.data(countryData)
			.enter()
			.append("circle")
			.attr("class", "circle " + country)
			.attr("cx", function (d) {
				return xScale(d.Date) + margin.left;
			})
			.attr("cy", function (d) {
				return yScale(d.Cases) + margin.top;
			})
			.attr("r", 5)
			.style("fill", colorArray[i])
			.append("title")
			.attr("id", "tooltip")
			.attr("text-anchor", "middle")
			.attr("font-size", "11px")
			.text((d, index) => ConvertDateJS(d.Date) + ": " + d.Cases)
			.on("mouseover", function (d, index) {
				d3.select(this).style("stroke-width", 4);
			})
			.on("mouseout", function (d, index) {
				d3.select(this).style("stroke-width", 2);
			});

		svg.append("circle")
			.attr("cx", margin.left + width + 15)
			.attr("cy", margin.top + 50 + i * 25)
			.attr("r", 5)
			.style("fill", colorArray[i])
			.on("mouseover", function () {
				d3.select(this)
					.style("stroke-width", 4)
					.attr("text-anchor", "middle")
					.attr("font-size", "11px")
					.attr("r", 15);
			})
			.on("mouseout", function () {
				d3.select(this).style("stroke-width", 2).attr("r", 5);
			})
			.append("title")
			.text(
				"Total of " +
					country +
					": " +
					countryData[countryData.length - 1].Cases
			);

		svg.append("text")
			.attr("x", margin.left + width + 25)
			.attr("y", margin.top + 50 + i * 25)
			.attr("dy", ".35em")
			.style("text-anchor", "start")
			.text(country);
	}
}
