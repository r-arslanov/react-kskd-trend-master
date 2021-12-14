import React, {useEffect, useState} from "react";
import * as d3 from "d3";

import {locale, multiFormat, colorPalete, r_margin, genUnId} from "./utils";
import { OneArea } from "./OneArea";

function getSumstat(data){
    let sumstat = d3.group(data, d => d.param);
        sumstat = new Map([...sumstat.entries()].sort()); //sort
    return sumstat;
};

function getUpElement(el_id){
    const {width, height} = document.getElementById(el_id).getBoundingClientRect();
    return {width, height}
}

function afterRender(props, size, setSize){
    let header = getUpElement(props.header_id);
    let sidebar = getUpElement(props.sidebar_id);
    const { innerWidth: width, innerHeight: height } = window;
    if(size.width === -1 && size.height === -1)
        setSize(    {width:(width - sidebar.width - props.r_margin.left - props.r_margin.right), 
                    height:(height - header.height - props.r_margin.top - props.r_margin.bottom)}
                );
}


function renderAreas(props, size){
    let sumstat = getSumstat(props.data);
    let size_area = {
        width: size.width,
        height: size.height / sumstat.size
    }
    let unKey = 1;
    let result = []
    sumstat.forEach((val, key, map)=>{
        // console.log(val, key, map)

        result.push(<OneArea key={unKey} div={genUnId("trend-")} size={size_area} data={val} />)
        unKey++;
    });
    console.log(result);
    return result;
}


export function Trend(props){
    const [size, setSize] = useState({width: -1, height:-1});

    useEffect(() => {afterRender(props, size, setSize)});

    const style = {
        div:{ width: size.width+"px", height: size.height+"px", background:"#eee"}
    }
    return (
        <div id="all-areas" style={style.div}> 
            {renderAreas(props, size)}
        </div>
    )
}

Trend.defaultProps = {
    header_id:"header-div",
    sidebar_id:"sidebar-div",
    r_margin,
    locale,
    multiFormat,
    colorPalete,
    text: "this is test default props",
    data: [] 
}

