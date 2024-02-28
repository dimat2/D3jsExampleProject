import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";
import { DiagramService } from '../diagram.service';

@Component({
  selector: 'app-dchg',
  templateUrl: './dchg.component.html',
  styleUrls: ['./dchg.component.css']
})
export class DchgComponent implements OnInit {
  ngOnInit(): void {
    this.parseCSVAndBuildDiagram();
  }

  chooseTitle: number = 1;

  chooseSource: number = 0;

  chooseLabel: number = 1;

  dataArray: any[] = [];

  constructor(private diaService: DiagramService) {}

  parseCSVAndBuildDiagram() {
    /*this.diaService.getDiagram().subscribe(dataA => {
      const lines: string[] = dataA.split("\n");
      
      const index: number = lines.indexOf("First user primary channel group (Default Channel Group),New users\r");

      const dataRows: string[] = lines.slice(index + 1, 7 + index + 1);      

      const propertyNames = dataRows[0].slice(0, dataRows[0].indexOf('\n')).split(',');

      propertyNames[0] = "Channel";
      propertyNames[1] = "NewUsers";

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

      this.graphicon(this.dataArray);
    });*/
  }

  private graphicon(paramData): void {   
    
    // set the dimensions and margins of the graph
    const margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 760 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("svg#svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Parse the Data
    const data = paramData;

      data.sort(function(a:any, b:any) {
        return b.NewUsers - a.NewUsers;
      });

      // Add X axis
      const x = d3.scaleLinear()
      .domain([0, 130_000])
      .range([ 0, width]);

      svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");

      // Y axis
      const y = d3.scaleBand()
      .range([ 0, height ])
      .domain(data.map((d:any) => d.Channel))
      .padding(.1);
      svg.append("g")
      .call(d3.axisLeft(y))
      
      //Bars
        
    const tooltip = d3.select("div#toolTip");

    // tooltip events
    const mouseover = function(d) {
      tooltip
        .style("opacity", .9)
      d3.select(this)
        .style("opacity", .5)
    };
    const mousemove = function(event, d) {
    const formater =  d3.format(" ")
      tooltip
      .html(formater(d.NewUsers) + " new users")
      .style("position", "absolute")
      .style("background-color", "#ffffff")
      .style("font-family", "lato")
      .style("font-size", "11px")
      .style("padding", "4px")
      .style("color", "#666666")
      .style("border", "none")
      .style("box-shadow", "0px 0px 3px 0px #E6E6E6")
      .style("left", event.pageX - 10 + "px")
      .style("top", event.pageY + 10 + "px");
    };
    const mouseleave = function(d) {
      tooltip
        .style("opacity", 0)
      d3.select(this)
        .style("opacity", 1)
    };

      svg.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", x(0) )
      .attr("y", (d:any) => y(d.Channel))
      .attr("width", (d:any) => x(d.NewUsers))
      .attr("height", y.bandwidth())
      .attr("fill", "#69b3a2")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
  }
}