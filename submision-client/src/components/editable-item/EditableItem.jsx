
import {Row, Col, ListGroup, Form} from 'react-bootstrap';
import {EditableLabel} from '../editable-label/EditableLabel';
import './EditableItem.scss';

function EditableItem({prediction, onSelect}) {
    
    const {title, options} = prediction;

    return (
        <ListGroup.Item className="mb-1 bg-light text-white border" as="li" >
          <Row>
            <Col xs={12} className="mb-1 text-primary">Statement:</Col>
            <Col xs={12} className="mb-1"><EditableLabel onSelect={onSelect} label={title} /></Col>
            <Col xs={12} className="mb-1 text-primary">Options:</Col>
            {
              options.map(option => {
                const {label} = option;
                return (
                <Col xs={4}>
                  <EditableLabel onSelect={onSelect} label={label} />
                </Col>);
              })
            }
          </Row>
        </ListGroup.Item>
      );
}

export {EditableItem};