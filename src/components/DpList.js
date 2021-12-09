import React, {Component} from 'react';
import { Checkbox } from 'semantic-ui-react'
import { List } from 'semantic-ui-react'
import './../styles/DpList.css';

export default class DpList extends Component{

	render(){
		return(
			<div className="DpListContainer">
				<List selection verticalAlign='middle'>
					{this.props.data.map((dp, index) => <List.Item key={ dp.key }><List.Content><Checkbox label={ dp.text } checked={ dp.enabled } onChange={() => this.props.onChange(dp.key)} /></List.Content></List.Item> )}
					{/* {this.state.names.map((dp, index) => <li key={index}> <input type="checkbox" checked={this.state.names[index].enabled} onChange={() => this.updChecked(index)}/> {dp.name} </li> )} */}
				</List>
			</div>
		);
	}
}