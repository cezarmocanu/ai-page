import React,{useRef, useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import {v4 as uuidv4} from 'uuid';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import {DashboardPage} from './pages/dashboard-page/DashboardPage';
import {CollectionDashboard} from './pages/collection-dashboard/CollectionDashboard';
import { KeyboardContext } from './components/Context';
import {VerificationDashboard} from './components/verification-dashboard/VerificationDashboard';
import {KEYS, KEYS_VALUES} from './constants.js';
import {SubmitPage} from './pages/submit-page/SubmitPage';



function App() {
  
  
  
  const [keyEvent, setKeyEvent] = useState({});

  

  const handleKeyPress = (e) => {
    
    if (!KEYS_VALUES.includes(e.code)) {
      return;
    }
    setKeyEvent(e);
  }

  useEffect(()=>{
    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    }
    
  },[])

  

  return (
    <KeyboardContext.Provider value={keyEvent}>
      <Router>
        <Switch>
          <Route exact path={'/'}>
            <DashboardPage/>
          </Route>
          <Route path={'/verification/:formId'}>
            <VerificationDashboard />
          </Route>
          <Route path={'/submit'}>
            <SubmitPage />
          </Route>
          <Route path={'/collection/:formId'}>
            <CollectionDashboard />
          </Route>
        </Switch>
      </Router>
    </KeyboardContext.Provider>
  )
}

export default App;
