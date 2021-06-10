import React, {useState}  from 'react';
import {useParams} from 'react-router-dom';
import {Container, Nav, Row, Col, Button, ListGroup, Alert} from 'react-bootstrap';
import {BsArrowsMove, BsEyeFill} from 'react-icons/bs';

import {EditableItem} from '../editable-item/EditableItem';
import {Canvas} from '../canvas/Canvas';

import useImage from '../../hooks/useImage';
import useResource from '../../hooks/useResource';
import useFormImageArray from '../../hooks/useFormImageArray';
import {EDIT_MODES, RANDOM_COLORS} from '../../constants.js';

import './VerificationDashboard.scss';

const CANVAS_CONFIG = {
  WIDTH: 600,
  HEIGHT: window.innerHeight - 20,
  DRAG_SPEED_X: 50,
  DRAG_SPEED_Y: 30
};

function VerificationDashboard() {

  const {formId} = useParams();
  // const [formData, loadedFormData] = useResource(`http://localhost:5000/analysis/${formId}`, {})
  const [image, imageLoaded] = useImage(`http://localhost:5000/analysis/${formId}/image/${0}`);
  const [prediction, predictionLoaded] = useResource(`http://localhost:5000/analysis/${formId}/page/${0}`, []);
  const [imageArray, imageArrayLoaded] = useFormImageArray(formId);

  const [offset ,setOffset] = useState({x:0,y:0});
  const [origin, setOrigin] = useState({x:0, y:0});
  const [editMode, setEditMode] = useState(EDIT_MODES.OBSERVE);
  const [isDragging, setIsDragging] = useState(false);
  const [rerender, setRerender] = useState(true);//set rerender using only one setState

  const [editedValue, setEditedValue] = useState("null");

  const draw = (ctx, dt) => {

    if (!imageLoaded || !predictionLoaded || !imageArrayLoaded) {
      // console.log(imageLoaded)
      return;
      
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(image, offset.x, offset.y);
    
    prediction.topics.forEach((pred, index) => {
      const {options} = pred;

      ctx.fillStyle = RANDOM_COLORS[index % RANDOM_COLORS.length];
      options.forEach(option => {
          const {x, y, w, h} = option;
          ctx.fillRect(offset.x + x,offset.y + y,w,h);
      });

    });
   
  };

  const panImage = (e) => {
    const [dX, dY] =  [e.offsetX - origin.x, e.offsetY - origin.y];

    const dragPercentX = dX / CANVAS_CONFIG.WIDTH;
    const dragPercentY = dY / CANVAS_CONFIG.HEIGHT;

    let [newX, newY] = [offset.x, offset.y];
    newX = offset.x + dragPercentX * CANVAS_CONFIG.DRAG_SPEED_X;
    newY = offset.y + dragPercentY * CANVAS_CONFIG.DRAG_SPEED_Y;

    if (newX < -image.width + CANVAS_CONFIG.WIDTH) {
      newX = -image.width + CANVAS_CONFIG.WIDTH;
    }

    if (newY < -image.height + CANVAS_CONFIG.HEIGHT) {
      newY = -image.height + CANVAS_CONFIG.HEIGHT;
    }

    if (newX > 0) {
      newX = 0;
    }

    if (newY > 0) {
      newY = 0;
    }

    setOffset({x:newX, y:newY});
  }

  const mouseMove = (e) => {
    if (isDragging) {
      //distances from start origin

      if (editMode === EDIT_MODES.PAN) {
        panImage(e);
      }
    
    }
    else {
      // console.log("mouse move")
    }
    
  };

  const mouseDown = (e) => {
    setIsDragging(true);
    setOrigin({x:e.offsetX, y:e.offsetY});
  };

  const mouseUp = (e) => {
    setIsDragging(false);
  };



  const onSelect = (value) => {
    setEditedValue(value);
  };

  const onCancelEdit = (e) => {
    e.preventDefault();
    setEditedValue(false);
  }

  const createEditModeHandler = (editMode) => (e) => setEditMode(editMode);
  
  return (
    <Container fluid className="verification-dashboard full bg-light p-0"> 
      <Row className="full m-0">
        <Col xs={1} className="bg-dark p-2">
          <Nav className="flex-column p-0">
            <Button
              onClick={createEditModeHandler(EDIT_MODES.OBSERVE)}
              className="mb-2"
              variant={editMode === EDIT_MODES.OBSERVE ? 'info' : 'success'}>
              <BsEyeFill/>  
            </Button>
            <Button
              onClick={createEditModeHandler(EDIT_MODES.PAN)}
              className="mb-2"
              variant={editMode === EDIT_MODES.PAN ? 'info' : 'success'}>
              <BsArrowsMove/>  
            </Button>
          </Nav>
        </Col>
        <Col xs={7} className="d-flex justify-content-center align-items-center h-100">
            <Row className="h-100">
                <Col className="page-browse" xs={2}>
                  {!imageArrayLoaded ? 'loading...' : 
                    imageArray.map(({image}, index) => 
                    <div className='page-indicator'>
                      <img src={image.currentSrc}  />
                      <span>{index} / </span>
                    </div>)
                  }
                </Col>
                <Col xs={10}>
                  <Canvas
                    editMode={editMode}
                    handlers={{
                      mousemove: mouseMove,
                      mousedown: mouseDown,
                      mouseup: mouseUp,
                      mouseleave: mouseUp
                    }}
                    draw={draw}
                    width={CANVAS_CONFIG.WIDTH}
                    height={CANVAS_CONFIG.HEIGHT}
                  />
                </Col>
            </Row>
        </Col>
        <Col xs={4} className="bg-light full p-relative border-left overflow-hidden">
          <Row className="edit-overlay bg-dark">
          {editedValue ?
            <React.Fragment>
              <Col xs={12} className="mb-2">
                <textarea className="fluid" value={editedValue} />
              </Col>
              <Col xs={6}>
                <Button className='fluid' variant="info">Save</Button>
              </Col>
              <Col xs={6}>
                <Button className='fluid' variant="danger" onClick={onCancelEdit}>Cancel</Button>
              </Col>
            </React.Fragment>
            :
            <Col xs={12} className="mb-2">
              <Alert className="m-0" variant="secondary">Click on any label to toggle edit</Alert>
            </Col>
          }
          </Row>
          <ListGroup className="prediction-list">
            {prediction.topics && prediction.topics.map(pred => <EditableItem onSelect={onSelect} prediction={pred} />)}
          </ListGroup>
        </Col>
        
      </Row>   
    </Container>
  );
}

export {VerificationDashboard};
