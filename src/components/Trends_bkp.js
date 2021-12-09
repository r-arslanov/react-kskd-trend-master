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
    
    createChart = (d, width, height, allKeys, margin) => {
        let svg = d3.select("#my_dataviz")
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
        
        var bisect = d3.bisector(function(d) { return d.date; }).left;

        // Create the circle that travels along the curve of chart
        var focus = svg
        .append('g')
        .append('circle')
            .style("fill", "none")
            .attr("stroke", "black")
            .attr('r', 8.5)
            .style("opacity", 0)
        
        // Create the text that travels along the curve of chart
        var focusText = svg
        .append('g')
        .append('text')
            .style("opacity", 0)
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle")

        // color palette
        let color = d3.scaleOrdinal()
        .domain(allKeys)
        .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

        // Add the line
        svg
        .append("path")
        .datum(d)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
        .x(function(d) { return x(d.date) })
        .y(function(d) { return y(d.value) })
        .curve(d3.curveStepAfter)
        )

        // Create a rect on top of the svg area: this rectangle recovers mouse position
        svg
        .append('rect')
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('width', width)
        .attr('height', height)
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);

            // What happens when the mouse move -> show the annotations at the right positions.
        function mouseover() {
            focus.style("opacity", 1)
            focusText.style("opacity",1)
        }

        function mousemove() {
            // recover coordinate we need
            console.log("d", d);
            let x0 = x.invert(d3.pointer(this)[0]);
            let test = d3.pointers(this);
            console.log("test", test);
            console.log("x0", x0);
            let i = bisect(d, x0, 1);
            let selectedData = d[i]
            console.log("selectedData", selectedData);
            focus
            .attr("cx", x(selectedData.date))
            .attr("cy", y(selectedData.value))
            focusText
            .html("x:" + selectedData.date + "  -  " + "y:" + selectedData.value)
            .attr("x", x(selectedData.date)+15)
            .attr("y", y(selectedData.value))
            }
        function mouseout() {
            focus.style("opacity", 0)
            focusText.style("opacity", 0)
            }
    return svg.node();
    }

    updateChart(){

        d3.select("#my_dataviz").selectAll("*").remove();

        let contentH = d3.select("#content").node().getBoundingClientRect().height;
        let heightW = d3.select("#root").node().getBoundingClientRect().height; //window
        let test = heightW - contentH
        //console.log("d3 test", contentH, heightW, test);
        let d = this.props.data;
        // set the dimensions and margins of the graph
        let margin = {top: 30, right: 0, bottom: 30, left: 50},
        width = 810 - margin.left - margin.right
  
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
          let keys = sumstat.keys();
          console.log("keys", keys.next().value);
          console.log("keys", keys.next().value);
          //console.log("sumstat", sumstat.get("18:18=SUECN_1.AI.Vkhod_1)"));
          console.log("sumstat");
          // What is the list of groups?
          let allKeys = new Set(d.map(data=>data.param))
          allKeys = new Set([...allKeys.entries()].sort()); //sort
          let height = (test - margin.top - margin.bottom - 60*allKeys.size) / allKeys.size
          console.log("allKey", allKeys);
          //SparkData.map(x => InteractiveSparkChart(x))
          
          //sumstat.map(data => this.createChart(data, width, height, allKeys, margin))
          this.createChart(sumstat.get("18:18=SUECN_1.AI.Vkhod_1)"), width, height, allKeys, margin);
        }
        catch(err){
            console.log(err);
        }
        
    }
    render(){
        //console.log("afsdfsdgsgd", this.props.data);
        return(
            <div id="my_dataviz"></div>
        )
    }
}