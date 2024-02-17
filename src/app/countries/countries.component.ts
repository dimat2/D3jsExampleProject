import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from "d3";
import d3Tip from "d3-tip"

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit, OnChanges, OnDestroy {

  constructor() {}
  ngOnDestroy(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnInit(): void {   
    this.graphicon_hor();
  }

  private async graphicon_hor(): Promise<void> {   
    
    // set the dimensions and margins of the graph
    const margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 760 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const svg = d3.select("figure#countries")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Parse the Data
    d3.csv("assets/4_countries.csv").then( function(data) {

      data.sort(function(a:any, b:any) {
        return b.Users - a.Users;
      })

      // Add X axis
      const x = d3.scaleLinear()
      .domain([0, 13000])
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
      .domain(data.map((d:any) => d.Country))
      .padding(.1);
      svg.append("g")
      .call(d3.axisLeft(y))
      
      //Bars
        
    const tooltip = d3.select("figure#countries").append("div").attr("class", "toolTip");

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
      .html(formater(d.Users))
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
      .attr("y", (d:any) => y(d.Country))
      .attr("width", (d:any) => x(d.Users))
      .attr("height", y.bandwidth())
      .attr("fill", "#69b3a2")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
  })
  }
}