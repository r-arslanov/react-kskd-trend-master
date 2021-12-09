import React, {Component} from 'react';
import TimePicker from './TimePicker';
import DropDownList from './DropDownList';
//import Trends from './Trends';
//import TrendsZoom from './Trends_zoom';
import TrendsZoomAndPointer from './Trends_zoom_and_pointer';
import TrendsInOneChart from './Trends_multiple_in_one_chart';
// import Loader from './Loader'
import {Button} from 'semantic-ui-react'
import {Rest} from '../lib/Rest';
// import { Switch, Routes, Route } from "react-router-dom";

import './../styles/ContentDiv.css';
import './../Semantic-UI-CSS-master/semantic.css';

import {useParams} from "react-router";

const hours = 120;
const debug = false;

class ContentDiv_local extends Component {

    state = {dateStart: new Date(new Date().setHours(new Date().getHours() - hours)), dateEnd: new Date(), disabled: false, data: [], dps: [], needUpdate: false};
    interval;

    updateStates(response){
        this.setState({data: response.data, dps: this.props.data.dps, needUpdate: false,
            dateStart: new Date(this.state.dateStart.setMilliseconds(this.state.dateStart.getMilliseconds() + 2000)),
            dateEnd: new Date(this.state.dateEnd.setMilliseconds(this.state.dateEnd.getMilliseconds() + 2000))
         })
    }

    componentDidUpdate(){
        if((this.props.data.dps.length > 0 & this.state.dateStart < this.state.dateEnd & this.props.data.dps !== this.state.dps) || this.state.needUpdate){
            clearInterval(this.interval)
            Rest.getHistory(this.props.data.kust, this.state.dateStart, this.state.dateEnd, this.props.data.dps, response => 
                {this.setState({data: response.data, dps: this.props.data.dps, needUpdate: false})})
            //this.getHistory(response => { this.setState({data: response.data, dps: this.props.data.dps, needUpdate: false})});
            if(this.state.disabled){
                this.interval = setInterval(() => {Rest.getHistory(this.props.data.kust,  this.state.dateStart, this.state.dateEnd, this.props.data.dps, response => 
                    {this.updateStates(response)})}, 2000)
            }
        }
    }

    componentDidMount(){
        if(this.props.parametrized){
            this.setState({dateStart: new Date(new Date().setHours(new Date().getHours() - hours)), dateEnd: new Date()});
        }
    }

    setTime(value) {
        if(value !== 9999){
            this.setState({dateStart: new Date(new Date().setHours(new Date().getHours() - value)), dateEnd: new Date(), disabled: true})
        }else{
            this.setState({disabled: false})
        }       
    }

    constructor(props){
        super(props)
        this.dropDownData = [
            { key: 1, text: "За час", value: 1 },
            { key: 2, text: "За 2 часа", value: 2 },
            { key: 3, text: "За сутки", value: 24 },
            { key: 5, text: "За 5 суток", value : 120 },
            { key: 4, text: "Свободный выбор", value: 9999 }
        ];
    }

    switchAct(){
        clearInterval(this.interval);
    }

    paramRender(){
        if(this.props.parametrized){
            return (this.state.data.length !== 0) ? < TrendsInOneChart data={this.state.data} switchAct={() => this.switchAct()}/> : <h1>Нет данных</h1>;
        }else{
            return (this.state.data.length !== 0) ? < TrendsZoomAndPointer data={this.state.data}/> : <h1>Нет данных</h1>;
        }

    }

    render(){
        return(
            <div className="ContentDiv" id="content">
                <div className = "HeaderDiv">
                    <div className = "Picker" style={this.props.parametrized ? styles.default : styles.default}>
                        <div className="TimePicker">
                            <TimePicker
                                dateStart = {this.state.dateStart} dateEnd = {this.state.dateEnd}
                                disabled = {this.state.disabled}
                                onChange={(data) => this.setState({dateStart: data[0], dateEnd: data[1]})}
                            />
                        </div>
                        <div className = "DropDownDate">
                            <DropDownList label="Time" data = {this.dropDownData} onChange={(e, {value}) => this.setTime(value)} />
                        </div>
                        <div className="Button">
                            <Button onClick={() => this.setState({needUpdate: true})}  content='Обновить' />
                        </div>
                    </div>
                    <div className = "Trends">
                        {this.paramRender()}
                    </div>
                </div>
            </div>
        )
    }
}

const ContenDiv = (props) => {
    const {sys, type, num, dp} = useParams();
    let dps_from_type;
    if(type !== undefined && type.toUpperCase() === "SUECN"){
        dps_from_type = [
            sys + ":" + sys + "=SUECN_" + num + ".AI.Vkhod_1)",
            sys + ":" + sys + "=SUECN_" + num + ".AI.Zagruzka_dvigatelya_",
            sys + ":" + sys + "=SUECN_" + num + ".AI.Napryazhenie_na_vykhode_PCH",
            sys + ":" + sys + "=SUECN_" + num + ".AI.Tok_fazy_A",
            // this.props.uri_param.sys + ":" + this.props.uri_param.sys + "=SUECN_" + this.props.uri_param.num + ".AI.Tok_fazy_B",
            // this.props.uri_param.sys + ":" + this.props.uri_param.sys + "=SUECN_" + this.props.uri_param.num + ".AI.Tok_fazy_C"
        ];
    }

    let l_kust = (props.data.kust !== '') ? props.data.kust :  sys;

    let l_dps =  (props.data.dps.length > 0) ? props.data.dps : 
               (dps_from_type !== undefined)  ? dps_from_type : 
                                               [dp];

    let data = props.data;
        data.kust = l_kust;
        data.dps = l_dps;
    return <ContentDiv_local data={data} uri_param={{sys, type, num, dp}} parametrized={(sys !== undefined)} /> ;
}

const styles = {
    invisible:{
        display:"none"
    },
};

export default ContenDiv;