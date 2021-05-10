
import {Row, Col, ListGroup, Form} from 'react-bootstrap';
import {EditableLabel} from '../editable-label/EditableLabel';
import './EditableItem.scss';

function EditableItem({prediction}) {
    
    const {TITLE, INPUTS} = prediction;

    return (
        <ListGroup.Item className="mb-5 bg-success text-white" as="li" >
          <Row>
            <Col xs={12}><EditableLabel label={TITLE} /></Col>
            {
              INPUTS.map(input => {
                const {LABEL} = input;
                return (
                <Col xs={4}>
                  <Form.Check type="checkbox" label={<EditableLabel label={LABEL} />} />
                </Col>);
              })
            }
          </Row>
        </ListGroup.Item>
      );
}

export {EditableItem};