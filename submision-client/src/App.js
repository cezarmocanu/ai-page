import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, Nav, Row, Col, Button, ListGroup} from 'react-bootstrap';
import {useState} from 'react';
import {BsArrowsMove, BsEyeFill} from 'react-icons/bs';
import {Canvas} from './Canvas';
import useImage from './useImage';
import useResource from './useResource';
import {EDIT_MODES, RANDOM_COLORS} from './constants';
import {EditableItem} from './components/editable-item/EditableItem';

import './App.scss';

const CANVAS_CONFIG = {
  WIDTH: 600,
  HEIGHT: window.innerHeight - 20,
  DRAG_SPEED_X: 50,
  DRAG_SPEED_Y: 30
};



function App() {

  const [image, imageLoaded] = useImage('http://localhost:5000/image/2');
  const [prediction, predictionLoaded] = useResource('http://localhost:5000/ocr/2');

  const [offset ,setOffset] = useState({x:0,y:0});
  const [origin, setOrigin] = useState({x:0, y:0});
  const [editMode, setEditMode] = useState(EDIT_MODES.OBSERVE);
  const [rerender, setRerender] = useState(true);//set rerender using only one setState

  const [isDragging, setIsDragging] = useState(false);

  const draw = (ctx, dt) => {

    if (!imageLoaded || !predictionLoaded) {
      return;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(image, offset.x, offset.y);

    
    
    prediction.forEach((pred, index) => {
      const {INPUTS} = pred;

      ctx.fillStyle = RANDOM_COLORS[index % RANDOM_COLORS.length];
      INPUTS.forEach(input => {
          const {CHECKBOX} = input;
          const [x, y, w, h] = CHECKBOX;
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

  const createEditModeHandler = (editMode) => (e) => setEditMode(editMode);
  return (
    <Container fluid className="full bg-light p-0"> 
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
        <Col xs={7} className="d-flex justify-content-center align-items-center">
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
        <Col xs={4} className="bg-dark full overflow-scroll pt-3">
          <ListGroup className="">
            {prediction.map(pred => <EditableItem prediction={pred} />)}
          </ListGroup>
        </Col>
        
      </Row>   
    </Container>
  );
}

export default App;
