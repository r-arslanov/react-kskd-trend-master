import React, {Component} from 'react';
import { Rest } from '../lib/Rest';

import DpList from './DpList';
import DropDownList from './DropDownList';
import ObjList from './ObjList';
import Loader from './Loader'

import './../styles/SideBar.css';
import './../Semantic-UI-CSS-master/semantic.css';


export default class SideBar extends Component {
    state = {type: "", types: [], kust: "", kusts: [], objects: [], object: "", dps: [], needUpdate: false, needTransfer: false}
    
    //Обновляем значение state.kust
    updKust(value){
        this.setState({ kust: value, needUpdate: true })
    };

    //Обновляем значение state.type
    updType(value){
        this.setState({ type: value, needUpdate: true })
    };

    //Обновляем значение state.object
    updObject(value){
        this.setState({ object: value, needTransfer: true })
    }

    //Обновляем dps.enable 
    updSelected(value){
        let temp = this.state.dps;
        temp[value-1].enabled = !temp[value-1].enabled
        console.log("selected dps", temp)
        this.setState({dps: temp, needTransfer: true})
    }

    //При первом запуске получаем список кустов и типы объектов - записываем в state
    componentDidMount(){
        Rest.getKusts(response => { this.setState({ kusts: response.kusts }) });
        Rest.getTypes(response => { this.setState({ types: response.types }) });  
        // this.getKusts(response => { this.setState({ kusts: response.kusts }) });
        // this.getTypes(response => { this.setState({ types: response.types }) });   
    }
    
    //При необходимости (needUpdate: true) считываем список объектов и записываем в state
    componentDidUpdate(){
        if(this.state.needUpdate){
            Rest.getObjects(this.state.kust, this.state.type, response => {
                // console.log("need update", response);
                let arr_dps = Array();
                response.dps.forEach((dp, index)=>{
                    arr_dps.push(this.state.kust + ":" + this.state.kust + "=" + this.state.type + "_1." + dp.dp);
                });

                Rest.getGroup(arr_dps, (res2)=>{
                    // console.log("res2", res2);
                    res2.forEach((gp)=>{
                        let tmp = gp.dp.replace(this.state.kust + ":" + this.state.kust + "=" + this.state.type + "_1.", "");
                        response.dps.forEach((one_dp, index)=>{
                            if(tmp === one_dp.dp){
                                response.dps[index].gp = gp.group;
                            }
                        });
                    });
                    this.setState({ 
                        objects: response.objects, 
                        dps: response.dps, 
                        needUpdate: false 
                    });
                });
            });
        }
        
        //При необходимости передаем данные в App.js
        if(this.state.needTransfer) {
            let transData = {kust: this.state.kust, dps: []}
            this.state.dps.forEach(dp => { 
                if(dp.enabled) { 
                    transData.dps.push({dp:this.state.object + dp.dp, gp:dp.gp}) 
                } 
            });
            this.props.transferData(transData);
            this.setState({needTransfer: false})
        } 
    }

    


    //Для отрисовки frontend
    render(){
        //console.log("state.kusts", this.state.kusts);
        return(
            <div className="ControlDiv" id={"sidebar-div"}>
                {(this.state.kusts.length !== 0) ? <DropDownList data={this.state.kusts} label="Номер куста" onChange={(e, {value}) => this.updKust(value)}/> : < Loader />}
                {(this.state.types.length !== 0) ? <DropDownList data={this.state.types} label="Объект" onChange={(e, {value}) => this.updType(value)}/> : < Loader />}
                {(this.state.objects.length !== 0) ? <ObjList data={this.state.objects} onChange={(value) => this.updObject(value)}/> : ""}
                {(this.state.objects.length !== 0) ? <DpList data={this.state.dps} onChange={(key) => this.updSelected(key)} /> : ""}
            </div>
        )
    }
}