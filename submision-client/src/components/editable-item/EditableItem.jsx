
import {Row, Col, ListGroup, Form} from 'react-bootstrap';
import {EditableLabel} from '../editable-label/EditableLabel';
import './EditableItem.scss';

function EditableItem({prediction, onSelect}) {
    
    const {TITLE, INPUTS} = prediction;

    return (
        <ListGroup.Item className="mb-1 bg-light text-white border" as="li" >
          <Row>
            <Col xs={12} className="mb-1 text-secondary">Statement:</Col>
            <Col xs={12} className="mb-1"><EditableLabel onSelect={onSelect} label={TITLE} /></Col>
            <Col xs={12} className="mb-1 text-secondary">Options:</Col>
            {
              INPUTS.map(input => {
                const {LABEL} = input;
                return (
                <Col xs={4}>
                  <EditableLabel onSelect={onSelect} label={LABEL} />
                </Col>);
              })
            }
          </Row>
        </ListGroup.Item>
      );
}

export {EditableItem};