import React, { useState } from 'react';
import './styles/App.css';

import SideBar from './components/SideBar';
import ContentDiv from './components/ContenDiv';
import { Routes, Route } from "react-router-dom";

const App = () => {
  const [data, setdata] = useState({ kust: "", dps: [] });
  return (
    <div className="App"> 
      <SideBar transferData={object => setdata(object)}/>
      <Routes>
          <Route exact path="/one/:sys/:dp" element={<ContentDiv data={data} />}/>
          <Route exact path="/few/:sys/:type/:num" element={<ContentDiv data={data} />}/>
          <Route exact path="/" element={<ContentDiv data={data} />} />
      </Routes>
    </div>
  );
}

export default App;
