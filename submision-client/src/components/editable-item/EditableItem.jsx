
import {Row, Col, ListGroup} from 'react-bootstrap';
import {EditableLabel} from '../editable-label/EditableLabel';
import './EditableItem.scss';

function EditableItem({topic, onSelect, selectedOption}) {
    
    const {title, options, verified:formVerified, formId, pageOrderNumber} = topic;

    const queryParams = {
      topicId: topic.id,
      formId,
      pageOrderNumber
    };
    

    const isSelected = (value, type) => {
      return selectedOption.id === value.id && selectedOption.type === type;
    };

    const handleOnSelect = (value, type) => () => {
      onSelect(value, type);
    };

    const commonProps = (value, type) => ({
      selected: isSelected(value,type),
      onSelect: handleOnSelect(value, type)
    });

    const {TOPIC, OPTION} = EditableLabel.TYPES;

    return (
        <ListGroup.Item className="mb-1 mt-2 bg-white text-white border-0 p-2" as="li" >
          <Row>
            <Col xs={12} className="mb-1 text-primary">Statement:</Col>
            <Col xs={12} className="mb-1">
              <EditableLabel
                key={`${TOPIC}-${topic.id}`}
                label={title} 
                verified={formVerified}
                {...commonProps(topic, TOPIC)}
              />
            </Col>
            <Col xs={12} className="mb-1 text-primary">Options:</Col>
            {
              options.map((option) => {
                const {label, verified} = option;
                return (
                <Col key={`topic-option-${option.id}`} xs={12}>
                  <EditableLabel 
                    label={label}
                    verified={verified}
                    {...commonProps({...option, ...queryParams}, OPTION)}
                  />
                </Col>);
              })
            }
          </Row>
          <hr/>
        </ListGroup.Item>
      );
}

EditableItem.defaultProps = {
  selectedOption: {}
};

export {EditableItem};