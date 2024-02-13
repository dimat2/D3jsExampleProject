import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  ngOnInit(): void {
    this.graphicon();
  }
  
  private async graphicon(): Promise<void> {   
  
    // set the dimensions and margins of the graph
    const margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = 760 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;
  
      // append the svg object to the body of the page
    const svg = d3.select("figure#users")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
  
      //Read the data
    const data = await d3.csv("assets/1-2_users_new_users.csv", d3.autoType);
  
    const parseTime = d3.timeParse("%d-%b-%Y");
  
    data.forEach((d:any) => {
        d.Date = parseTime(d.Date);
        d.Users = +d.Users;
    });

    // List of groups (here I have one group per column)
    const allGroup = new Set(data.map((d:any) => d.Group));

    // add the options to the button
    d3.select("#selectButtonUsers")
      .selectAll('option')
          .data(allGroup)
      .enter()
        .append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }); // corresponding value returned by the button

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
      .domain([0, d3.max(data, function(d:any) { return +d.Users; })])
      .range([ height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Initialize line with first group of the list
    const line = svg
      .append('g')
      .append("path")
        .datum(data.filter(function(d:any){return d.Group=="Users"}))
        .attr("d", <any>d3.line()
          .x((d:any) => x(d.Date))
          .y((d:any) => y(+d.Users))
        )
        .attr("stroke", (d) => <any>myColor("valueA"))
        .style("stroke-width", 4)
        .style("fill", "none");

        function update(selectedGroup) {

            // Create new data with the selection?
            const dataFilter = data.filter(function(d:any){return d.Group==selectedGroup})
      
            // Give these new data to update line
            line
                .datum(dataFilter)
                .transition()
                .duration(1000)
                .attr("d", <any>d3.line()
                  .x(function(d:any) { return x(d.Date) })
                  .y(function(d:any) { return y(+d.Users) })
                )
                .attr("stroke", function(d){ return <any>myColor(selectedGroup) })
          }
      
          // When the button is changed, run the updateChart function
          d3.select("#selectButtonUsers").on("change", function(event,d) {
              // recover the option that has been chosen
              const selectedOption = d3.select(this).property("value")
              // run the updateChart function with this selected option
              update(selectedOption)
          })
    }
}
