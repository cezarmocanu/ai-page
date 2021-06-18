import React, {useState}  from 'react';
import {useParams} from 'react-router-dom';
import {Container, Nav, Row, Col, Button, ListGroup} from 'react-bootstrap';
import {BiArrowBack} from 'react-icons/bi';
import {BsArrowsMove, BsEyeFill} from 'react-icons/bs';

import {EditableItem} from '../editable-item/EditableItem';
import {EditableLabel} from '../editable-label/EditableLabel';
import {PropertyEditForm} from '../property-edit-form/PropertyEditForm';
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

const {TOPIC, OPTION} = EditableLabel.TYPES;

function VerificationDashboard() {

  const {formId} = useParams();
  // const [formData, loadedFormData] = useResource(`http://localhost:5000/analysis/${formId}`, {})
  const [selectedImageId, setSelectedImageId] = useState(0);
  const [selectedOption, setSelectedOption] = useState({});
  
  const [image, imageLoaded] = useImage(`http://localhost:5000/analysis/${formId}/image/${selectedImageId}`);
  const [prediction, predictionLoaded, setPrediction] = useResource(`http://localhost:5000/analysis/${formId}/page/${selectedImageId}`, []);
  const [imageArray, imageArrayLoaded] = useFormImageArray(formId);

  const [offset ,setOffset] = useState({x: 0, y: 0});
  const [origin, setOrigin] = useState({x: 0, y: 0});
  const [editMode, setEditMode] = useState(EDIT_MODES.OBSERVE);
  const [isDragging, setIsDragging] = useState(false);
  // const [rerender, setRerender] = useState(true);//set rerender using only one setState

  // const [editedValue, setEditedValue] = useState();

  const draw = (ctx, dt) => {

    if (!imageLoaded || !predictionLoaded || !imageArrayLoaded) {
      // console.log(imageLoaded)
      return;
      
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(image, offset.x, offset.y);
    
    if (selectedOption.type === OPTION) {
      ctx.fillStyle = '#00c5cf';
      const {x, y, w, h} = selectedOption;
      ctx.fillRect(offset.x + x,offset.y + y,w,h);
    }
    // prediction.topics.forEach((pred, index) => {
    //   const {options} = pred;

    //   ctx.fillStyle = RANDOM_COLORS[index % RANDOM_COLORS.length];
    //   options.forEach(option => {
    //       const {x, y, w, h} = option;
    //       ctx.fillRect(offset.x + x,offset.y + y,w,h);
    //   });

    // });
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
      // console.log('mouse move')
    }
    
  };

  const mouseDown = (e) => {
    setIsDragging(true);
    setOrigin({x: e.offsetX, y: e.offsetY});
  };

  const mouseUp = (e) => {
    setIsDragging(false);
  };

  const onSelect = (value, type) => {

    if (type === TOPIC) {
      const {options, ...topic} = value;
      setSelectedOption({...topic, type: TOPIC});
    }
    else if (type === OPTION){
      const {x, y} = value;

      setSelectedOption({...value, type: OPTION});

      setOffset({
        x: CANVAS_CONFIG.WIDTH * 1 / 4 - x, 
        y: CANVAS_CONFIG.HEIGHT / 2 - y
      });
    }
  };

  const onCancelEdit = (e) => {
    e.preventDefault();
    setSelectedOption({});
  };

  const onMarkAsChecked = (e) => {
    e.preventDefault();
    const {type} = selectedOption;

    if (type === TOPIC) {
      const {topics} = prediction;
      const index = topics.findIndex(pred => pred.id === selectedOption.id);
      const pre = topics.slice(0, index);
      const post = topics.slice(index + 1);
      const newTopics = [...pre, {...topics[index], verified: true}, ...post];
      setPrediction({...prediction, topics: newTopics});
    }

    if (type === OPTION) {
      const {topics} = prediction;
      const topicIndex = topics.findIndex(pred => pred.id === selectedOption.topicId);
      const topicPre = topics.slice(0, topicIndex);
      const topicPost = topics.slice(topicIndex + 1);

      const topic = topics[topicIndex];

      const optionIndex = topic.options.findIndex(opt => opt.id === selectedOption.id);
      const optionPre = topic.options.slice(0, optionIndex);
      const optionPost = topic.options.slice(optionIndex + 1);

      const newOptions = [...optionPre, {...topic.options[optionIndex], verified: true}, ...optionPost];

      const newTopics = [...topicPre, {...topic, options: newOptions}, ...topicPost];
      setPrediction({...prediction, topics: newTopics});
    }

    setSelectedOption({});

  };

  const onSaveModification = (updatedValue) => {
    const {type} = selectedOption;

    if (type === TOPIC) {
      const {topics} = prediction;
      const index = topics.findIndex(pred => pred.id === selectedOption.id);
      const pre = topics.slice(0, index);
      const post = topics.slice(index + 1);
      const newTopics = [
          ...pre, 
          {
            ...topics[index],
            title: updatedValue,
            verified: true
          },
          ...post
      ];

      setPrediction({...prediction, topics: newTopics});
    }

    if (type === OPTION) {
      const {topics} = prediction;
      const topicIndex = topics.findIndex(pred => pred.id === selectedOption.topicId);
      const topicPre = topics.slice(0, topicIndex);
      const topicPost = topics.slice(topicIndex + 1);

      const topic = topics[topicIndex];

      const optionIndex = topic.options.findIndex(opt => opt.id === selectedOption.id);
      const optionPre = topic.options.slice(0, optionIndex);
      const optionPost = topic.options.slice(optionIndex + 1);

      const newOptions = [
        ...optionPre, 
        {
          ...topic.options[optionIndex],
          label: updatedValue,
          verified: true
        },
        ...optionPost
      ];

      const newTopics = [
        ...topicPre, 
        {
          ...topic,
          options: newOptions
        },
        ...topicPost
      ];
      
      setPrediction({...prediction, topics: newTopics});
    }
    setSelectedOption({});

  };

  const handleBrowseItemClick = (index) => () => {
    setSelectedImageId(index);
    setSelectedOption({});
  };

  const createEditModeHandler = (editMode) => (e) => setEditMode(editMode);
  
  return (
    <Container fluid className='verification-dashboard full bg-white p-0'> 
      <Row className='full m-0'>
        <Col xs={1} className='bg-dark p-2'>
          <Nav className='flex-column p-0'>
            <Button
              href='/'
              className='mb-2'
              variant='secondary'>
                <BiArrowBack/>  
            </Button>
            <Button
              onClick={createEditModeHandler(EDIT_MODES.OBSERVE)}
              className='mb-2'
              variant={editMode === EDIT_MODES.OBSERVE ? 'info' : 'secondary'}>
              <BsEyeFill/>  
            </Button>
            <Button
              onClick={createEditModeHandler(EDIT_MODES.PAN)}
              className='mb-2'
              variant={editMode === EDIT_MODES.PAN ? 'info' : 'secondary'}>
              <BsArrowsMove/>  
            </Button>
          </Nav>
        </Col>
        <Col xs={7} className='d-flex justify-content-center align-items-center h-100'>
            <Row className='h-100'>
                <Col className='page-browse' xs={2}>
                  {!imageArrayLoaded ? 'loading...' : 
                    imageArray.map(({image}, index) => 
                    <div key={`$browse-item-${index}`} onClick={handleBrowseItemClick(index)} className={`page-indicator ${index === selectedImageId && 'selected'}`}>
                      <img src={image.currentSrc} alt=''/>
                      <span>{index + 1} / {imageArray.length} </span>
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
        <Col xs={4} className='bg-white p-0 full p-relative border-left overflow-hidden'>
          <PropertyEditForm
            onCancelEdit={onCancelEdit}
            selectedOption={selectedOption}
            onMarkAsChecked={onMarkAsChecked}
            onSave={onSaveModification}
          />
          <ListGroup className='prediction-list'>
            {prediction.topics && prediction.topics.map((pred, index) => (
              <EditableItem
                key={`editable-item-${index}`}
                onSelect={onSelect} prediction={pred}
                selectedOption={selectedOption}
              />
            ))}
          </ListGroup>
        </Col>
        
      </Row>   
    </Container>
  );
}

export {VerificationDashboard};
