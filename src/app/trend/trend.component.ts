import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";
import { DiagramService } from '../diagram.service';

@Component({
  selector: 'app-trend',
  templateUrl: './trend.component.html',
  styleUrls: ['./trend.component.css']
})
export class TrendComponent implements OnInit {
  ngOnInit(): void {
    this.parseCSVAndBuildDiagram();
  }

  dataArray: any[] = [];

  constructor(private diaService: DiagramService) {}

  parseCSVAndBuildDiagram() {
    this.diaService.getDiagram().subscribe(dataA => {
    const lines: string[] = dataA.split("\n");
    
    const index: number = lines.indexOf("Nth day,30 days,7 days,1 day\r");
    
    const startDate = lines[index - 2].split(": ");

    const startDateOK = startDate[1].substring(6, 8);

    const endDate = lines[index - 1].split(": ");

    const endDateOK = endDate[1].substring(6, 8);
    
    const days = parseInt(endDateOK) - parseInt(startDateOK);

    const dataRows: string[] = lines.slice(index + 1, days + 1 + index + 1);      

    const propertyNames = dataRows[0].slice(0, dataRows[0].indexOf('\n')).split(',');

    propertyNames[0] = "date";
    propertyNames[1] = "_30days";
    propertyNames[2] = "_7days";
    propertyNames[3] = "_1day";

    dataRows.forEach((row) => {

      let values = row.split(',');

      let obj: any = new Object();

      for (let index = 0; index < propertyNames.length; index++) {

        const propertyName: string = propertyNames[index];

        let val: any = values[index];

        if (val === '') {

          val = null;

        }

        obj[propertyName] = val;

      }

      this.dataArray.push(obj);

    });
    
    this.dataArray.forEach((d:any) => {
      d.date = startDate[1].substring(0, 6) + (parseInt(d.date) + 1).toString().padStart(2, "0"),
      d._1day = +d._1day,
      d._7days = +d._7days,
      d._30days = +d._30days
    });

    this.graphicon(this.dataArray);

   });
  }

  private graphicon(paramData) : void {
      
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 760 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    // parse the date / time
    var parseTime = d3.timeParse("%Y%m%d");

    // set the ranges
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // define the 1st line
    var valueline = d3.line()
    .x(function(d:any) { return x(d.date); })
    .y(function(d:any) { return y(d._30days); });

    // define the 2nd line
    var valueline2 = d3.line()
    .x(function(d:any) { return x(d.date); })
    .y(function(d:any) { return y(d._7days); });

    // define the 3nd line
    var valueline3 = d3.line()
    .x(function(d:any) { return x(d.date); })
    .y(function(d:any) { return y(d._1day); });

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("figure#trend").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    // Get the data
    const data = paramData;

    // format the data
    data.forEach(function(d:any) {
      d.date = parseTime(d.date);
      d._30days = +d._30days;
      d._7days = +d._7days;
      d._1day = +d._1day;
    });

    // Scale the range of the data
    x.domain(<any>d3.extent(data, function(d:any) { return d.date; }));
    y.domain([0, d3.max(data, function(d:any) {
    return Math.max(d._30days, d._7days, d._1day); })]);

    // Add the valueline path.
    svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", "2px")
      .attr("d", <any>valueline);

    // Add the valueline2 path.
    svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", "2px")
      .attr("d", <any>valueline2);

    // Add the valueline3 path.
    svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-width", "2px")
    .attr("d", <any>valueline3);

    // Add the X Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %d")));

    // Add the Y Axis
    svg.append("g")
      .call(d3.axisLeft(y));

   // create a list of keys
    const keys = ["30 days", "7 days", "1 day"];

    // Usually you have a color scale in your chart already
    const color = d3.scaleOrdinal()
      .domain(keys)
      .range(["steelblue", "red", "green"]);

    // Add one dot in the legend for each name.
    svg.selectAll("figure#trend")
      .data(keys)
      .enter()
      .append("circle")
        .attr("cx", 620)
        .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", (d) => <any>color(d))

    // Add one dot in the legend for each name.
    svg.selectAll("rect")
      .data(keys)
      .enter()
      .append("text")
        .attr("x", 630)
        .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", d => <any>color(d))
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle");
  }
}
