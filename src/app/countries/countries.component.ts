import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";
import d3Tip from "d3-tip"
import { DiagramService } from '../diagram.service';
import { CountryCode } from '../data';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})

export class CountriesComponent implements OnInit {

  contries : CountryCode[] = [
    {country:"Arab Emirates",code:"AE"},
    {country:"Austria",code:"AT"},
    {country:"Australia",code:"AU"},
    {country:"Bosnia",code:"BA"},
    {country:"Belgium",code:"BE"},
    {country:"Brazil",code:"BR"},
    {country:"Canada",code:"CA"},
    {country:"Switzerland",code:"CH"},
    {country:"China",code:"CN"},
    {country:"Cyprus",code:"CY"},
    {country:"Czechia",code:"CZ"},
    {country:"Germany",code:"DE"},
    {country:"Denmark",code:"DK"},
    {country:"Egypt",code:"EG"},
    {country:"Spain",code:"ES"},
    {country:"Finland",code:"FI"},
    {country:"France",code:"FR"},
    {country:"United Kingdom",code:"GB"},
    {country:"Greece",code:"GR"},
    {country:"Croatia",code:"HR"},
    {country:"Hungary",code:"HU"},
    {country:"Indonesia",code:"ID"},
    {country:"Ireland",code:"IE"},
    {country:"Israel",code:"IL"},
    {country:"Iceland",code:"IS"},
    {country:"Italy",code:"IT"},
    {country:"Japan",code:"JP"},
    {country:"Luxembourg",code:"LU"},
    {country:"Malta",code:"MT"},
    {country:"Netherlands",code:"NL"},
    {country:"Norway",code:"NO"},
    {country:"New Zealand",code:"NZ"},
    {country:"Poland",code:"PL"},
    {country:"Portugal",code:"PT"},
    {country:"Romania",code:"RO"},
    {country:"Serbia",code:"RS"},
    {country:"Sweden",code:"SE"},
    {country:"Slovenia",code:"SI"},
    {country:"Slovakia",code:"SK"},
    {country:"Thailand",code:"TH"},
    {country:"Turkey",code:"TR"},
    {country:"Ukraine",code:"UA"},
    {country:"United States",code:"US"}
    ];

  dataArray: any[] = [];

  constructor(private diaService: DiagramService) {}

    ngOnInit(): void {
      this.parseCSVAndBuildDiagram();
    }

  parseCSVAndBuildDiagram() {
    this.diaService.getDiagram().subscribe(dataA => {
      const lines: string[] = dataA.split("\n");
      
      const index: number = lines.indexOf("Country ID,Users\r");

      const dataRows: string[] = lines.slice(index + 1, this.contries.length + index + 1);  

      const propertyNames = dataRows[0].slice(0, dataRows[0].indexOf('\n')).split(',');

      propertyNames[0] = "Country";
      propertyNames[1] = "Users";

      dataRows.forEach((row) => {
  
        let values = row.split(',');
  
        for (let i = 0; i < this.contries.length; i++) {
          if (this.contries[i].code == values[0]) {
            values[0] = this.contries[i].country;
          }
        }

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
    });
  }

  private graphicon(paramData): void {   
    
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
     const data = paramData;//d3.csv("assets/4_countries.csv").then( function(data) {

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
  }
}