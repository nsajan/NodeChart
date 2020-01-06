const fs = require('pn/fs');
const svg2png = require("svg2png");
const { JSDOM } = require("jsdom");
const d3 = require('d3-node')().d3;
const express = require('express')
var bodyParser     =         require("body-parser");
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/api/users', function(req, res) {

  
  var options = { width : 400, height : 400 };

            var data = 
            [
               { label : "Abulia", count : 10 },
               { label : "Betelgeuse", count : 20 },
               { label : "Cantaloupe", count : 30 },
               { label : "Dijkstra", count : 40 }
            ];

            options = req.body.options;
            data = req.body.data;
       var dom = new JSDOM('<html><body><div id="chart"></div></html>');
    dom.window.d3 = d3.select(dom.window.document);
	
	console.log("dom done");

    // Build D3 chart
    var width = options.width || 360;
    var height = options.height || 360;
    var radius = Math.min(width, height) / 2;

var colorarray = ['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']
    var color = d3.scaleOrdinal(colorarray);
	
	console.log("color done");

    var svg = dom.window.d3.select('#chart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + (width / 2) +
            ',' + (height / 2) + ')');

    var arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius);

    var pie = d3.pie()
        .value(function (d) { return d.count; })
        .sort(null);

    var path = svg.selectAll('path')
        .data(pie(data))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function (d) {
            return color(d.data.label);
        });

    // Convert SVG to PNG and return it to controller
    var svgText = dom.window.d3.select('#chart').html();
			

  res.send(svgText);
});

app.post('/api/pie', function(req, res) {

  

  
             var options = JSON.parse(req.body.options);
             var data = JSON.parse(req.body.data);
         var dom = new JSDOM('<html><body><div id="chart"></div></html>');
      dom.window.d3 = d3.select(dom.window.document);
      
      console.log("data" + data);
      console.log("options" + options);

      // Build D3 chart
      var width = options.width || 360;
      var height = options.height || 360;
      var radius = Math.min(width, height) / 2;
  
  var colorarray = ['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']
      var color = d3.scaleOrdinal(colorarray);
      
      console.log("color done");
  
      var svg = dom.window.d3.select('#chart')
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g')
          .attr('transform', 'translate(' + (width / 2) +
              ',' + (height / 2) + ')');
  
      var arc = d3.arc()
          .innerRadius(0)
          .outerRadius(radius);
  
      var pie = d3.pie()
          .value(function (d) { return d.count; })
          .sort(null);
  
      var path = svg.selectAll('path')
          .data(pie(data))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function (d) {
              return color(d.data.label);
          });
  
      // Convert SVG to PNG and return it to controller
      var svgText = dom.window.d3.select('#chart').html();

      fs.writeFile("out.html", svgText)

      //svg2png(Buffer.from(svgText), { width: width, height: height })
        //.then(buffer => 'data:image/png;base64,' + buffer.toString('base64'))
        //.then(buffer => res.send(buffer))
              
        res.send(svgText);
    
  });

app.post('/api/users', function(req, res) {
 

    var user_id = req.body.id;
    var token = req.body.token;
    var geo = req.body.geo;

    res.send(user_id + ' ' + token + ' ' + geo);
	console.log("Exiting post method");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
console.log('Server started! At http://localhost:' + port);