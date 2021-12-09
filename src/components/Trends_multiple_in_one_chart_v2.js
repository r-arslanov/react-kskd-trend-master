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

    createChart = (data) => {
        console.log("DATA", data);
        let width = 900,
        height = 500;

        var svg = d3.select("#my_dataviz").append("svg")
        .attr("width", width)
        .attr("height", height)
  
        /*
        Brush & Zoom area chart block to work with mulit-line charts.
        Combining d3-brush and d3-zoom to implement Focus + Context.

        The focus chart is the main larger one where the zooming occurs.
        The context chart is the smaller one below where the brush is used to specify a focused area.
        */

        // sets margins for both charts
        var focusChartMargin = { top: 20, right: 20, bottom: 170, left: 60 };
        var contextChartMargin = { top: 360, right: 20, bottom: 90, left: 60 };

        // width of both charts
        var chartWidth = width - focusChartMargin.left - focusChartMargin.right;

        // height of either chart
        var focusChartHeight = height - focusChartMargin.top - focusChartMargin.bottom;
        var contextChartHeight = height - contextChartMargin.top - contextChartMargin.bottom;

        // bootstraps the d3 parent selection
        svg
            .append("svg")
            .attr("width", chartWidth + focusChartMargin.left + focusChartMargin.right)
            .attr("height", focusChartHeight + focusChartMargin.top + focusChartMargin.bottom)
            .append("g")
            .attr("transform", "translate(" + focusChartMargin.left + "," + focusChartMargin.top + ")")
            .attr("overflow", "visible");

        // function to parse date field
        var parseTime = d3.timeParse("%H:%M");

        // group all dates to get range for x axis later
        var dates = [];
        // group y axis values (value) of all lines to x axis (key)
        var groupValuesByX = {};
        for (let key of data.keys()) {
            console.log("KEY", key);
            data.get(key).forEach(bucketRecord => {
                console.log("bucketRecord", bucketRecord.date);
            dates.push(parseTime(bucketRecord.date));

            !(parseTime(bucketRecord.date) in groupValuesByX) && (groupValuesByX[parseTime(bucketRecord.date)] = {}); // if date as key does not exist then create
            groupValuesByX[parseTime(bucketRecord.date)][key] = bucketRecord.conversion;
            });
            
        }
        var availableDates = Object.keys(groupValuesByX);
        availableDates.sort(); // sort dates in increasing order
        console.log(groupValuesByX);
        console.log(availableDates);

        //get max Y axis value by searching for the highest conversion rate
        var maxYAxisValue = -Infinity;
        for (let key of Object.keys(data)) {
            let maxYAxisValuePerBucket = Math.ceil(d3.max(data[key], d => d["conversion"]));
            maxYAxisValue = Math.max(maxYAxisValuePerBucket, maxYAxisValue);
        }

        // set the height of both y axis
        var yFocus = d3.scaleLinear().range([focusChartHeight, 0]);
        var yContext = d3.scaleLinear().range([contextChartHeight, 0]);

        // set the width of both x axis
        var xFocus = d3.scaleTime().range([0, chartWidth]);
        var xContext = d3.scaleTime().range([0, chartWidth]);

        // create both x axis to be rendered
        var xAxisFocus = d3
            .axisBottom(xFocus)
            .ticks(10)
            .tickFormat(d3.timeFormat("%H:%M"));
        var xAxisContext = d3
            .axisBottom(xContext)
            .ticks(10)
            .tickFormat(d3.timeFormat("%H:%M"));

        // create the one y axis to be rendered
        var yAxisFocus = d3.axisLeft(yFocus).tickFormat(d => d + "%");

        // build brush
        var brush = d3
            .brushX()
            .extent([
            [0, -10],
            [chartWidth, contextChartHeight]
            ])
            .on("brush end", brushed);

        // build zoom for the focus chart
        // as specified in "filter" - zooming in/out can be done by pinching on the trackpad while mouse is over focus chart
        // zooming in can also be done by double clicking while mouse is over focus chart
        var zoom = d3
            .zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([
            [0, 0],
            [chartWidth, focusChartHeight]
            ])
            .extent([
            [0, 0],
            [chartWidth, focusChartHeight]
            ])
            .on("zoom", zoomed)
            .filter((event) => event.ctrlKey || event.type === "dblclick" || event.type === "mousedown");

        // create a line for focus chart
        var lineFocus = d3
            .line()
            .x(d => xFocus(parseTime(d.date)))
            .y(d => yFocus(d.conversion));

        // create line for context chart
        var lineContext = d3
            .line()
            .x(d => xContext(parseTime(d.date)))
            .y(d => yContext(d.conversion));

        // es lint disabled here so react won't warn about not using variable "clip"
        /* eslint-disable */

        // clip is created so when the focus chart is zoomed in the data lines don't extend past the borders
        var clip = svg
            .append("defs")
            .append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", chartWidth)
            .attr("height", focusChartHeight)
            .attr("x", 0)
            .attr("y", 0);

        // append the clip
        var focusChartLines = svg
            .append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + focusChartMargin.left + "," + focusChartMargin.top + ")")
            .attr("clip-path", "url(#clip)");

        /* eslint-enable */

        // create focus chart
        var focus = svg
            .append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + focusChartMargin.left + "," + focusChartMargin.top + ")");

        // create context chart
        var context = svg
            .append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + contextChartMargin.left + "," + (contextChartMargin.top + 50) + ")");

        // add data info to axis
        xFocus.domain(d3.extent(dates));
        yFocus.domain([0, maxYAxisValue]);
        xContext.domain(d3.extent(dates));
        yContext.domain(yFocus.domain());

        // add axis to focus chart
        focus
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + focusChartHeight + ")")
            .call(xAxisFocus);
        focus
            .append("g")
            .attr("class", "y-axis")
            .call(yAxisFocus);

        // get list of bucket names
        var bucketNames = [];
        for (let key of Object.keys(data)) {
            bucketNames.push(key);
        }

        // match colors to bucket name
        var colors = d3
            .scaleOrdinal()
            .domain(bucketNames)
            .range(["#3498db", "#3cab4b", "#e74c3c", "#73169e", "#2ecc71"]);

        // go through data and create/append lines to both charts
        for (let key of Object.keys(data)) {
            let bucket = data[key];
            focusChartLines
            .append("path")
            .datum(bucket)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", d => colors(key))
            .attr("stroke-width", 1.5)
            .attr("d", lineFocus);
            context
            .append("path")
            .datum(bucket)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", d => colors(key))
            .attr("stroke-width", 1.5)
            .attr("d", lineContext);
        }

        // add x axis to context chart (y axis is not needed)
        context
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + contextChartHeight + ")")
            .call(xAxisContext);

        // add bush to context chart
        var contextBrush = context
            .append("g")
            .attr("class", "brush")
            .call(brush);

        // style brush resize handle
        var brushHandlePath = d => {
            var e = +(d.type === "e"),
            x = e ? 1 : -1,
            y = contextChartHeight + 10;
            return (
            "M" +
            0.5 * x +
            "," +
            y +
            "A6,6 0 0 " +
            e +
            " " +
            6.5 * x +
            "," +
            (y + 6) +
            "V" +
            (2 * y - 6) +
            "A6,6 0 0 " +
            e +
            " " +
            0.5 * x +
            "," +
            2 * y +
            "Z" +
            "M" +
            2.5 * x +
            "," +
            (y + 8) +
            "V" +
            (2 * y - 8) +
            "M" +
            4.5 * x +
            "," +
            (y + 8) +
            "V" +
            (2 * y - 8)
            );
        };

        var brushHandle = contextBrush
            .selectAll(".handle--custom")
            .data([{ type: "w" }, { type: "e" }])
            .enter()
            .append("path")
            .attr("class", "handle--custom")
            .attr("stroke", "#000")
            .attr("cursor", "ew-resize")
            .attr("d", brushHandlePath);

        // overlay the zoom area rectangle on top of the focus chart
        var rectOverlay = svg
            .append("rect")
            .attr("cursor", "move")
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .attr("class", "zoom")
            .attr("width", chartWidth)
            .attr("height", focusChartHeight)
            .attr("transform", "translate(" + focusChartMargin.left + "," + focusChartMargin.top + ")")
            .call(zoom)
            .on("mousemove", focusMouseMove)
            .on("mouseover", focusMouseOver)
            .on("mouseout", focusMouseOut);

        var mouseLine = focus
            .append("path") // create vertical line to follow mouse
            .attr("class", "mouse-line")
            .attr("stroke", "#303030")
            .attr("stroke-width", 2)
            .attr("opacity", "0");

        var tooltip = focus
            .append("g")
            .attr("class", "tooltip-wrapper")
            .attr("display", "none");

        var tooltipBackground = tooltip.append("rect").attr("fill", "#e8e8e8");

        var tooltipText = tooltip.append("text");

        contextBrush.call(brush.move, [0, chartWidth / 2]);

        // focus chart x label
        focus
            .append("text")
            .attr("transform", "translate(" + chartWidth / 2 + " ," + (focusChartHeight + focusChartMargin.top + 25) + ")")
            .style("text-anchor", "middle")
            .style("font-size", "18px")
            .text("Time (UTC)");

        // focus chart y label
        focus
            .append("text")
            .attr("text-anchor", "middle")
            .attr("transform", "translate(" + (-focusChartMargin.left + 20) + "," + focusChartHeight / 2 + ")rotate(-90)")
            .style("font-size", "18px")
            .text("Conversion Rate");

        function brushed(event) {
            if (event.sourceEvent && event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
            tooltip.attr("display", "none");
            focus.selectAll(".tooltip-line-circles").remove();
            mouseLine.attr("opacity", "0");
            var s = event.selection || xContext.range();
            xFocus.domain(s.map(xContext.invert, xContext));
            focusChartLines.selectAll(".line").attr("d", lineFocus);
            focus.select(".x-axis").call(xAxisFocus);
            svg.select(".zoom").call(zoom.transform, d3.zoomIdentity.scale(chartWidth / (s[1] - s[0])).translate(-s[0], 0));
            brushHandle
            .attr("display", null)
            .attr("transform", (d, i) => "translate(" + [s[i], -contextChartHeight - 20] + ")");
        }

        function zoomed(event) {
            if (event.sourceEvent && event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
            tooltip.attr("display", "none");
            focus.selectAll(".tooltip-line-circles").remove();
            mouseLine.attr("opacity", "0");
            var t = event.transform;
            xFocus.domain(t.rescaleX(xContext).domain());
            focusChartLines.selectAll(".line").attr("d", lineFocus);
            focus.select(".x-axis").call(xAxisFocus);
            var brushSelection = xFocus.range().map(t.invertX, t);
            context.select(".brush").call(brush.move, brushSelection);
            brushHandle
            .attr("display", null)
            .attr("transform", (d, i) => "translate(" + [brushSelection[i], -contextChartHeight - 20] + ")");
        }

        function focusMouseMove() {
            tooltip.attr("display", null);
            var mouse = d3.pointer(this);
            var dateOnMouse = xFocus.invert(mouse[0]);
            var nearestDateIndex = d3.bisect(availableDates, dateOnMouse.toString());
            // get the dates on either of the mouse cord
            var d0 = new Date(availableDates[nearestDateIndex - 1]);
            var d1 = new Date(availableDates[nearestDateIndex]);
            var closestDate;
            if (d0 < xFocus.domain()[0]) {
            closestDate = d1;
            } else if (d1 > xFocus.domain()[1]) {
            closestDate = d0;
            } else {
            // decide which date is closest to the mouse
            closestDate = dateOnMouse - d0 > d1 - dateOnMouse ? d1 : d0;
            }

            var nearestDateYValues = groupValuesByX[closestDate];
            var nearestDateXCord = xFocus(new Date(closestDate));

            mouseLine.attr("d", `M ${nearestDateXCord} 0 V ${focusChartHeight}`).attr("opacity", "1");

            tooltipText.selectAll(".tooltip-text-line").remove();
            focus.selectAll(".tooltip-line-circles").remove();
            console.log(xFocus.domain());
            var formatTime = d3.timeFormat("%H:%M");
            tooltipText
            .append("tspan")
            .attr("class", "tooltip-text-line")
            .attr("x", "5")
            .attr("y", "5")
            .attr("dy", "13px")
            .attr("font-weight", "bold")
            .text(`${formatTime(closestDate)}`);

            for (let key of Object.keys(nearestDateYValues)) {
            focus
                .append("circle")
                .attr("class", "tooltip-line-circles")
                .attr("r", 5)
                .attr("fill", colors(key))
                .attr("cx", nearestDateXCord)
                .attr("cy", yFocus(nearestDateYValues[key]));

            tooltipText
                .append("tspan")
                .attr("class", "tooltip-text-line")
                .attr("x", "5")
                .attr("dy", `14px`)
                .attr("fill", colors(key))
                .text(`${key}: ${nearestDateYValues[key].toFixed(2)}`);
            }

            var tooltipWidth = tooltipText.node().getBBox().width;
            var tooltipHeight = tooltipText.node().getBBox().height;
            var rectOverlayWidth = rectOverlay.node().getBBox().width;
            tooltipBackground.attr("width", tooltipWidth + 10).attr("height", tooltipHeight + 10);
            if (nearestDateXCord + tooltipWidth >= rectOverlayWidth) {
            tooltip.attr("transform", "translate(" + (nearestDateXCord - tooltipWidth - 20) + "," + mouse[1] + ")");
            } else {
            tooltip.attr("transform", "translate(" + (nearestDateXCord + 10) + "," + mouse[1] + ")");
            }
        }

        function focusMouseOver() {
            mouseLine.attr("opacity", "1");
            tooltip.attr("display", null);
        }

        function focusMouseOut() {
            mouseLine.attr("opacity", "0");
            tooltip.attr("display", "none");
            focus.selectAll(".tooltip-line-circles").remove();
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
        let margin = {top: 30, right: 70, bottom: 150, left: 70},
        width = contentW - margin.left - margin.right;
        //Read the data
        try{
            d.forEach(function(data){
                data.date = new Date(data.date)
                data.value = +data.value
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
            this.createChart(sumstat);
        }
        catch{}
    }

    render(){
        // console.log("data_from_kaskad", this.props.data);
        return(
            <div id="my_dataviz"></div>
        )
    }

}