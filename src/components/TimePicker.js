import React, {Component} from 'react';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker';

export default class TimePicker extends Component{
    //state = {value: [new Date(), new Date()]}

    render(){
        return(
            <DateTimeRangePicker 
                value = {[this.props.dateStart, this.props.dateEnd]}
                onChange={this.props.onChange}
                className="DateTimeRangePicker"
                format = "dd.MM.y HH:mm:ss"
                disableClock = {true}
                disabled = {this.props.disabled}
                clearIcon = {null}
            />
        )
    }
}