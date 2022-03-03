import React, {Component} from 'react';
import TimePicker from './TimePicker';
import DropDownList from './DropDownList';
import {Trend} from './Trend/Trend';
import {Button} from 'semantic-ui-react'
import Loader from './../components/Loader'
import {Rest} from '../lib/Rest';

import './../styles/ContentDiv.css';
import './../Semantic-UI-CSS-master/semantic.css';

import {useParams} from "react-router";

const hours = 120;

class ContentDiv_local extends Component {

    state = {
        dateStart: new Date(new Date().setHours(new Date().getHours() - hours)), 
        dateEnd: new Date(), 
        disabled: false, 
        data: [], 
        dps: [], 
        needUpdate: false, 
        isLoading:true
    };
    
    interval;

    updateStates(response){
        this.setState({data: response.data, dps: this.props.data.dps, needUpdate: false,
            dateStart: new Date(this.state.dateStart.setMilliseconds(this.state.dateStart.getMilliseconds() + 2000)),
            dateEnd: new Date(this.state.dateEnd.setMilliseconds(this.state.dateEnd.getMilliseconds() + 2000)),
            isLoading:false
         })
    }

    componentDidUpdate(){
        if((this.props.data.dps.length > 0 & this.state.dateStart < this.state.dateEnd & this.props.data.dps !== this.state.dps) || this.state.needUpdate){
            clearInterval(this.interval)
            if(!this.state.isLoading){
            this.setState({isLoading:true});
            Rest.getHistory(this.props.data.kust, this.state.dateStart, this.state.dateEnd, this.props.data.dps, response => 
                {this.setState({data: response.data, dps: this.props.data.dps, needUpdate: false, isLoading:false})})
            }
            if(this.state.disabled){
                this.interval = setInterval(() => {Rest.getHistory(this.props.data.kust,  this.state.dateStart, this.state.dateEnd, this.props.data.dps, response => 
                    {this.updateStates(response)})}, 2000)
            }
        }
    }

    componentDidMount(){
        if(this.props.parametrized || this.props.oneValue){
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
        console.log(this.props)
        let oneArea = (this.props.uri_param.v_type === '2' || (this.props.parametrized || this.props.oneValue));
        if(!this.state.isLoading)
            return (this.state.data.length !== 0) ? < Trend data={this.state.data} switchAct={() => this.switchAct()} oneArea={oneArea}/> : <h1>Нет данных</h1>;
        else
            return <Loader />;
        // if(this.props.test){
        //     return <Trend data={this.state.data} />
        // }else if(this.props.parametrized || this.props.oneValue){
        //     return (this.state.data.length !== 0) ? < Trend data={this.state.data} switchAct={() => this.switchAct()} oneArea={oneArea}/> : <h1>Нет данных</h1>;
        // }else{
        //     return (this.state.data.length !== 0) ? < Trend data={this.state.data} switchAct={() => this.switchAct()} oneArea={oneArea}/> : <h1>Нет данных</h1>;
        // }
    }

    render(){
        return(
            <div className="ContentDiv" id="content">
                <div className = "HeaderDiv" id={"header-div"}>
                    <div className = "Picker" style={this.props.parametrized ? styles.invisible : styles.default}>
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
                        <div className="Button" >
                            <Button onClick={() => this.setState({needUpdate: true})}  content='Обновить' />
                        </div>
                    </div>
                </div>
                
                <div className = "Trends">
                        {this.paramRender()}
                </div>
            </div>
        )
    }
}

const ContenDiv = (props) => {
    const {sys, type, num, dp, v_type} = useParams();
    console.log("uri_init", {sys, type, num, dp, v_type})
    let dps_from_type;
    if(type !== undefined && type.toUpperCase() === "SUECN"){
        dps_from_type = [
            sys + ":" + sys + "=SUECN_" + num + ".AI.Vkhod_1)",
            sys + ":" + sys + "=SUECN_" + num + ".AI.Zagruzka_dvigatelya_",
            sys + ":" + sys + "=SUECN_" + num + ".AI.Napryazhenie_na_vykhode_PCH",
            sys + ":" + sys + "=SUECN_" + num + ".AI.Tok_fazy_A",
            // sys + ":" + sys + "=SUECN_" + num + ".AI.Tok_fazy_B",
            // sys + ":" + sys + "=SUECN_" + num + ".AI.Tok_fazy_C"
        ];
    }

    let l_kust = (props.data.kust !== '') ? props.data.kust :  sys;

    let l_dps =  (props.data.dps.length > 0) ? props.data.dps : 
               (dps_from_type !== undefined)  ? dps_from_type : 
                                               [dp];

    let data = props.data;
        data.kust = l_kust;
        data.dps = l_dps;

    return <ContentDiv_local uri_param={{sys, type, num, dp, v_type}} parametrized={(type !== undefined)} oneValue={dp !== undefined} {...props}/> ;
}

const styles = {
    invisible:{
        display:"none"
    }
};

export default ContenDiv;