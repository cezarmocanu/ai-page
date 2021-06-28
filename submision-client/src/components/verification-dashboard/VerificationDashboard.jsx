import React, {useState, useContext, useEffect}  from 'react';
import {useParams} from 'react-router-dom';
import {Container, Nav, Row, Col, Button, ListGroup, OverlayTrigger, Spinner, Tooltip,Toast} from 'react-bootstrap';
import {BiArrowBack} from 'react-icons/bi';
import {BsArrowsMove, BsEyeFill} from 'react-icons/bs';
import {AiOutlineQuestionCircle} from 'react-icons/ai';

import {EditableItem} from '../editable-item/EditableItem';
import {EditableLabel} from '../editable-label/EditableLabel';
import {PageBrowseIndicator} from '../page-browse-indicator/PageBrowseIndicator';
import {PropertyEditForm} from '../property-edit-form/PropertyEditForm';
import {Canvas} from '../canvas/Canvas';
import {KeyboardContext } from '../Context';

import useImage from '../../hooks/useImage';
import useResource from '../../hooks/useResource';
import useFormImageArray from '../../hooks/useFormImageArray';
import {EDIT_MODES, KEYS} from '../../constants.js';

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
  const [selectedPageONr, setSelectedPageONr] = useState(0);
  const [selectedOption, setSelectedOption] = useState({});
  
  const [image, imageLoaded] = useImage(`http://localhost:5000/analysis/${formId}/image/${selectedPageONr}`);
  const [prediction, predictionLoaded, setPrediction] = useResource(`http://localhost:5000/analysis/${formId}/page/${selectedPageONr}`, []);
  const [formData, formDataLoaded, setFormData] = useResource(`http://localhost:5000/analysis/${formId}`, {});
  const [imageArray, imageArrayLoaded] = useFormImageArray(formId);

  const [offset ,setOffset] = useState({x: 0, y: 0});
  const [origin, setOrigin] = useState({x: 0, y: 0});
  const [editMode, setEditMode] = useState(EDIT_MODES.OBSERVE);
  const [isDragging, setIsDragging] = useState(false);
  const [showShortcuts,setShowShortcuts] = useState(false);

  
  // const [rerender, setRerender] = useState(true);//set rerender using only one setState

  // const [editedValue, setEditedValue] = useState();

  const keyEvent = useContext(KeyboardContext);

  useEffect(()=>{
    const {code:key} = keyEvent;
  
    if (key === KEYS.SPACE) {
      setEditMode(EDIT_MODES.PAN);
      return;
    }

    if (key === KEYS.O) {
      setEditMode(EDIT_MODES.OBSERVE);
      return;
    }

    if (key === KEYS.ESC) {
      setSelectedOption({});
      return;
    }

    if (key === KEYS.UP || key === KEYS.DOWN) {

      if(Object.values(selectedOption).length === 0) {
        
        const {topics} = prediction;

        for(let i = 0;i < topics.length;i++) {
          const {options, verified,id: topicId} = topics[i];
          if (!verified) {
            onSelect({
              ...topics[i],
              formId,
              pageOrderNumber: selectedPageONr,
              type: TOPIC
            }, TOPIC);    
            return;
          }

          for(let oI = 0; oI < options.length; oI++) {
            const option = options[oI];
            console.log(option)
            if (!option.verified) {
              onSelect({
                ...option,
                formId,
                topicId,
                pageOrderNumber: selectedPageONr,
                type: OPTION
              }, OPTION);  
              return;
            }
          }
        }

        onSelect({
          ...prediction.topics[0],
          formId,
          pageOrderNumber: selectedPageONr,
          type: TOPIC
        }, TOPIC);
      }
      else {
        
        if (key === KEYS.DOWN) {
          if (selectedOption.type === TOPIC) {
            const topic = selectedOption;
            const {formId, pageOrderNumber, id, options} = topic;

            if (options.length > 0) {
              onSelect({
                ...options[0],
                topicId: id,
                formId,
                pageOrderNumber,
                type: OPTION
              }, OPTION);
            }
            else {
              // in caz ca topicul nu are optiuni sa treci la urmatorul topic
            }
          }
          else if (selectedOption.type === OPTION) {
            const option = selectedOption;
            const {formId, pageOrderNumber, topicId, id} = option;

            const topics = prediction.topics;
            const topicIndex = topics.findIndex(topic => topic.id === topicId);

            const options = topics[topicIndex].options;
            const optionIndex = options.findIndex(opt => opt.id === id);
            
            if (optionIndex + 1 < options.length) {
              onSelect({
                ...options[optionIndex+1],
                topicId,
                formId,
                pageOrderNumber,
                type: OPTION
              }, OPTION);
            }
            else if (topicIndex + 1 < topics.length){
              onSelect({
                ...topics[topicIndex + 1],
                formId,
                pageOrderNumber: selectedPageONr,
                type: TOPIC
              }, TOPIC)
            }
            else {
              return;
            }
            
          }
        }
        else if (key === KEYS.UP) {
          if (selectedOption.type === TOPIC) {
            const topic = selectedOption;
            const {formId, pageOrderNumber, id} = topic;

            const topics = prediction.topics;
            const topicIndex = topics.findIndex(topic => topic.id === id);

            if (topicIndex === 0) {
              return;
            }
            else if (topicIndex - 1 >= 0) {
              const prevTopic = topics[topicIndex - 1];
              if (prevTopic.options.length > 0) {
                const lastOptionIndex = prevTopic.options.length - 1;
                const option = prevTopic.options[lastOptionIndex];
                onSelect({
                      ...option,
                      topicId: prevTopic.id,
                      formId,
                      pageOrderNumber,
                      type: OPTION
                    }, OPTION);
              }
              else {
                //de facut daca nu are options sa mearga la topicul precedent
              }
             
            }
           
          }
          else if (selectedOption.type === OPTION) {
            const option = selectedOption;
            const {formId,topicId, pageOrderNumber, id} = option;

            const topics = prediction.topics;
            const topicIndex = topics.findIndex(topic => topic.id === topicId);

            const currentTopic = topics[topicIndex];
            const {options} = currentTopic;
            const optionIndex = options.findIndex(opt => opt.id === id);

            if (optionIndex - 1 >= 0) {
              const prevOption = options[optionIndex - 1];
              onSelect({
                ...prevOption,
                topicId,
                formId,
                pageOrderNumber,
                type: OPTION
              }, OPTION);
            }
            else {
              onSelect({
                ...currentTopic,
                formId,
                pageOrderNumber: selectedPageONr,
                type: TOPIC
              }, TOPIC)
            }

            
          }
        }
        
      }
      
    }


  },[keyEvent]);

  const draw = (ctx, dt) => {

    if (!imageLoaded || !predictionLoaded || !imageArrayLoaded) {
      return;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(image, offset.x, offset.y);
    
    if (selectedOption.type === OPTION) {
      ctx.fillStyle = '#00c5cf';
      const {x, y, w, h} = selectedOption;
      ctx.fillRect(offset.x + x,offset.y + y,w,h);
    }
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
      
      setSelectedOption({...value, type: TOPIC});

      let {x,y} = value.options[0];
      
      // const {x, y} = options[0];      
      value.options.forEach(option => {
        x = option.x < x ? option.x : x;
        y = option.y < y ? option.y : y;
      })
      
      setOffset({
        x: CANVAS_CONFIG.WIDTH * 1 / 4 - x, 
        y: CANVAS_CONFIG.HEIGHT / 2 - y
      });
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
    setSelectedPageONr(index);
    setSelectedOption({});
  };

  const createEditModeHandler = (editMode) => (e) => setEditMode(editMode);
  
  const toggleShortcuts = () => {
    setShowShortcuts(prevValue => !prevValue);
  };

  return (
    <Container fluid className='verification-dashboard full bg-white p-0'> 
      <Row className='full m-0'>
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
            
            <OverlayTrigger
              placement='right'
              overlay={<Tooltip  id='observeTooltip'>Observe (O)</Tooltip>}
              >
              <Button
                onClick={createEditModeHandler(EDIT_MODES.OBSERVE)}
                className='mb-2'
                variant={editMode === EDIT_MODES.OBSERVE ? 'info' : 'secondary'}>
                <BsEyeFill/>  
              </Button>
            </OverlayTrigger>

            <OverlayTrigger
              placement='right'
              overlay={<Tooltip id='panTooltip'>Pan/Move (Space)</Tooltip>}
              >
              <Button
                onClick={createEditModeHandler(EDIT_MODES.PAN)}
                className='mb-2'
                variant={editMode === EDIT_MODES.PAN ? 'info' : 'secondary'}>
                <BsArrowsMove/>  
              </Button>
            </OverlayTrigger>

            <OverlayTrigger
              placement='right'
              overlay={<Tooltip id='shortcuts'>Shortcuts</Tooltip>}
              >
              <Button
                onClick={toggleShortcuts}
                className='mb-2'
                variant='secondary'>
                <AiOutlineQuestionCircle/>  
              </Button>
            </OverlayTrigger>
          </Nav>
        </Col>
        <Col xs={7} className='d-flex justify-content-center align-items-center h-100'>
            <Row className='h-100'>
                <Col className='page-browse' xs={2}>
                  {!imageArrayLoaded ? 
                    <div className='flex-center fluid'>
                      <Spinner animation="border" variant="primary" />
                    </div>
                    : 
                    imageArray.map(({image}, index) => (
                      <PageBrowseIndicator
                        index={index}
                        image={image}
                        verified={formData.pages[index].verified}
                        maxLength={imageArray.length}
                        selectedPageIndex={selectedPageONr}
                        onBrowseItemClick={handleBrowseItemClick(index)}
                      />
                    ))
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
            {prediction.topics && prediction.topics.map((topic, index) => (
              <EditableItem
                key={`editable-item-${index}`}
                onSelect={onSelect} topic={{...topic, formId, pageOrderNumber: selectedPageONr}}
                selectedOption={selectedOption}
              />
            ))}
          </ListGroup>
        </Col>
        
      </Row>
      <Toast show={showShortcuts} onClose={toggleShortcuts} className='shortcuts-toast'>
          <Toast.Header>
            <h4>Help & Shortcuts</h4>
          </Toast.Header>
          <Toast.Body>
            <div>
              <h5><AiOutlineQuestionCircle/> Help:</h5>
              <p>In this dashboard you can verify if the extracted data is correct.
              Simply click on any option from the right panel and mark it as checked or modify it
              and save it.
              </p>
            </div>
            <div>
              <h5><AiOutlineQuestionCircle/>  Shortcuts:</h5>
              <p>Up Arrow - move to the previous extraction</p>
              <p>Down Arrow - move to next extraction</p>
              <p>Enter - focus the text so you can edit it</p>
              <p>Enter Twice - save the modification or mark extraction as checked</p>
              <p>Esc - deselect extraction</p>
              <p>O - Switch in observe mode</p>
              <p>Space - Switch to pan/move mode, so you can drag the image</p>
            </div>

            
          </Toast.Body>
        </Toast>
    </Container>
  );
}

export {VerificationDashboard};
