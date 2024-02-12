import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-engagement',
  templateUrl: './engagement.component.html',
  styleUrls: ['./engagement.component.css']
})
export class EngagementComponent implements OnInit {
  ngOnInit(): void {
    this.graphicon();
  }

  private async graphicon(): Promise<void> {   
  
    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = 760 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;
  
      // append the svg object to the body of the page
    const svg = d3.select("figure#engagement")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
  
      //Read the data
    const data = await d3.csv("assets/3_engagement.csv", d3.autoType);
  
    const parseTime = d3.timeParse("%Y.%m.%d");
  
    data.forEach((d:any) => {
        d.Date = parseTime(d.Date);
        d.Time = +d.Time;
    });

    // List of groups (here I have one group per column)
    const allGroup = new Set(data.map((d:any) => d.Group));

    // A color scale: one color for each group
    const myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    const x = d3.scaleTime()
      .domain(d3.extent(data, function(d:any) { return d.Date; }))
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%b %d")));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d:any) { return +d.Time; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Initialize line with first group of the list
    const line = svg
      .append('g')
      .append("path")
        .datum(data)
        .attr("d", <any>d3.line()
          .x((d:any) => x(d.Date))
          .y((d:any) => y(+d.Time))
        )
        .attr("stroke", (d) => <any>myColor("valueA"))
        .style("stroke-width", 4)
        .style("fill", "none");
    }
}
