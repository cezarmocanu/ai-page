import React,{useRef, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import {VerificationDashboard} from './components/verification-dashboard/VerificationDashboard';

import './App.scss';

const COLLECTOR_ROUTE = 'http://localhost:5000/test_image_upload/'

function App() {

  const formRef = useRef();
  const [images, setImages] = useState({});

  const sendImages = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(images).forEach(key => {
      formData.append(key, images[key]);
    });
    const sendData = async () => {
      await axios.post(COLLECTOR_ROUTE, formData, {
        headers:{
            'Content-Type': 'multipart/form-data'
        }
      });
    }

    sendData();
    
  };

  const handleChange = (e) => {
    setImages({...images, [e.target.name]: e.target.value});
  };

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
          <div>
            <form ref={formRef}>
              <input name="file" onChange={handleChange} type="file"/>
              <button onClick={sendImages} type="submit">Send files</button>
            </form>
          </div>
        </Route>
      </Switch>
    </Router>
    
    
  )
}

export default App;
