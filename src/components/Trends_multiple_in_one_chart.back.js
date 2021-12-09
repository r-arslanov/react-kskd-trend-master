import React from "react";
import * as d3 from "d3";
import { useParams } from "react-router";

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

    createCharts = (sumstat, d, width, height, allKeys, margin) => {

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

        let legendName = [];
        allKeys.forEach(data => {
            legendName.push(data[0])
        });
            
        // color palette
        const color = d3.scaleOrdinal()
        .range(['#e41a1c','#377eb8','#1f3999','#72277d','#ff7f00','#ffff33','#8a3f15','#e64c9d','#999999', '#080606'])
        const colorM = ['#e41a1c','#377eb8','#1f3999','#72277d','#ff7f00','#ffff33','#8a3f15','#e64c9d','#999999', '#080606']

        // append the svg object to the body of the page
        const svg = d3.select("#my_dataviz")
                      .append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom + 70)
                      .append("g")
                      .attr("transform", `translate(${margin.left},${margin.top})`);

        // Add X --> it is a date format
        let x = d3.scaleTime()
                  .domain(d3.extent(d, function(d) { return d.date; }))
                  .range([ 0, width ]);

        // Add Y
        let y = d3.scaleLinear()
                  .domain([d3.min(d, function(d) { return +d.value; }) - (d3.min(d, function(d) { return +d.value; })*0.002), 
                           d3.max(d, function(d) { return +d.value; }) + (d3.max(d, function(d) { return +d.value; })*0.3)
                        ])
                  .range([ height + 50, 0 ]);
        // Add X axis
        let xAxis = svg.append("g")
            .attr("transform", `translate(0, ${height + 50})`)
            .call(d3.axisBottom(x).tickFormat(multiFormat));
        // Add Y axis
        let yAxis = svg.append("g")
            .call(d3.axisLeft(y).ticks(5));

        // Draw the line
        let line = svg.selectAll(".line")
            .data(sumstat)
            .join("path")
            .attr("fill", "none")
            .attr("class", "line")
            .attr("stroke", function(d){ return color(d[0]) })
            .attr("stroke-width", 1.5)
            .attr("d", function(d){
                return d3.line()
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.value); })
                (d[1])
            })
        
        //start - Legend - start
        svg.selectAll("rect")
            .data(legendName)
            .enter()
                .append("rect")
                    .attr("x", width - 200)
                    .attr("y", function(d, i){ return i * 20})
                    .attr("width", 10)
                    .attr("height", 10)
                    .style("fill", function(d, i) { return colorM[i] })

        svg.selectAll("text.legend-text")
            .data(legendName)
            .enter().append("text")
            .attr("x", width - 180)
            .attr("y", function(d, i){ return (i * 20) + 9})
            .text(function(d, i) { return legendName[i] })
        //end - Legend - end
        
        //start - pointer - start
        let mouseG = svg.append("g")
            .attr("class", "mouse-over-effects");

        mouseG.append("path") // this is the black vertical line to follow mouse
            .attr("class", "mouse-line")
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .style("opacity", "0");

        let lines = document.getElementsByClassName('line');

        let mousePerLine = mouseG.selectAll('.mouse-per-line')
            .data(sumstat)
            .enter()
            .append("g")
            .attr("class", "mouse-per-line");

        mousePerLine.append("circle")
            .attr("r", 7)
            .style("stroke", function(d) {
                return color(d.name);
            })
            .style("fill", "none")
            .style("stroke-width", "1px")
            .style("opacity", "0");
    
        mousePerLine.append("text")
            .attr("transform", "translate(10,3)")

        mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
            .attr('width', width) // can't catch mouse events on a g element
            .attr('height', height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .on('mouseover', function() { // on mouse in show line, circles and text
                d3.select(".mouse-line")
                  .style("opacity", "1");
                d3.selectAll(".mouse-per-line circle")
                  .style("opacity", "1");
                d3.selectAll(".mouse-per-line text")
                  .style("opacity", "1");
              })
              
              .on('mousemove', function(event) { // mouse moving over canvas
                let mouse = d3.pointer(event);
                d3.select(".mouse-line")
                  .attr("d", function() {
                    var d = "M" + mouse[0] + "," + height;
                    d += " " + mouse[0] + "," + 0;
                    return d;
                  });
        
                d3.selectAll(".mouse-per-line")
                  .attr("transform", function(d, i) {
                    let xDate = x.invert(mouse[0]),
                    bisect = d3.bisector(function(d) { return d.date; }).right;
                    let idx = bisect(d.values, xDate);
                    
                    let beginning = 0,
                        end = d3.select(lines[i]).node().getTotalLength(),
                        target,
                        pos;
        
                    while (true){
                      target = Math.floor((beginning + end) / 2);
                      pos = d3.select(lines[i]).node().getPointAtLength(target);
                      if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                          break;
                      }
                      if (pos.x > mouse[0]) end = target;
                      else if (pos.x < mouse[0]) beginning = target;
                      else break; //position found
                    }
                    
                    d3.select(this).select('text')
                      .text(y.invert(pos.y).toFixed(2))
                      .attr("font-weight", "bold")
                      
                    return "translate(" + mouse[0] + "," + pos.y +")";
                  });
              });
        //end - pointer - end

        //add zoom

        //===================================================== mb need in future
        // svg.append("rect")
        // .attr('x', width - 200)
        // .attr('y', function(d, i){ return i *  20;})
        // .attr('width', 10)
        // .attr('height', 10)
        // .style("fill", function(d, i) { return colorM[i] });

        // svg.append("text")
        // .attr('x', width - 180)
        // .attr('y', function(d, i){ return (i *  20) + 9;})
        // .text(function(d, i) { return legendName[i] });

        /* Пока что работает не очень и занимает много места
        const legend = d3.select(".Trends").append("div")
                .attr("class", "legends")
            // .append("svg")
            //     .attr("class", "legend")
            //     .attr("width", 300)
            //     .attr("height", 80)

        legend.selectAll("circle")
            .data(legendName)
            .enter().append("div")
                .attr("class", "legend")
            .append("svg")
                .attr("width", 300)
                .attr("height", 80)
            .append("circle")
                .attr("cx", 10)                 
                .attr("cy", function(d, i) { return 15 + i*10 })
                .attr("r", 6)
                .style("fill", function(d, i) { return colorM[i] })

        legend.selectAll("text")
            .data(legendName)
            .enter().append("text")
                .attr("x", 25)
                .attr("y", function(d, i) { return 15 + i*10 })
                .text(function(d, i) { return legendName[i] })
                .style("font-size", "15px")
                .attr("alignment-baseline","middle")
        */
        //legend.append("text").attr("x", 25).attr("y", 15).text(legendName[0]).style("font-size", "15px").attr("alignment-baseline","middle")
        // const legend = d3.select(".Trends").append("div")
        //     .append("svg")
        //     .attr("class", "legends")
        //     .attr("width", width + margin.left + margin.right)
        //     .attr("height", 80)
        // legend.append("circle").attr("cx",30).attr("cy",10).attr("r", 6).style("fill", "#e41a1c")
        // legend.append("circle").attr("cx",30).attr("cy",30).attr("r", 6).style("fill", "#377eb8")
        // legend.append("text").attr("x", 50).attr("y", 10).text(legendName[0]).style("font-size", "15px").attr("alignment-baseline","middle")
        // legend.append("text").attr("x", 50).attr("y", 30).text(legendName[1]).style("font-size", "15px").attr("alignment-baseline","middle")
        //==================================================================================================
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
        d3.select(".Trends").select(".legends").remove();

        let contentH = d3.select("#content").node().getBoundingClientRect().height;
        let contentW = d3.select("#content").node().getBoundingClientRect().width;
        let heightW = d3.select("#root").node().getBoundingClientRect().height; //window
        let test = heightW - contentH;
        let d = this.props.data;
        // set the dimensions and margins of the graph
        let margin = {top: 30, right: 70, bottom: 50, left: 70},
        width = contentW - margin.left - margin.right;
        //Read the data
        try{
            d.forEach(function(data){
                data.date = new Date(data.date)
                data.value = data.value
                data.param = data.param
            });
        
        
            d = d.sort(this.sortByDateAscending)
            
            let sumstat = d3.group(d, data => data.param);;
            sumstat = new Map([...sumstat.entries()].sort()); //sort
            // What is the list of groups?
            let allKeys = new Set(d.map(data=>data.param));
            allKeys = new Set([...allKeys.entries()].sort()); //sort
            //let height = (test - margin.top - margin.bottom - 60*allKeys.size) / allKeys.size;
            let height = test- margin.top - margin.bottom - 100;
            this.createCharts(sumstat, d, width, height, allKeys, margin);
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

// const Trends = (props) => {
//     // const local_trend = new Trends_local(props);
//     const {sys, num} = useParams();
//     console.log("================================================================",sys, num);
//     return(
//         <Trends_local data={props.data} />
//     );
// }

// export default Trends