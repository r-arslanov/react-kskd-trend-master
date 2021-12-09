import React from 'react'
import { Dropdown } from 'semantic-ui-react'

const DropdownSelection = (props) => (
  <div className="DDList">
    <Dropdown
      onChange={props.onChange}
      placeholder={props.label}
      fluid
      selection
      options={props.data}
    />
  </div>
)

export default DropdownSelection
