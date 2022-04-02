import React, {Component, useState} from 'react';
import TimePicker from './TimePicker';
import DropDownList from './DropDownList';
import {Trend} from './Trend/Trend';
import {Button} from 'semantic-ui-react'
import Loader from './../components/Loader'
import {Rest} from '../lib/Rest';

import './../styles/ContentDiv.css';
import './../Semantic-UI-CSS-master/semantic.css';

import {useParams} from "react-router";

// const hours = 120; // this is 5 days
const hours = 1; // this is 1 hour

class ContentDiv_local extends Component {

    state = {
        dateStart: new Date(new Date().setHours(new Date().getHours() - hours)), 
        dateEnd: new Date(), 
        disabled: false, 
        data: [], 
        dps: [], 
        needUpdate: false, 
        isLoading:false
    };

    updateStates(response){
        this.setState({data: response.data, dps: this.props.data.dps, needUpdate: false,
            dateStart: new Date(this.state.dateStart.setMilliseconds(this.state.dateStart.getMilliseconds() + 60000)),
            dateEnd: new Date(this.state.dateEnd.setMilliseconds(this.state.dateEnd.getMilliseconds() + 60000)),
            isLoading:false
         })
    }
    timer;
    startFetching(me){
        console.log("startFetching");
        function updResponseState(response){
            if(me.state.disabled){
                console.log("updResponseState");
                let l_range = me.state.dateEnd - me.state.dateStart;
                let l_dEnd = Date.now() + 1000;
                let l_dStart = (l_dEnd - l_range) + 1000;
                console.log(l_range, l_dStart, l_dEnd);
                me.setState({
                    dateStart: new Date(l_dStart),
                    dateEnd: new Date(l_dEnd)
                });
                me.timer = setTimeout(me.startFetching, 1000, me);
            }

            me.setState({
                    data: response.data, 
                    dps: me.props.data.dps, 
                    needUpdate: false, 
                    isLoading:false
                })

        }
        Rest.getHistory(me.props.data.kust, me.state.dateStart, me.state.dateEnd, me.props.data.dps, updResponseState);
    }

    componentDidUpdate(){
        if((this.props.data.dps.length > 0 & this.state.dateStart < this.state.dateEnd & this.props.data.dps !== this.state.dps) || this.state.needUpdate){
            if(!this.state.isLoading){
                this.startFetching(this);
                this.setState({isLoading:true});
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
        clearTimeout(this.timer);
    }

    paramRender(){
        console.log("======= props =======", this.props)
        console.log("======= state =======", this.state);
        let oneArea = (this.props.uri_param.v_type === '2' || (this.props.parametrized || this.props.oneValue));
        if(!this.state.isLoading)
            return (this.state.data.length !== 0) ? < Trend data={this.state.data} switchAct={() => this.switchAct()} oneArea={oneArea}/> : <h1>Нет данных</h1>;
        else
            return <Loader />;
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
    const [gpIsLoading, setGpIsLoading] = useState(false);
    const [gpIsLoaded, setGpIsLoaded] = useState(false);
    const [needLoading, setNeedLoading] = useState(false);
    const [stDps, setStDps] = useState([]);
    const {sys, type, num, dp, v_type} = useParams();

    console.log("uri_init", {sys, type, num, dp, v_type});
    let dps_from_type;
    if(type !== undefined && type.toUpperCase() === "SUECN"){
        dps_from_type = [
            {dp: sys + "=SUECN_" + num + ".AI.Vkhod_1)", gp: "EV_SUECN", key: 1 },
            {dp: sys + "=SUECN_" + num + ".AI.Zagruzka_dvigatelya_", gp: "EV_SUECN", key: 2 },
            {dp: sys + "=SUECN_" + num + ".AI.Napryazhenie_na_vykhode_PCH", gp: "EV_SUECN", key: 3 },
            {dp: sys + "=SUECN_" + num + ".AI.Tok_fazy_A", gp: "EV_SUECN", key: 4 }
            // sys + ":" + sys + "=SUECN_" + num + ".AI.Tok_fazy_B",
            // sys + ":" + sys + "=SUECN_" + num + ".AI.Tok_fazy_C"
        ];
    }

    let l_kust = (props.data.kust !== '') ? props.data.kust :  sys;
    
    // console.log("======= dp =======", {sys, type, num, dp, v_type});
    if(dp !== undefined && !(gpIsLoaded || gpIsLoading) && !needLoading){
        setNeedLoading(true);
    }

    if(dp !== undefined && needLoading && !gpIsLoading && !gpIsLoaded){
        setGpIsLoading(true);

        Rest.getGroup([l_kust + ":" + dp], (res)=>{
            setStDps(res);
            setGpIsLoaded(true);
        });
    }

    let l_dps =  (props.data.dps.length > 0) ? props.data.dps : 
                                                    (dps_from_type !== undefined)  ? dps_from_type : [{dp, gp:"EV_SUECN"}];

    let data = props.data;
        data.kust = l_kust;
        data.dps = l_dps;
    if(needLoading ){
        let l_dps = [];
        stDps.forEach(one=>{
            console.log(one);
            l_dps.push({dp:one.dp.replace(l_kust + ":", ""), gp:one.group});
        });
        data.dps = l_dps;
        console.log("======= data =======", data);
        return (gpIsLoaded) ? <ContentDiv_local uri_param={{sys, type, num, dp, v_type}} parametrized={(type !== undefined)} oneValue={dp !== undefined} data={data} {...props}/> : <Loader />
    }else{
        if(stDps.length > 0){
            let l_dps = [];
            stDps.forEach(one=>{
                l_dps.push({dp:one.dp.replace(l_kust + ":", ""), gp:one.gp});
            });
        }
        console.log("======= data =======", data);
        return <ContentDiv_local uri_param={{sys, type, num, dp, v_type}} parametrized={(type !== undefined)} oneValue={dp !== undefined} data={data} {...props}/> ;
    }
    
}

const styles = {
    invisible:{
        display:"none"
    }
};

export default ContenDiv;