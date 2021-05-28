import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import {VerificationDashboard} from './components/verification-dashboard/VerificationDashboard';

import './App.scss';



function App() {
  return (
    <Router>
      <Switch>
        <Route exact path={'/'}>
          <div>
            <Link to="/verification">Verify</Link>
            <Link to="/submit">Submit</Link>
          </div>
        </Route>
        <Route path={'/verification'}>
          <VerificationDashboard />
        </Route>
        <Route path={'/submit'}>
          <h3>Add a file to submit</h3>
        </Route>
      </Switch>
    </Router>
    
    
  )
}

export default App;
