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
        const svg = d3.select("#my_dataviz")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);
        
        let x = d3.scaleTime()
            .domain(d3.extent(d, function(d) { return d.date; }))
            .range([ 0, width ]);

        let y = d3.scaleLinear()
            .domain([d3.min(d, function(d) { return +d.value; }), d3.max(d, function(d) { return +d.value; })])
            .range([ height, 0 ]);

        let xAxis = svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).ticks(3));
        
        let yAxis = svg.append("g")
            .call(d3.axisLeft(y).ticks(5));
        
        const clip = svg.append("defs").append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width )
            .attr("height", height )
            .attr("x", 0)
            .attr("y", 0);
        
        const brush = d3.brushX()                   // Add the brush feature using the d3.brush function
            .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

        const line = svg.append('g')
            .attr("clip-path", "url(#clip)")

        // Add the line
        line.append("path")
            .datum(d)
            .attr("class", "line")  // I add the class line to be able to modify this line later on.
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.value) })
            )
        
        // Add the brushing
        line
            .append("g")
            .attr("class", "brush")
            .call(brush);
        
        // A function that set idleTimeOut to null
        let idleTimeout
        function idled() { idleTimeout = null; }

        // A function that update the chart for given boundaries
        function updateChart(event,d) {

            // What are the selected boundaries?
            var extent = event.selection
    
            // If no selection, back to initial coordinate. Otherwise, update X axis domain
            if(!extent){
            if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
            x.domain([ 4,5])
            }else{
            x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
            line.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
            }
    
            // Update axis and line position
            xAxis.transition().duration(1000).call(d3.axisBottom(x))
            line
                .select('.line')
                .transition()
                .duration(1000)
                .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.value) })
                )
        }

        // If user double click, reinitialize the chart
        svg.on("dblclick",function(){
            x.domain(d3.extent(d, function(d) { return d.date; }))
            xAxis.transition().call(d3.axisBottom(x))
            line
            .select('.line')
            .transition()
            .attr("d", d3.line()
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.value) })
            )
        });


    }

    updateChart(){
        d3.select("#my_dataviz").selectAll("*").remove();

        let contentH = d3.select("#content").node().getBoundingClientRect().height;
        let contentW = d3.select("#content").node().getBoundingClientRect().width;
        let heightW = d3.select("#root").node().getBoundingClientRect().height; //window
        let test = heightW - contentH;
        //console.log("d3 test", contentH, heightW, test);
        let d = this.props.data;
        // set the dimensions and margins of the graph
        let margin = {top: 30, right: 0, bottom: 30, left: 50},
        //width = 810 - margin.left - margin.right
        width = contentW - margin.left - margin.right;
        //Read the data
        try{
            d.forEach(function(data){
                data.date = new Date(data.date)
                data.value = +data.value
                //data.param = data.param
            });
        
        
            d = d.sort(this.sortByDateAscending)
            
            let sumstat = d3.group(d, data => data.param);;
            sumstat = new Map([...sumstat.entries()].sort()); //sort
            // What is the list of groups?
            let allKeys = new Set(d.map(data=>data.param));
            allKeys = new Set([...allKeys.entries()].sort()); //sort
            let height = (test - margin.top - margin.bottom - 60*allKeys.size) / allKeys.size;
            allKeys.forEach(data => {
                console.log("read");
                console.log(sumstat.get(data[0]));
                this.createChart(sumstat.get(data[0]), width, height, allKeys, margin);
            })
            console.log("allKeys", allKeys);
            //this.createChart(sumstat.get("18:18=SUECN_1.AI.Vkhod_1)"), width, height, allKeys, margin);
        }
        catch{}
    }
    render(){
        console.log("afsdfsdgsgd", this.props.data);
        return(
            <div id="my_dataviz"></div>
        )
    }
}