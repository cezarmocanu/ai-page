import React,{useRef, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form, Row, Col} from 'react-bootstrap';
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import {VerificationDashboard} from './components/verification-dashboard/VerificationDashboard';

import './App.scss';

const COLLECTOR_ROUTE = 'http://localhost:5000/template/'

function App() {
  const formRef = useRef();
  const [images, setImages] = useState({});
  const [fileInputs, setFileInputs] = useState([uuidv4()])
  const [data, setData] = useState({title: ''});

  const sendImages = (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(images).forEach(key => {
      formData.append(key, images[key]);
    });
    
    formData.append('title', data.title);
    
    
    const sendData = async () => {
      await axios.post(COLLECTOR_ROUTE, formData, {
        headers:{
            'Content-Type': 'multipart/form-data'
        }
      });
    }
    sendData();
  };

  const handleFormChange =  (e) => {
    setData({...data, [e.target.name]: e.target.value});
  };

  const handleFileChange = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onload = (loadEvent) => {
      setImages({...images, [e.target.name]: loadEvent.target.result});
    }
    reader.readAsDataURL(file);
  };

  const addFileInput = (e) => {
    setFileInputs([...fileInputs, uuidv4()])
  }

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
          <Row>
            <Col xs={6}>
              <Form ref={formRef}>
                <input onChange={handleFormChange} name='title' type='text' value={data.title} />
                {fileInputs.map(inputName => <input key={inputName} onChange={handleFileChange} name={inputName} type='file'/>)}
              </Form>
              <button onClick={addFileInput}>Add File</button>
              <button onClick={sendImages} type="submit">Send files</button>
              {/* <img src={images['file'] === undefined ? '' : images['file']}/> */}
            </Col>
            </Row>
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
