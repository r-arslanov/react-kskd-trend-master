import React from 'react'
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react'
import BackgroundImg from './../img/short-paragraph.png'

const LoaderCircle = () => (
    <div>
      <Segment className="Loader">
        <Dimmer active inverted>
          <Loader inverted>Загрузка</Loader>
        </Dimmer>
  
        <Image src={BackgroundImg} />
      </Segment>
    </div>
  )
  
  export default LoaderCircle