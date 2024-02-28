import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import * as d3 from "d3";
import { DiagramService } from '../diagram.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  dataArray: any[] = [];

  constructor(private diaService: DiagramService) {}

  ngOnInit(): void {
    this.parseCSVAndBuildDiagram();
  }

  parseCSVAndBuildDiagram() {
    /*this.diaService.getDiagram().subscribe(dataA => {
      const lines: string[] = dataA.split("\n");
      
      const index: number = lines.indexOf("Nth day,Users\r");

      const index2: number = lines.indexOf("Nth day,New users\r");

      const startDate = lines[index - 2].split(": ");

      const startDateOK = startDate[1].substring(6, 8);

      const endDate = lines[index - 1].split(": ");

      const endDateOK = endDate[1].substring(6, 8);
      
      const days = parseInt(endDateOK) - parseInt(startDateOK);

      const dataRows: string[] = lines.slice(index + 1, days + 1 + index + 1);  

      const dataRows2: string[] = lines.slice(index2 + 1, days + 1 + index2 + 1);  

      for (let i = 0; i < dataRows.length; i++) {
        dataRows[i] = dataRows[i] + ",Users";
      }

      for (let i = 0; i < dataRows2.length; i++) {
        dataRows2[i] = dataRows2[i] + ",New users";
      }

      const dataRows3 = dataRows.concat(dataRows2);

      const propertyNames = dataRows[0].slice(0, dataRows[0].indexOf('\n')).split(',');

      propertyNames[0] = "Date";
      propertyNames[1] = "Users";
      propertyNames[2] = "Group";

      dataRows3.forEach((row) => {
  
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
        d.Date = startDate[1].substring(0, 6) + (parseInt(d.Date) + 1).toString().padStart(2, "0")
      });

      this.graphicon(this.dataArray);
    });*/
  }

  private graphicon(paramData): void {    
  
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
    const data = paramData;
  
    const parseTime = d3.timeParse("%Y%m%d");
  
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
      .text(function (d:any) { return d; }) // text showed in the menu
      .attr("value", function (d:any) { return d; }); // corresponding value returned by the button

    // A color scale: one color for each group
    const myColor = d3.scaleOrdinal()
      .domain(<any>allGroup)
      .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    const x = d3.scaleTime()
      .domain(<any>d3.extent(data, function(d:any) { return d.Date; }))
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
