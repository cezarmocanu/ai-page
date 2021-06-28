import React,{useRef, useEffect, useState} from 'react';
import {Form, Row, Col, Button, Modal, Nav,OverlayTrigger,Tooltip, Alert} from 'react-bootstrap';
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';
import {AiFillDelete} from 'react-icons/ai';
import {BiArrowBack} from 'react-icons/bi';

import './SubmitPage.scss';

const COLLECTOR_ROUTE = 'http://localhost:5000/template/'

const DEFAULT_STATE = {
    title: ''
};
function SubmitPage(){
    const [images, setImages] = useState({});
    const [fileInputs, setFileInputs] = useState([])
    const [data, setData] = useState(DEFAULT_STATE);
    const [showModal, setShowModal] = useState(false);
    const [viewImage, setViewImage] = useState();

    const formRef = useRef();

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
        setFileInputs([]);
        setImages({});
        setData(DEFAULT_STATE)
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

    const handleOnDelete = (uuid) => (e) => {
        const index = fileInputs.findIndex(inputName => inputName === uuid);
        
        const preInputs = fileInputs.slice(0, index);
        const postInputs = fileInputs.slice(index + 1);
        setFileInputs([...preInputs, ...postInputs]);

        delete images[uuid];
    };

    const toggleModal = () => {
        setShowModal(prevState => !prevState);
    }

    const previewImage = (uuid) => () => {
        setViewImage(images[uuid])
        toggleModal();
    };
    
    return (
        <Row className='bg-light fluid m-0 submit-page'>
            <Col xs={1} className='navigation bg-dark p-2'>
                <Nav className='flex-column p-0'>
                    <OverlayTrigger
                    placement='right'
                    overlay={<Tooltip id='goBackTooltip'>Go back</Tooltip>}
                    >
                    <Button
                        href='/'
                        className='mb-2'
                        variant='secondary'>
                        <BiArrowBack/>  
                    </Button>
                    </OverlayTrigger>
                </Nav>
            </Col>
                
            <Col xs={{span:8,offset:1}} className='pt-5 bg-white'>
                <Alert variant='info'>
                    Select your files and submit a form name to start an analysis
                </Alert>
                <Form ref={formRef}>
                    <Form.Group>
                        <Form.Label>Template Form Name</Form.Label>
                        <Form.Control type='text'  placeholder ='Form name...' onChange={handleFormChange} name='title' value={data.title} />
                    </Form.Group>
                    <Button onClick={addFileInput} variant="outline-info" className='mr-3'>Add File</Button>
                    <Button onClick={sendImages} variant="outline-primary" type="submit">Send files</Button>
                    <Row className='pt-3 m-0 submissions'>
                        {fileInputs.map((inputName,index) => (
                            <Col xs={6} key={inputName}>
                                <div className='input-container mb-2 p-2'>
                                    <Form.Group>
                                        <Form.Label as={'h4'}>Page {index + 1}</Form.Label>
                                        <Row className='ml-0 mr-0 p-0 mt-4'>
                                            <Col className='p-0' xs={10}>
                                                <Form.Control  className='p-0' onChange={handleFileChange} name={inputName} type='file'/>
                                            </Col>
                                            <Col className='p-0' xs={2}>
                                            {images[inputName] && <Button onClick={previewImage(inputName)}>View</Button>}
                                            </Col>
                                        </Row>
                                        
                                        {/* <Button  variant='danger' className='ml-2 mt-5'>Delete</Button> */}
                                        <div className='delete-icon' onClick={handleOnDelete(inputName)}>
                                            <AiFillDelete />
                                        </div>
                                    </Form.Group>
                                </div>
                            </Col>
                        ))}
                    </Row>
                    
                </Form>
            
            </Col>
            <Modal className='preview-modal' show={showModal} onHide={toggleModal}>
                <Modal.Header closeButton>
                <Modal.Title>Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body className='preview-modal-body'>
                    <div className='preview-image'>
                        <img src={viewImage} />
                    </div>
                </Modal.Body>
            </Modal>
        </Row>
    );
}

export {SubmitPage};