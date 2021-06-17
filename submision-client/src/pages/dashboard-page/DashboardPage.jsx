import React,{useState, useEffect, useMemo} from 'react'; 
import {Row, Col, Alert, Card, Button, Badge, ProgressBar} from 'react-bootstrap';
import {Link} from "react-router-dom";
import {SiProbot} from 'react-icons/si';
import {GoLightBulb} from 'react-icons/go';
import {FiCheckCircle} from 'react-icons/fi';
import {ImSpinner4} from 'react-icons/im';
import {AiOutlineFileImage} from 'react-icons/ai';

import {Page} from '../../components/page/Page';

import {get, ENDPOINTS, COLORS} from '../../constants';

const STATUS_ICON_MAP = {
    NEW: {
        color: 'info',
        Component: GoLightBulb,
    },
    ANALYSED: {
        color: 'warning',
        Component: SiProbot
    },
    VERIFIED: {
        color: 'success',
        Component: FiCheckCircle
    }
};

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

function DashboardPage() {
    const [analyses, setAnalysis] = useState([]);

    const fetchData = async () => {
        const results = await get(ENDPOINTS.ANALISYS_ALL);
        setAnalysis(results.data);
    }

    useEffect(()=>{
        const interval = setInterval(fetchData, 5000);
        fetchData();
        return () => {
            clearInterval(interval);
        }
    }, [])

    //TODO create component for this
    const renderAnalisysCard = (analysis) => {
        const {id, title, status, images:numberOfImages, pages:analisedPages} = analysis;

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

        const StatusIcon = STATUS_ICON_MAP[status].Component;
        const iconColor = STATUS_ICON_MAP[status].color;
        return (
            <Col xs={2} className='flex'>
                <Card>
                    <Card.Body>
                        <Card.Title>{title} <StatusIcon className={`ml-2 mb-2 text-${iconColor}`}/></Card.Title>
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

    const renderDashboardOverview = () => {
        //TODO De calculat countul in backend si de facut fetch pt date
        // const {id, title, status} = analysis;
        // STATUS_ICON_MAP

        const counts = {
            images: 0,
            pages: 0,
            newForms: 0,
            analysedForms: 0,
            verifiedForms: 0 
        };

        analyses.forEach(analysis => {
            const {status, images, pages} = analysis;
            counts.images += images;
            counts.pages += pages;
            counts[status.toLowerCase()+'Forms'] += 1;
        });

        const {images, pages, newForms, analysedForms, verifiedForms} = counts;

        return (
            <Col xs={12} className='mb-4 p-4 border border-secondary'>
                <Row>
                    <Col xs={12} className='mb-4'>
                        <h2>OVERVIEW</h2>
                    </Col>
                    <Col xs={4}>
                        <Row>
                            <Col xs={12} className='mb-2'>
                                <h5>PAGES & IMAGES</h5>
                            </Col>
                            <Col xs={6}>
                                <h6>Form images: {images} <ImSpinner4 className='mb-2 ml-1'/> </h6>
                            </Col>
                            <Col xs={6}>
                                <h6>Analysed pages: {pages} <AiOutlineFileImage className='mb-1 ml-1'/> </h6>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={{span:6, offset:2}}>
                        <Row>
                            <Col xs={12} className='mb-2'><h5>FORMS</h5></Col>
                            <Col xs={4}>
                                <h6>NEW: {newForms} <STATUS_ICON_MAP.NEW.Component className={`mb-2 ml-1 text-${STATUS_ICON_MAP.NEW.color}`}/></h6>
                                
                            </Col>
                            <Col xs={4}>
                                <h6>ANALYSED: {analysedForms} <STATUS_ICON_MAP.ANALYSED.Component className={`mb-2 ml-1 text-${STATUS_ICON_MAP.ANALYSED.color}`}/></h6>
                            </Col>
                            <Col xs={4}>
                                <h6>VERIFIED: {verifiedForms} <STATUS_ICON_MAP.VERIFIED.Component className={`mb-2 ml-1 text-${STATUS_ICON_MAP.VERIFIED.color}`}/></h6>
                                
                            </Col>
                        </Row>
                    </Col>
                    
                </Row>
            </Col>
        );

    }

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
                {renderDashboardOverview()}
                <Col xs={12} className='p-4 border border-secondary'>
                    <Row>
                        <Col xs={12} className='mb-4'><h2>ANALYSES</h2></Col>
                        {ANALYSES}    
                    </Row>
                </Col>
            </Row>
        </Page>
    );
}

export {DashboardPage};