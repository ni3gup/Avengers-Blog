google.charts.load(
	"current", {packages:["corechart","geochart"],
	'mapsApiKey': 'AIzaSyBDd5XEDGU2u2JgXMfyB74ybuJGXmsULig'
});
google.charts.setOnLoadCallback(histogram_chart);
google.charts.setOnLoadCallback(drawRegionsMap);

function timeline_chart() {
	d3.csv("homepod_tweets_timeline.csv", function(d) {
		var parseTime = d3.timeParse("%d-%b %H");
		return {
		    time: parseTime(d.time), // convert "time" column to Datetime
		    count: +d.count // convert "count" column to number
	  	};
	}).then(function(data) {
		data = Object.assign(data, {y: "Count"});
	    var margin = ({top: 20, right: 30, bottom: 50, left: 70});
		var height = 500;
	    var width = 960 - margin.left - margin.right;

	    var yAxis = g => g
		    .attr("transform", `translate(${margin.left},0)`)
		    .call(d3.axisLeft(y))
		    .call(g => g.select(".domain").remove())
		    .call(g => g.select(".tick:last-of-type text").clone()
		        .attr("x", 3)
		        .attr("text-anchor", "start")
		        .attr("font-weight", "bold")
		        .text(data.y));
		
		var xAxis = g => g
		    .attr("transform", `translate(0,${height - margin.bottom})`)
		    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

		var y = d3.scaleLinear()
		    .domain([0, d3.max(data, d => d.count)]).nice()
		    .range([height - margin.bottom, margin.top]);

	    var x = d3.scaleUtc()
		    .domain(d3.extent(data, d => d.time))
		    .range([margin.left, width - margin.right]);

	    var line = d3.line()
		    .defined(d => !isNaN(d.count))
		    .x(d => x(d.time))
		    .y(d => y(d.count));

		var svg = d3.select("#linechart").append("svg")
		      	.attr("viewBox", [0, 0, width, height]);

	  	svg.append("g")
	      .call(xAxis);

	  	svg.append("g")
	      .call(yAxis);

	  	svg.append("path")
	      .datum(data)
	      .attr("fill", "none")
	      .attr("stroke", "steelblue")
	      .attr("stroke-width", 1.5)
	      .attr("stroke-linejoin", "round")
	      .attr("stroke-linecap", "round")
	      .attr("d", line);
	});
};

function retweets_radio_chart() {
	var data = [{name:"tweets",value:0.522},{name:"retweets",value:0.478}];
    var color = d3.scaleOrdinal(d3.schemePastel1)
	    .domain(data.map(d => d.name))
	    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

	var width = 660;
	var height = Math.min(width, 500);

	var arc = d3.arc()
	    .innerRadius(0)
	    .outerRadius(Math.min(width, height) / 2 - 1);

	var arcLabel = function() {
	  var radius = Math.min(width, height) / 2 * 0.8;
	  return d3.arc().innerRadius(radius).outerRadius(radius);
	};

	var pie = d3.pie()
	    .sort(null)
	    .value(d => d.value);

	var arcs = pie(data);

	var format = d3.format(".1%");

	var svg = d3.select("#tweets_radio_pie_chart").append("svg")
	  .attr("viewBox", [-width / 2, -height / 2, width, height]);

	svg.append("g")
		.attr("stroke", "white")
		.selectAll("path")
		.data(arcs)
		.join("path")
		.attr("fill", d => color(d.data.name))
		.attr("d", arc)
		.append("title")
		.text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

	svg.append("g")
		.attr("font-family", "sans-serif")
		.attr("font-size", 16)
		.attr("text-anchor", "middle")
		.selectAll("text")
		.data(arcs)
		.join("text")
		.attr("transform", d => `translate(${arcLabel().centroid(d)})`)
		.call(text => text.append("tspan")
		.attr("y", "-0.4em")
		.attr("font-weight", "bold")
		.text(d => d.data.name))
		.call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
		.attr("x", 0)
		.attr("y", "0.7em")
		.attr("fill-opacity", 0.7)
		.text(d => format(d.data.value)));
};

function top_twitter_radio_chart() {
	var data = [{name:"tweets",value:0.822},{name:"retweets",value:0.178}];
    var color = d3.scaleOrdinal()
	    .domain(data.map(d => d.name))
	    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

	var width = 660;
	var height = Math.min(width, 500);

	var arc = d3.arc()
	    .innerRadius(0)
	    .outerRadius(Math.min(width, height) / 2 - 1);

	var arcLabel = function() {
	  var radius = Math.min(width, height) / 2 * 0.8;
	  return d3.arc().innerRadius(radius).outerRadius(radius);
	};

	var pie = d3.pie()
	    .sort(null)
	    .value(d => d.value);

	var arcs = pie(data);

	var format = d3.format(".1%");

	var svg = d3.select("#top_twitter_radio_pie_chart").append("svg")
	  .attr("viewBox", [-width / 2, -height / 2, width, height]);

	svg.append("g")
		.attr("stroke", "white")
		.selectAll("path")
		.data(arcs)
		.join("path")
		.attr("fill", d => color(d.data.name))
		.attr("d", arc)
		.append("title")
		.text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

	svg.append("g")
		.attr("font-family", "sans-serif")
		.attr("font-size", 16)
		.attr("text-anchor", "middle")
		.selectAll("text")
		.data(arcs)
		.join("text")
		.attr("transform", d => `translate(${arcLabel().centroid(d)})`)
		.call(text => text.append("tspan")
		.attr("y", "-0.4em")
		.attr("font-weight", "bold")
		.text(d => d.data.name))
		.call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
		.attr("x", 0)
		.attr("y", "0.7em")
		.attr("fill-opacity", 0.7)
		.text(d => format(d.data.value)));
};

function top_twitter_bar_chart() {
	var data = [{name:"tweets",value:0.01},{name:"retweets",value:0.04}];
	data = Object.assign(data, {format: "%", y: "Count"});
	var margin = ({top: 30, right: 0, bottom: 30, left: 40})
	var height = 500;
	var width = 660 - margin.left - margin.right;
	var color = "#CB921A"

	var yAxis = g => g
		    .attr("transform", `translate(${margin.left},0)`)
		    .call(d3.axisLeft(y).ticks(null, data.format))
		    .call(g => g.select(".domain").remove())
		    .call(g => g.append("text")
		        .attr("x", -margin.left)
		        .attr("y", 10)
		        .attr("fill", "currentColor")
		        .attr("text-anchor", "start")
		        .text(data.y));

	var xAxis = g => g
		    .attr("transform", `translate(0,${height - margin.bottom})`)
		    .call(d3.axisBottom(x).tickFormat(i => data[i].name).tickSizeOuter(0));

	var y = d3.scaleLinear()
		    .domain([0, d3.max(data, d => d.value)]).nice()
		    .range([height - margin.bottom, margin.top]);

	var x = d3.scaleBand()
		    .domain(d3.range(data.length))
		    .range([margin.left, width - margin.right])
		    .padding(0.1);

	var format = d3.format(".1%");

	var svg = d3.select("#top_tweets_bar_chart").append("svg")
		  .attr("viewBox", [0, 0, width, height]);

	svg.append("g")
		.attr("fill", color)
		.selectAll("rect")
		.data(data)
		.join("rect")
		  .attr("x", (d, i) => x(i))
		  .attr("y", d => y(d.value))
		  .attr("height", d => y(0) - y(d.value))
		  .attr("width", x.bandwidth());

	svg.append("g")
		  .attr("font-family", "sans-serif")
		  .attr("font-size", 16)
		.selectAll("text")
		.data(data)
		.join("text")
		  .attr("text-anchor", d => d.value < 0 ? "end" : "start")
		  .attr("y", d => y(d.value) + Math.sign(d.value - 0) * 4)
		  .attr("x", (d, i) => x(i) + x.bandwidth() / 2)
		  .attr("dy", "-0.6em")
		  .text(d => format(d.value));

	svg.append("g")
		  .call(xAxis);

	svg.append("g")
		  .call(yAxis);
};

function geo_chart() {
	var data = [{name:"geo",value:0.002},{name:"location",value:0.643}];
	data = Object.assign(data, {format: "%", y: "Count"});
	var margin = ({top: 30, right: 0, bottom: 30, left: 40})
	var height = 500;
	var width = 660 - margin.left - margin.right;
	var color = "#F9B473"

	var yAxis = g => g
		    .attr("transform", `translate(${margin.left},0)`)
		    .call(d3.axisLeft(y).ticks(null, data.format))
		    .call(g => g.select(".domain").remove())
		    .call(g => g.append("text")
		        .attr("x", -margin.left)
		        .attr("y", 10)
		        .attr("fill", "currentColor")
		        .attr("text-anchor", "start")
		        .text(data.y));

	var xAxis = g => g
		    .attr("transform", `translate(0,${height - margin.bottom})`)
		    .call(d3.axisBottom(x).tickFormat(i => data[i].name).tickSizeOuter(0));

	var y = d3.scaleLinear()
		    .domain([0, d3.max(data, d => d.value)]).nice()
		    .range([height - margin.bottom, margin.top]);

	var x = d3.scaleBand()
		    .domain(d3.range(data.length))
		    .range([margin.left, width - margin.right])
		    .padding(0.1);

	var format = d3.format(".1%");

	var svg = d3.select("#geo_bar_chart").append("svg")
		  .attr("viewBox", [0, 0, width, height]);

	svg.append("g")
		.attr("fill", color)
		.selectAll("rect")
		.data(data)
		.join("rect")
		  .attr("x", (d, i) => x(i))
		  .attr("y", d => y(d.value))
		  .attr("height", d => y(0) - y(d.value))
		  .attr("width", x.bandwidth());

	svg.append("g")
		  .attr("font-family", "sans-serif")
		  .attr("font-size", 16)
		.selectAll("text")
		.data(data)
		.join("text")
		  .attr("text-anchor", d => d.value < 0 ? "end" : "start")
		  .attr("y", d => y(d.value) + Math.sign(d.value - 0) * 4)
		  .attr("x", (d, i) => x(i) + x.bandwidth() / 2)
		  .attr("dy", "-0.6em")
		  .text(d => format(d.value));

	svg.append("g")
		  .call(xAxis);

	svg.append("g")
		  .call(yAxis);
};

function top_city_chart() {
	var data = [{name:"Paris",value:76},{name:"Bangkok",value:54},{name:"Cupertino",value:46},{name:"London",value:20},{name:"San Francisco",value:17}];
	data = Object.assign(data, {y: "Count"});
	var margin = ({top: 30, right: 0, bottom: 30, left: 40})
	var height = 500;
	var width = 660 - margin.left - margin.right;
	var color = "#69b3a2"

	var yAxis = g => g
		    .attr("transform", `translate(${margin.left},0)`)
		    .call(d3.axisLeft(y).ticks(null, data.format))
		    .call(g => g.select(".domain").remove())
		    .call(g => g.append("text")
		        .attr("x", -margin.left)
		        .attr("y", 10)
		        .attr("fill", "currentColor")
		        .attr("text-anchor", "start")
		        .text(data.y));

	var xAxis = g => g
		    .attr("transform", `translate(0,${height - margin.bottom})`)
		    .call(d3.axisBottom(x).tickFormat(i => data[i].name).tickSizeOuter(0));

	var y = d3.scaleLinear()
		    .domain([0, d3.max(data, d => d.value)]).nice()
		    .range([height - margin.bottom, margin.top]);

	var x = d3.scaleBand()
		    .domain(d3.range(data.length))
		    .range([margin.left, width - margin.right])
		    .padding(0.1);

	var svg = d3.select("#top_city_bar_chart").append("svg")
		  .attr("viewBox", [0, 0, width, height]);

	svg.append("g")
		.attr("fill", color)
		.selectAll("rect")
		.data(data)
		.join("rect")
		  .attr("x", (d, i) => x(i))
		  .attr("y", d => y(d.value))
		  .attr("height", d => y(0) - y(d.value))
		  .attr("width", x.bandwidth());

	svg.append("g")
		  .attr("font-family", "sans-serif")
		  .attr("font-size", 16)
		.selectAll("text")
		.data(data)
		.join("text")
		  .attr("text-anchor", d => d.value < 0 ? "end" : "start")
		  .attr("y", d => y(d.value) + Math.sign(d.value - 0) * 4)
		  .attr("x", (d, i) => x(i) + x.bandwidth() / 2)
		  .attr("dy", "-0.6em")
		  .text(d => d.value);

	svg.append("g")
		  .call(xAxis);

	svg.append("g")
		  .call(yAxis);
};

function histogram_chart() {
	$.get("histogram.csv", function(csvString) {
      	// transform the CSV string into a 2-dimensional array
	    var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});

	    // this new DataTable object holds all the data
	    var data = new google.visualization.arrayToDataTable(arrayData);

	    var options = {
	          title: 'Histogram for tweets',
	          legend: { position: 'none' },
	          colors: ['#9467C0'],
    	};

	    var chart = new google.visualization.Histogram(document.getElementById('histogram'));
	    chart.draw(data, options);
    });
};

function drawRegionsMap() {
	$.get("location.csv", function(csvString) {
		var arrayData = $.csv.toArrays(csvString, {onParseValue: $.csv.hooks.castToScalar});
		var data = new google.visualization.arrayToDataTable(arrayData);
		var options = {
			displayMode: 'markers',
			colorAxis: {colors: ['#7A2DD3', '#2DD3CD']},
			datalessRegionColor: "#F9EBC9"
		};

		var chart = new google.visualization.GeoChart(document.getElementById('location'));
		chart.clearChart();
		chart.draw(data, options);
	});
};

$("document").ready(timeline_chart);
$("document").ready(retweets_radio_chart);
$("document").ready(top_twitter_bar_chart);
$("document").ready(geo_chart);
$("document").ready(top_twitter_radio_chart);
$("document").ready(top_city_chart);