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
    
    createChart = (d, width, height, allKeys, margin, n) => {

        let locale = d3.timeFormatLocale({
            "dateTime": "%A, %e %B %Y г. %X",
            "date": "%d.%m.%Y",
            "time": "%H:%M:%S",
            "periods": ["AM", "PM"],
            "days": ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
            "shortDays": ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
            "months": ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
            "shortMonths": ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
        });

        let formatMillisecond = locale.format(".%L"),
        formatSecond = locale.format(":%S"),
        formatMinute = locale.format("%I:%M"),
        formatHour = locale.format("%I %p"),
        formatDay = locale.format("%a %d"),
        formatWeek = locale.format("%b %d"),
        formatMonth = locale.format("%B"),
        formatYear = locale.format("%Y");

        let formatFocusTextDate = d3.timeFormat("%d-%m-%y %H:%M:%S")

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
            .domain([d3.min(d, function(d) { return +d.value; }) - (d3.min(d, function(d) { return +d.value; })*0.002), 
                d3.max(d, function(d) { return +d.value; }) + (d3.max(d, function(d) { return +d.value; })*0.003)])
            .range([ height, 0 ]);

        let xAxis = svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickFormat(multiFormat));
        
        let yAxis = svg.append("g")
            .call(d3.axisLeft(y).ticks(5));

        // const color = d3.scaleOrdinal(d3.schemeAccent);
        // const color = d3.scaleOrdinal()
        // .range(['#e41a1c','#377eb8','#1f3999','#72277d','#ff7f00','#ffff33','#8a3f15','#e64c9d','#999999', '#080606']);
        const color = ['#e41a1c','#377eb8','#1f3999','#72277d','#ff7f00','#ffff33','#8a3f15','#e64c9d','#999999', '#080606']

        var bisect = d3.bisector(function(d) { return d.date; }).left;
        
        svg
        .append('text')
        .text(d[0].param)
        .attr("x", 0)
        .attr("y", 0)
        .attr('dominant-baseline', 'hanging')
        .attr('text-anchor', 'start')
        .attr('fill', 'black')
        .attr('stroke', 'black')
        .attr("font-size", '1.2em')
        .attr('opacity', 0.5);

        // Create the circle that travels along the curve of chart
        let focus = svg
        .append('g')
        .append('circle')
            .style("fill", "none")
            .attr("stroke", "black")
            .attr('r', 5)
            .style("fill", "black")
            .style("opacity", 0)
        
        // Create the text that travels along the curve of chart
        var focusText = svg
        .append('g')
        .append('text')
            .style("opacity", 0)
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle")
        
        let rect = svg.append("rect")
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr("width", width)
        .attr("height", height)
        .on("mousemove", (event) => {
            let x0 = x.invert(d3.pointer(event)[0])
            var i = bisect(d, x0, 1);
            let SelectedData = d[i]
            focus
                .attr("cx", x(SelectedData.date))
                .attr("cy", y(SelectedData.value))
                .style("opacity", 1)
            focusText
                .html("Дата: " + formatFocusTextDate(SelectedData.date) + "     " + "Значение: " + SelectedData.value)
                //.attr("x", x(SelectedData.date)-74)
                //.attr("y", y(SelectedData.value)-40)
                .attr("x", 5)
                .attr("y", height-10)
                .style("opacity", 1)
        })    

        const clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width )
            .attr("height", height )
            .attr("x", 0)
            .attr("y", 0);
        
        const brush = d3.brushX()                   // Add the brush feature using the d3.brush function
            .extent( [ [0,height-50], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

        const line = svg.append('g')
            .attr("clip-path", "url(#clip)")

        // Add the line
        line.append("path")
            .datum(d)
            .attr("class", "line")  // I add the class line to be able to modify this line later on.
            .attr("fill", "none")
            .attr("stroke", function(d, i){ return color[n] })
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .curve(d3.curveStepBefore)
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.value) })
            )
        
        // Add the brushing
        line
            .append("g")
            //.style("fill", "yellow")
            //.style("opacity", "0.01")
            .style("border", "solid 2px red")
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
            xAxis.transition().duration(1000).call(d3.axisBottom(x).tickFormat(multiFormat))
            line
                .select('.line')
                .transition()
                .duration(1000)
                .attr("d", d3.line()
                .curve(d3.curveStepAfter)
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.value) })
                )
            focus.style("opacity", 0)
            focusText.style("opacity", 0)
        }

        // If user double click, reinitialize the chart
        svg.on("dblclick",function(){
            x.domain(d3.extent(d, function(d) { return d.date; }))
            xAxis.transition().call(d3.axisBottom(x).tickFormat(multiFormat))
            line
                .select('.line')
                .transition()
                .attr("d", d3.line()
                .curve(d3.curveStepAfter)
                .x(function(d) { return x(d.date) })
                .y(function(d) { return y(d.value) })
                )
            focus.style("opacity", 0)
            focusText.style("opacity", 0)
        });
        
        function multiFormat(date) {
            return (d3.timeSecond(date) < date ? formatMillisecond
                : d3.timeMinute(date) < date ? formatSecond
                : d3.timeHour(date) < date ? formatMinute
                : d3.timeDay(date) < date ? formatHour
                : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
                : d3.timeYear(date) < date ? formatMonth
                : formatYear)(date);
          }

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
        let margin = {top: 30, right: 50, bottom: 30, left: 50},
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
            let n = 0;
            allKeys.forEach(data => {
                this.createChart(sumstat.get(data[0]), width, height, allKeys, margin, n);
                n++;
            })
        }
        catch{}
    }
    render(){
        console.log("data_from_kaskad", this.props.data);
        return(
            <div id="my_dataviz"></div>
        )
    }
}