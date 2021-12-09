import React from "react";
import * as d3 from "d3";

export default class Trends extends React.Component {

    componentDidMount() {
        this.updateChart();
    }

    componentDidUpdate() {
        this.updateChart();
    }

    sortByDateAscending(a, b) {
        // Dates will be cast to numbers automagically:
        return a.date - b.date;
        }

    getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
        }

    updateChart(){

      d3.select("#my_dataviz").selectAll("*").remove();

      let contentH = d3.select("#content").node().getBoundingClientRect().height;
      let contentW = d3.select("#content").node().getBoundingClientRect().width;
      let heightW = d3.select("#root").node().getBoundingClientRect().height; //window
      let test = heightW - contentH
      //console.log("d3 test", contentH, heightW, test);
      let d = this.props.data;
      // set the dimensions and margins of the graph
      let margin = {top: 30, right: 0, bottom: 30, left: 50},
      //width = 810 - margin.left - margin.right
      width = contentW - margin.left - margin.right
      //Read the data
      try{
          d.forEach(function(data){
              data.date = new Date(data.date)
              data.value = +data.value
              //data.param = data.param
          });
      
      
        d = d.sort(this.sortByDateAscending)
        
        let sumstat = d3.group(d, data => data.param);
        sumstat = new Map([...sumstat.entries()].sort()); //sort
        console.log("sumstat", sumstat);
        // What is the list of groups?
        let allKeys = new Set(d.map(data=>data.param))
        allKeys = new Set([...allKeys.entries()].sort()); //sort
        let height = (test - margin.top - margin.bottom - 60*allKeys.size) / allKeys.size
        console.log("allKey", allKeys);
        
        // Add an svg element for each group. The will be one beside each other and will go on the next row when no more room available
        let svg = d3.select("#my_dataviz")
            .selectAll("uniqueChart")
            .data(sumstat)
            .enter()
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", 
                    `translate(${margin.left},${margin.top})`);

        // Add X axis --> it is a date format
        let x = d3.scaleTime()
            .domain(d3.extent(d, function(d) { return d.date; }))
            .range([ 0, width ]);
        

        //Add Y axis
        let y = d3.scaleLinear()
            .domain([d3.min(d, function(d) { return +d.value; }), d3.max(d, function(d) { return +d.value; })])
            .range([ height, 0 ]);
        
        //x axis draw
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            //.attr("transform", `translate(0, ${y(0)})`)
            .call(d3.axisBottom(x).ticks(3));
        //y axis draw
        svg.append("g")
            .call(d3.axisLeft(y).ticks(5));

        // color palette
        let color = d3.scaleOrdinal()
            .domain(allKeys)
            .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

        // Draw the line
        svg
            .append("path")
            .attr("fill", "none")
            .attr("stroke", function(d){ return color(d[0]) })
            .attr("stroke-width", 1.9)
            .attr("d", function(d){
                return d3.line()
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(+d.value); })
                .curve(d3.curveStepAfter)
                (d[1])
            })

        // Add titles
        svg
            .append("text")
            .attr("text-anchor", "start")
            .attr("y", -5)
            .attr("x", 0)
            .text(function(d){ return(d[0])})
            .style("fill", function(d){ return color(d[0]) })
        }
    catch(err){

    }
    }

    render(){
        console.log("afsdfsdgsgd", this.props.data);
        return(
            <div id="my_dataviz"></div>
        )
    }
}
