import React,{useState, useEffect, useMemo} from 'react'; 
import {Row, Col, Alert, Card, Button, Badge, ProgressBar} from 'react-bootstrap';
import {Link} from "react-router-dom";

import {Page} from '../../components/page/Page';

import {get, ENDPOINTS, COLORS} from '../../constants';

function DashboardPage() {

    const [loop, setLoop] = useState(null);
    const [analyses, setAnalysis] = useState([]);

    const fetchData = async () => {
        const results = await get(ENDPOINTS.ANALISYS_ALL);
        setAnalysis(results.data);
    }

    useEffect(()=>{
        setLoop(setInterval(fetchData, 5000));
        fetchData();
        return () => {
            clearInterval(loop);
        }
    }, [])

    //TODO create component for this
    const renderAnalisysCard = (analysis) => {
        const {id, title, status, images:numberOfImages, pages:analisedPages} = analysis;

        const BUTTON_MAPPING = {
            NEW: {
                color: 'info',
                label: 'Analysis in proggress'
            },
            ANALYSED: {
                color: 'warning',
                label: 'Check Analysis'
            },
            VERIFIED: {
                color: 'success',
                label: 'Edit Analysis'
            }
        }

        const {color, label} = BUTTON_MAPPING[status];

        const renderAction = () => {
            if(status === 'NEW') {
                return (
                    <div>
                        <span>{`Analizing... (${analisedPages} / ${numberOfImages})`}</span>
                        <ProgressBar animated variant="success" min={0} max={numberOfImages} now={analisedPages} />
                    </div>
                    
                )
            }
            if(status === 'ANALYSED') {
                return (
                    <Link to={`/verification/${id}`}>
                        <Button variant='outline-primary'>{label}</Button>
                    </Link>)
            }

            return <Button variant='outline-primary'>{label}</Button>
        }

        return (
            <Col xs={2} className='flex'>
                <Card>
                    <Card.Body>
                        <Card.Title>{title}</Card.Title>
                        <Card.Text>
                            <Badge variant={color}>
                                {status}
                            </Badge>
                        </Card.Text>
                        {renderAction()}
                    </Card.Body>
                </Card>
            </Col>
        )
    }

    const ANALYSES = useMemo(() => {
        return analyses.map(analysis => renderAnalisysCard(analysis))
    }, [analyses])

    return (
        <Page>
            <Row className='bg-dark flex-vertical-center p-4'>
                <Col>
                    <Link to="/submit">
                        <Button variant='primary'>Submit new form</Button>
                    </Link>
                </Col>
                <Col>
                    <Alert  className='m-0' variant='info'>Below are your analized forms</Alert>
                </Col>
            </Row>
            <Row className='fluid-w p-4'>
                {ANALYSES}    
            </Row>
        </Page>
    );
}

export {DashboardPage};