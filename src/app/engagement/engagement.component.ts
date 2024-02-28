import { Component, OnInit } from '@angular/core';

import * as d3 from 'd3';
import { DiagramService } from '../diagram.service';

@Component({
  selector: 'app-engagement',
  templateUrl: './engagement.component.html',
  styleUrls: ['./engagement.component.css']
})
export class EngagementComponent implements OnInit {

  dia: number = 1;

  dataArray: any[] = [];

  constructor(private diaService: DiagramService) {}

  parseCSVAndBuildDiagram() {
    /*this.diaService.getDiagram().subscribe(dataA => {
      const lines: string[] = dataA.split("\n");
      
      const index: number = lines.indexOf("Nth day,Average engagement time\r");
      
      const startDate = lines[index - 2].split(": ");

      const startDateOK = startDate[1].substring(6, 8);

      const endDate = lines[index - 1].split(": ");

      const endDateOK = endDate[1].substring(6, 8);
      
      const days = parseInt(endDateOK) - parseInt(startDateOK);

      const dataRows: string[] = lines.slice(index + 1, days + 1 + index + 1);      

      const propertyNames = dataRows[0].slice(0, dataRows[0].indexOf('\n')).split(',');

      propertyNames[0] = "Date";
      propertyNames[1] = "Time";

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
        d.Date = startDate[1].substring(0, 6) + (parseInt(d.Date) + 1).toString().padStart(2, "0"),
        d.Time = +d.Time
      });

      // set the dimensions and margins of the graph
      const margin = {top: 10, right: 30, bottom: 30, left: 60},
        width = 760 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

      // append the svg object to the body of the page
      const svg = d3.select("figure#engagement_zoom")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",`translate(${margin.left},${margin.top})`);

      //Read the data
      const data = this.dataArray;//await d3.csv("assets/3_engagement.csv", d3.autoType);

      const parseTime = d3.timeParse("%Y%m%d");
      
      data.forEach((d:any) => {
          d.Date = parseTime(d.Date);
          d.Time = +d.Time;
      });

      // Add X axis --> it is a date format
      const x = d3.scaleTime()
      .domain(d3.extent(data, (d:any) => d.Date))
      .range([ 0, width ]);
      
      const xAxis = svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %d")));
    
      // Add Y axis
      const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d:any) => +d.Time)])
      .range([ height, 0 ]);
      
      const yAxis = svg.append("g")
      .call(d3.axisLeft(y));
      
      // Add a clipPath: everything out of this area won't be drawn.
      const clip = svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

    // Add brushing
      const brush = d3.brushX()                   // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function
      
      // Create the area variable: where both the area and the brush take place
      const area = svg.append('g')
      .attr("clip-path", "url(#clip)")
      
      // Create an area generator
      const areaGenerator = d3.area()
      .x((d:any) => x(d.Date))
      .y0(y(0))
      .y1((d:any) => y(d.Time))
      
      // Add the area
      area.append("path")
      .datum(data)
      .attr("class", "myArea")  // I add the class myArea to be able to modify it later on.
      .attr("fill", "#69b3a2")
      .attr("fill-opacity", .3)
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("d", <any>areaGenerator )
      
      // Add the brushing
      area
      .append("g")
        .attr("class", "brush")
        .call(brush);
     
      // A function that set idleTimeOut to null
      let idleTimeout
      function idled() { idleTimeout = null; }
      
      // A function that update the chart for given boundaries
      function updateChart(event) {
      
      // If no selection, back to initial coordinate. Otherwise, update X axis domain
      if(!event.selection){
        if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
        x.domain([ 4,8])
      }else{
        x.domain([ x.invert(event.selection[0]), x.invert(event.selection[1]) ])
        area.select(".brush").call(<any>brush.move, null) // This remove the grey brush area as soon as the selection has been done
      }
      
      // Update axis and area position
      xAxis.transition().duration(1000).call(d3.axisBottom(x))
      area
          .select('.myArea')
          .transition()
          .duration(1000)
          .attr("d", areaGenerator)
      }
      
      // If user double click, reinitialize the chart
      svg.on("dblclick", function(){
      x.domain(d3.extent(data, (d:any) => d.Date))
      xAxis.transition().call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %d")))
      area
        .select('.myArea')
        .transition()
        .attr("d", areaGenerator)
      });


      // set the dimensions and margins of the graph
      const margin2 = {top: 10, right: 30, bottom: 30, left: 60},
      width2 = 760 - margin2.left - margin2.right,
      height2 = 400 - margin2.top - margin2.bottom;

      // append the svg object to the body of the page
      const svg2 = d3.select("figure#engagement")
      .append("svg")
      .attr("width", width2 + margin2.left + margin2.right)
      .attr("height", height2 + margin2.top + margin2.bottom)
      .append("g")
      .attr("transform",
          "translate(" + margin2.left + "," + margin2.top + ")");

      // List of groups (here I have one group per column)
      const allGroup = new Set(data.map((d:any) => d.Group));

      // A color scale: one color for each group
      const myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

      // Add X axis --> it is a date format
      const x2 = d3.scaleTime()
      .domain(d3.extent(data, function(d:any) { return d.Date; }))
      .range([ 0, width2 ]);

      svg2.append("g")
      .attr("transform", `translate(0, ${height2})`)
      .call(d3.axisBottom(x2).tickFormat(d3.timeFormat("%b %d")));

      // Add Y axis
      const y2 = d3.scaleLinear()
      .domain([0, d3.max(data, function(d:any) { return +d.Time; })])
      .range([ height2, 0 ]);
      
      svg2.append("g")
      .call(d3.axisLeft(y2));

      // Initialize line with first group of the list
      const line = svg2
      .append('g')
      .append("path")
        .datum(data)
        .attr("d", <any>d3.line()
          .x((d:any) => x2(d.Date))
          .y((d:any) => y2(+d.Time))
        )
        .attr("stroke", (d) => <any>myColor("valueA"))
        .style("stroke-width", 4)
        .style("fill", "none");
      
    });*/
  }

  ngOnInit(): void {
    this.parseCSVAndBuildDiagram();
  }
}
