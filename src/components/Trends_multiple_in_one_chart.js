
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

    getWidthElement(svg, i, max_width, current_line){
        var x = 0, y = 0;
        if(i !== 0){
            if((svg.nodes()[0].childNodes[i-1].getBBox().width*2 + svg.nodes()[0].childNodes[i-1].getBBox().x) < max_width){
                x = svg.nodes()[0].childNodes[i-1].getBBox().width + svg.nodes()[0].childNodes[i-1].getBBox().x;
                y = current_line * 20;
            }else{
                current_line++;
                x = 0
                y = current_line * 20;
            }
        }
        return {x, y, current_line};
    }

    updateChart(){
        d3.select("#my_dataviz").selectAll("*").remove();
        d3.select(".Trends").select(".legends").remove();
        let locale = d3.timeFormatLocale({
            "dateTime": "%A, %e %B %Y г. %X",
            "date": "%d.%m.%Y",
            "time": "%HH:%MM:%S",
            "periods": ["AM", "PM"],
            "days": ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
            "shortDays": ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
            "months": ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
            "shortMonths": ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
        });

        d3.timeFormatDefaultLocale({
            "dateTime": "%A, %e %B %Y г. %X",
            "date": "%d.%m.%Y",
            "time": "%HH:%MM:%S",
            "periods": ["AM", "PM"],
            "days": ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
            "shortDays": ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
            "months": ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
            "shortMonths": ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
        });

        let formatMillisecond = locale.format(".%L"),
            formatSecond = locale.format(":%S"),
            formatMinute = locale.format("%H:%M"),
            formatHour = locale.format("%H"),
            formatDay = locale.format("%a %d"),
            formatWeek = locale.format("%b %d"),
            formatMonth = locale.format("%B"),
            formatYear = locale.format("%Y");

        function multiFormat(date) {
            return (d3.timeSecond(date) < date ? formatMillisecond
                : d3.timeMinute(date) < date ? formatSecond
                : d3.timeHour(date) < date ? formatMinute
                : d3.timeDay(date) < date ? formatHour
                : d3.timeMonth(date) < date ? (d3.timeWeek(date) < date ? formatDay : formatWeek)
                : d3.timeYear(date) < date ? formatMonth
                : formatYear)(date);
            }
        let data = this.props.data;
        let sumstat = d3.group(data, d => d.param);
            sumstat = new Map([...sumstat.entries()].sort()); //sort

        // Calculate Margins and canvas dimensions
        console.log(d3.select(".Picker").node().getBoundingClientRect());
        let size_top_bar = d3.select(".Picker").node().getBoundingClientRect().height;
        let dim_res = this.getWindowDimensions();
        let margin = {top: 10, right: 40, bottom: 40, left: 40},
            root_m = {top: 5, right: 5, bottom: 5, left: 5},
            width = dim_res.width - margin.left - margin.right,
            height = dim_res.height - margin.top - margin.bottom,
            
            svg_width = dim_res.width - root_m.left - root_m.right*2,
            svg_height = dim_res.height - root_m.top - root_m.bottom*2 - size_top_bar,
            
            y_max = d3.max(data, (d) => { return +d.value; }),
            y_min = d3.min(data, (d) => { return +d.value; });
        
        console.log("==========================================");
        console.log(dim_res, margin, width, height, `this is height: ${height}`);
        console.log('sumstat', sumstat)
        console.log("==========================================");
        // color palette
        const color = d3.scaleOrdinal()
                .range(['#e41a1c','#377eb8','#1f3999','#72277d','#ff7f00','#ffff33','#8a3f15','#e64c9d','#999999', '#080606']);
// ====================================== start legend ================================
        const lsvg = d3.select("#my_dataviz")
                        .append("svg")
                            .attr("width", svg_width)
                            .attr("height", 20)
                            .style("background-color", "#dddddd")
        let counter = 0, cur_line = 0;
        sumstat.forEach((value, key, map) => {
            let rect = this.getWidthElement(lsvg, counter, svg_width, cur_line);
            lsvg.datum(map[key])
                .append("text")
                    .attr("x", 10 + rect.x)
                    .attr("y", 10 + rect.y)
                    .style("fill", color(key))
                    .text(key)
                    .attr("text-anchor", "left")
                    .style("alignment-baseline", "middle"); 
            counter++;
            cur_line = rect.current_line;
        });
        d3.select("#my_dataviz").selectChildren("svg").attr("height", (cur_line+1) * 20);
        svg_height -= (cur_line+1) * 25;
        
// ================================ start graph =========================================

        const svg = d3.select("#my_dataviz")
                        .append("svg")
                            .attr("width", '100%')
                            // .attr("height", '100%')
                            .attr('viewBox', '0 0 ' + svg_width + ' ' + svg_height)
                            .attr('preserveAspectRatio', 'xMaxYMin')
        
        let graph = svg.append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let x = d3.scaleTime().range([0, svg_width - 30]).domain(d3.extent(data, (d) => { return new Date(d.date) })),
            y = d3.scaleLinear().range([svg_height - 30, 0]),
            z = d3.scaleOrdinal(d3.schemeCategory10),
            rescaledX = x;
        let xAxis = d3.axisBottom(x),
            yAxis = d3.axisLeft(y);

        let zoom = d3.zoom()
                        .scaleExtent([1, 8000])
                        .on("zoom", (event) => {
                            let newX = event.transform.rescaleX(x);
                            d_line.selectAll(".line")
                                        .attr("d", d=>{return d3.line()
                                                                .curve(d3.curveStepBefore)
                                                                .x(d => { return newX(new Date(d.date))})
                                                                .y(d => { return y(d.value)})(d[1])
                                                            });
                            graph.select(".axis--x").call(d3.axisBottom(newX).tickFormat(multiFormat));
                            rescaledX = newX;
                            this.props.switchAct();
                        });

        var line = d3.line()
                    .curve(d3.curveStepBefore)
                    .x(d => { return x(new Date(d.date))})
                    .y(d => { return y(d.value)});

        y.domain([y_min, y_max]);
        z.domain(data.map( (d)=> { return d.param} ))

        graph.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", `translate(0, ${svg_height - 30} )` )
            .call(xAxis.tickFormat(multiFormat));

        graph.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis)

        let d_line = graph.selectAll(".line")
                        .data(sumstat)
                        .enter()
                        .append("g")
                            .attr("class", "line");
            svg.append("clipPath")
                .attr("id", "clip")
                .append("rect")
                    .attr("width", svg_width - margin.right)
                    .attr("height", svg_height - margin.top *3)

        let path = d_line.append("path")
                        .attr("clip-path", "url(#clip)")
                        .attr("class", "line")
                        .attr("fill", "none")
                        .attr("d", d => { return line(d[1]) })
                        .style("stroke", (d) => { return color(d[0]) });

        svg.call(zoom);
//====================== start pointer =================================
let mouseG = graph.append("g")
                    .attr("class", "mouse-over-effects")
                    .attr("clip-path", "url(#clip)");

    mouseG.append("path") // this is the black vertical line to follow mouse
                    .attr("class", "mouse-line")
                    .style("stroke", "black")
                    .style("stroke-width", "1px");

let lines = svg.selectAll("path.line").nodes();
let mousePerLine = mouseG.selectAll('.mouse-per-line')
                    .data(sumstat)
                    .enter()
                    .append("g")
                    .attr("class", "mouse-per-line");

mousePerLine.append("circle")
                .attr("r", 7)
                .style("stroke", function(d) { return color(d[0]); })
                .style("fill", function(d) { return color(d[0]); })
                .style("stroke-width", "1px")
                .style("opacity", "1");

                
mousePerLine.append("rect")
                .attr("class", "tooltip")
                .attr("transform", "translate(10,3)")
                .style("fill", function(d) { return color(d[0]); })

mousePerLine.append("text")
                .attr("id", "val-text")
                .attr("transform", "translate(10,3)")
                
mousePerLine.append("text")
                .attr("id", "date-text")
                .attr("transform", "translate(10,3)")
                // .style("fill", function(d) { return color(d[0]); })

mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
                .attr('width', svg_width) // can't catch mouse events on a g element
                .attr('height', svg_height)
                .attr('fill', 'none')
                .attr('pointer-events', 'all')
                .on('mouseover', function() { // on mouse in show line, circles and text
                    d3.select(".mouse-line")
                            .style("opacity", "1");
                    d3.selectAll(".mouse-per-line circle")
                            .style("opacity", "1");
                    d3.selectAll(".mouse-per-line text")
                            .style("opacity", "1");
                    d3.selectAll(".tooltip")
                            .style("opacity", "0.8");
                })
  
  .on('mousemove', function(event) { // mouse moving over canvas]
    let mouse = d3.pointer(event);
    d3.select(".mouse-line")
      .attr("d", function() {
        var d = "M" + mouse[0] + "," + height;
        d += " " + mouse[0] + "," + 0;
        return d;
      });
    
    d3.selectAll(".mouse-per-line")
      .attr("transform", function(d, i) {
        let xDate = rescaledX.invert(mouse[0]),
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
        
        let str_time = rescaledX.invert(pos.x).toLocaleString();
        d3.select(this).selectAll("#val-text")
                .text(y.invert(pos.y).toFixed(2))
                .attr("transform", "translate(15,18)")
        d3.select(this).selectAll("#date-text")
                .text(str_time)
                .attr("transform", "translate(15,38)")
        let w_text = svg.selectAll("g.mouse-per-line").nodes()[0].childNodes[3].getBBox().width + 10;
        d3.select(this).selectAll("rect.tooltip")
            .attr('width', w_text)
            .attr('height', 40)
            
        return "translate(" + mouse[0] + "," + pos.y +")";
      });
  });
//end - pointer - end        
    }

    

    render(){
        return(
            <div id="my_dataviz"></div>
        )
    }
}