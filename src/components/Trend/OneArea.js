import React, {useEffect, useState} from "react";
import * as d3 from "d3";

import {colorPalete, getWidthElement, genUnId, multiFormat} from "./utils";

const getSumstat = (data) => {
    let sumstat = d3.group(data, d => d.param);
        sumstat = new Map([...sumstat.entries()].sort()); //sort
    return sumstat;
}

function addLegend(props, local_id, sumstat){
    const lsvg = d3.select("#" + props.div)
                        .append("svg")
                            .attr("id", local_id)
                            .attr("width", "100%")
                            .style("background-color", "#dddddd");

    let counter = 0, cur_line = 0;
    sumstat.forEach((value, key, map) => {
        let rect = getWidthElement(lsvg, counter, props.size.width, cur_line);
        lsvg.datum(map[key])
            .append("text")
                .attr("x", 10 + rect.x)
                .attr("y", 10 + rect.y)
                .style("fill", colorPalete(key))
                .text(key)
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle"); 
        counter++;
        cur_line = rect.current_line;
    });

    d3.select("#" + local_id).attr("height", (cur_line+1) * 20);
    return lsvg;
}

function addGraph(props, l_height, sumstat){
    let a_id = genUnId("area-"),
        c_id = genUnId("clip-"),
        g_id = genUnId("graph-");

    let y_max, y_min, y_hst;
    y_max = d3.max(props.data, (d)=>{
        if(d.range.max <= d.range.min){
            return +d.value;
        }else{
            return +d.range.max;
        }
    });

    y_min = d3.min(props.data, (d) => {
        if(d.range.max <= d.range.min){
            return +d.value;
        }else{
            return +d.range.min;
        }
    });

    // let y_max = d3.max(props.data, (d) => { return +d.value }),
    //     y_min = d3.min(props.data, (d) => { return +d.value }),
    y_hst = (y_max - y_min) * 0.05;
    y_max += y_hst;
    y_min -= y_hst;
    let {svg_width, svg_height} = {svg_width:  props.size.width - props.margin.left - props.margin.right,
        svg_height: props.size.height - props.margin.top - props.margin.bottom - l_height}
        
    let svg = d3.select("#" + props.div)
                    .append("svg")
                        .attr("id", a_id)
                        .attr("width", svg_width)
                        .attr("height", svg_height)
                        .attr('viewBox', '0 0 ' + svg_width + ' ' + svg_height)
                        .attr('preserveAspectRatio', 'xMaxYMin')
    let graph = d3.select("#" + a_id).append("g")
                        .attr("id", g_id)
                        .attr("transform", "translate(" + props.margin.left + "," + props.margin.top + ")");

    let x = d3.scaleTime().range([0, svg_width - 30]).domain(d3.extent(props.data, (d) => { return new Date(d.date) })),
        y = d3.scaleLinear().range([svg_height - 30, 0]),
        z = d3.scaleOrdinal(d3.schemeCategory10),
        rescaledX = x;

    let xAxis = d3.axisBottom(x),
        yAxis = d3.axisLeft(y);

    var line = d3.line()
                    .curve(d3.curveStepBefore)
                    .x(d => { return x(new Date(d.date))})
                    .y(d => { return y(d.value)});

    y.domain([y_min, y_max]);
    z.domain(props.data.map( (d)=> { return d.param} ));

    graph.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", `translate(0, ${svg_height - 30} )` )
            .call(xAxis.tickFormat(multiFormat));

    graph.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);

    let d_line = graph.selectAll(".line")
                        .data(sumstat)
                        .enter()
                            .append("g")
                                .attr("class", "line");
    let clip = svg.append("clipPath")
                    .attr("id", c_id);
    clip.append("rect")
            .attr("width", svg_width - props.margin.right)
            .attr("height", svg_height - props.margin.top *3)

    let path = d_line.append("path")
                        .attr("clip-path", `url(#${c_id})`)
                        .attr("class", "line")
                        .attr("fill", "none")
                        .attr("d", d => { return line(d[1]) })
                        .style("stroke", (d) => { return colorPalete(d[0]) });

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
        });
    
    svg.call(zoom);

    return {
        svgs:{ svg, graph, clip }, 
        size:{ svg_width, svg_height }, 
        axis:{ x:rescaledX, y } 
    };
}

function addPointer(props, sumstat, svgs, size, axis){
    let blocked = false;
    let local_graph_id = svgs.graph.nodes()[0].id;
    let moe_id = genUnId("moe-"),
        mol_id = genUnId("mol-"),
        mov_id = genUnId("mov-");

    let mouseG = d3.select("#" + local_graph_id)
                        .append("g")
                            .attr("id", moe_id)
                            .attr("class", "mouse-over-effects");
    mouseG.append("path") // this is the black vertical line to follow mouse
                    .attr("id", mol_id)
                    .attr("clip-path", `url(#${svgs.clip.nodes()[0].id})`)
                    .attr("class", "mouse-line")
                    .style("stroke", "black")
                    .style("stroke-width", "1px");

    let lines = svgs.svg.selectAll("path.line").nodes();
    let mousePerLine = mouseG.selectAll('.mouse-per-line')
                                .data(sumstat)
                                .enter()
                                    .append("g")
                                        .attr("id", (d, index) => {return `mpl-${index}`})
                                        .attr("class", "mouse-per-line")
    mousePerLine.append("circle")
                .attr("r", 7)
                .style("stroke", function(d) { return colorPalete(d[0]); })
                .style("fill", function(d) { return colorPalete(d[0]); })
                .style("stroke-width", "1px")
                .style("opacity", "0"); // opacity 1 - original

    // mousePerLine.append("rect")
    //                 .attr("class", "tooltip")
    //                 .attr("transform", "translate(10,3)")
    //                 .style("fill", function(d) { return colorPalete(d[0]); })

    // mousePerLine.append("text")
    //             .attr("id", "val-text")
    //             .attr("transform", "translate(10,3)")
                
    // mousePerLine.append("text")
    //                 .attr("id", "date-text")
    //                 .attr("transform", "translate(10,3)")
    
    let tooltip_g = mouseG.append("g");
    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
                .attr("id", mov_id)
                .attr('width', size.svg_width) // can't catch mouse events on a g element
                .attr('height', size.svg_height)
                .attr('fill', 'none')
                .attr('pointer-events', 'all')
                .on('mouseover', function() { // on mouse in show line, circles and text
                    mouseG.select(".mouse-line")
                            .style("opacity", "1");
                    mouseG.selectAll(".mouse-per-line circle")
                            .style("opacity", "1");
                    mouseG.selectAll(".mouse-per-line text")
                            .style("opacity", "1");
                    mouseG.selectAll(".tooltip")
                            .style("opacity", "0.8");
                })
                .on('mousemove', function(event) { // mouse moving over canvas]
                    if (blocked) return;
                    let mouse = d3.pointer(event);
                    mouseG.select(".mouse-line")
                    .attr("d", function() {
                            var d = "M" + mouse[0] + "," + size.svg_height;
                            d += " " + mouse[0] + "," + 0;
                            return d;
                        });
                    let poses = [];
                    let objects = [];

                    mouseG.selectAll(".mouse-per-line")
                                .attr("transform", (d, i) =>{
                                    let xDate = axis.x.invert(mouse[0]),
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
                                    // old rect comment=================================================
                                    // let str_time = axis.x.invert(pos.x).toLocaleString();
                                    // mouseG.select(`#mpl-${i}`).selectAll("#val-text")
                                    //         .text(axis.y.invert(pos.y).toFixed(2))
                                    //         .attr("transform", "translate(15,18)");
                                    // mouseG.select(`#mpl-${i}`).selectAll("#date-text")
                                    //         .text(str_time)
                                    //         .attr("transform", "translate(15,38)")
                                    // pos.color = colorPalete[d[0]];
                                    poses.push(pos);
                                    objects.push({color: colorPalete(d[0]), comment: d[0]});
                                    return "translate(" + mouse[0] + "," + pos.y +")";
                                });
                                
                                tooltip_g.selectAll("text").remove();
                                tooltip_g.selectAll("rect").remove();

                                tooltip_g.append("rect")
                                                .attr("id", "tool-rec")
                                                .style("opacity", "0.8")
                                                .attr("fill", "#ddd");
                                poses.forEach((pos, i, arr) => {
                                    tooltip_g.append("text")
                                                        .attr("transform", "translate(10,"+ ((40*i) +12) +")")
                                                        .style("font-size", "12")
                                                        // .attr("stroke", objects[i].color)
                                                        .attr("fill", objects[i].color)
                                                        .text(objects[i].comment);
                                    tooltip_g.append("text")
                                                        .attr("transform", "translate(10,"+ ((40*i)+12  + 12) +")")
                                                        .style("font-size", "12")
                                                        // .attr("stroke", objects[i].color)
                                                        .attr("fill", objects[i].color)
                                                        .text(axis.x.invert(pos.x).toLocaleString());
                                    tooltip_g.append("text")
                                                        .attr("transform", "translate(10,"+ ((40*i)+24 +12) +")")
                                                        .style("font-size", "12")
                                                        // .attr("stroke", objects[i].color)
                                                        .attr("fill", objects[i].color)
                                                        .text(axis.y.invert(pos.y).toFixed(2));
                                    // if(i<arr.length-1){
                                    //     tooltip_g.append("text")
                                    //                         .attr("transform", "translate(10,"+ ((80*i)+60 + 20) +")")
                                    //                         .text("------");
                                    // }
                                });

                                let tooltip_size = tooltip_g.node().getBBox();
                                tooltip_g.select("rect")
                                                .attr("width", ()=> { return tooltip_size.width + 20; })
                                                .attr("height", () => { return tooltip_size.height + 5; });
                                
                                tooltip_g.attr("transform", ()=>{
                                    let x = d3.max(poses, (pos)=>{return pos.x}) + 10;
                                    let y = d3.mean(poses, (pos)=>{return pos.y}) + 5;
                                    let clip_size = {width: svgs.clip.node().childNodes[0].width.baseVal.value,
                                                     height: svgs.clip.node().childNodes[0].height.baseVal.value}

                                    if((x + tooltip_size.width) >= clip_size.width - 20) { x= x - (tooltip_size.width + 20) - 20; }
                                    if((y + tooltip_size.height >= clip_size.height)) { y= y - (tooltip_size.height) - 10 }
                                    return `translate(${x},${y})`
                                });
                    })
                    .on("click", (event)=>{
                        blocked = !blocked;
                        if(blocked){
                            mouseG.append("circle")
                                        .attr("id", "circle-stopper")
                                        .attr("r", 7)
                                        .style("stroke", "#000")
                                        .style("fill", "#f00" )
                                        .style("stroke-width", "1px")
                                        .style("opacity", "1"); // opacity 1 - original
                        }else{
                            mouseG.select("#circle-stopper").remove();

                        }
                    });   
}

function afterRender(props, sumstat){
    d3.select("#" + props.div).selectChildren().remove();
    if(props.size.width === -1 && props.size.height === -1)
        return;
    if(sumstat === null || sumstat.size === 0)
        return;
//============================== legend =============================================
    let l_id = genUnId("legend-");
    let lsvg = addLegend(props, l_id, sumstat);
    let l_height = lsvg.nodes()[0].clientHeight;
//================================================= graph ========================================
    let {svgs, size, axis} = addGraph(props, l_height, sumstat);
//================================================ pointer =======================================
    addPointer(props, sumstat, svgs, size, axis);
}

export function OneArea(props){
    let sumstat = getSumstat(props.data);
    useEffect(()=>{afterRender(props, sumstat)});

    return <div id={props.div}></div>

}

OneArea.defaultProps = {
    data: [],
    size: {width:0, height:0},
    margin: {top: 10, right: 10, bottom: 0, left: 30}
}