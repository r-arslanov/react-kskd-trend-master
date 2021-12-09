import React, { Component } from 'react'
import { List } from 'semantic-ui-react'
import './../styles/ObjList.css';

export default class ObjList extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  componentDidMount() {
    this.moveFocus(this.props);
  }
  moveFocus(propsData) {
    const node = this.myRef.current;
    node.addEventListener('keydown', function(e) {
      const active = document.activeElement; 
      if(e.keyCode === 90 && active.nextSibling) {
        active.nextSibling.focus()
        propsData.data.forEach((dp) => {
          if(active.tabIndex + 1 === dp.key){
            propsData.onChange(dp.value);
          }
        });
      }
      if(e.keyCode === 65 && active.previousSibling) {
        active.previousSibling.focus()
        propsData.data.forEach((dp) => {
          if(active.tabIndex - 1 === dp.key){
            propsData.onChange(dp.value);
          }
        });
      }
    });
  }

  render() {
    //console.log("myRef", this.myRef);
    return (
      <div ref={this.myRef} className="Objects-List">
        <List selection verticalAlign='middle'>
        {this.props.data.map((dp, index) => 
          <List.Item tabIndex={dp.key} key={dp.key} onClick={() => this.props.onChange(dp.value)}>
            <List.Content>
              <List.Header>
                {dp.text}
              </List.Header>
            </List.Content>
          </List.Item> )}
        {/* onClick={() => this.handleClick(document.title)} */}
        </List>
      </div>
    )
  }
}



// const ListSelection = (props) => (
//   <List selection verticalAlign='middle' className="Objects-List">
//       {props.data.map((dp, index) => 
//       <List.Item key={dp.key} onClick={() => props.onChange(dp.value)}>
//         <List.Content>
//           <List.Header>
//             {dp.text}
//           </List.Header>
//         </List.Content>
//       </List.Item> )}
//       {/* onClick={() => this.handleClick(document.title)} */}
//   </List>
// )

// export default ListSelection