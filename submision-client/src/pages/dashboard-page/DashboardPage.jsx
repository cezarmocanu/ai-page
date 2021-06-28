import React,{useState, useEffect, useMemo} from 'react'; 
import {Row, Col, Alert, Card, Button, Badge, ProgressBar} from 'react-bootstrap';
import {Link} from "react-router-dom";
import {SiProbot} from 'react-icons/si';
import {GoLightBulb} from 'react-icons/go';
import {FiCheckCircle} from 'react-icons/fi';
import {ImSpinner4} from 'react-icons/im';
import {AiOutlineFileImage, AiFillDelete} from 'react-icons/ai';

import {Page} from '../../components/page/Page';

import {get, remove, ENDPOINTS, REFRESH_INTERVAL} from '../../constants';
import './DashboardPage.scss';

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
    const [activeFilter, setActiveFilter] = useState('');

    const fetchData = async () => {
        const results = await get(ENDPOINTS.ANALYSIS_ALL);
        setAnalysis(results.data);
    }

    const handleOnDelete = (id) => (e) => {
        
        const formIndex = analyses.findIndex(analysis => analysis.id === id);
        const pre = analyses.slice(0,formIndex);
        const post = analyses.slice(formIndex + 1);
        setAnalysis([...pre,...post]);
        remove({endpoint:ENDPOINTS.ANALYSIS_ONE,params:{formId:id}});
    };

    useEffect(()=>{
        const interval = setInterval(fetchData, REFRESH_INTERVAL);
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

            return (
                <div>
                    <Link to={`/verification/${id}`}>
                        <Button variant='outline-warning'>EDIT</Button>
                    </Link>
                    <Link className='ml-2' to={`/collection/${id}`}>
                        <Button variant='outline-primary'>DATA</Button>
                    </Link>
                </div>
                
            );
        }

        const StatusIcon = STATUS_ICON_MAP[status].Component;
        const iconColor = STATUS_ICON_MAP[status].color;
        return (
            <Col xs={2} className='flex mb-4'>
                <Card className='analysis-card'>
                    <div className="delete-button" onClick={handleOnDelete(id)}><AiFillDelete/></div>
                    <Card.Body>
                        <Card.Title>{title} <StatusIcon className={`ml-2 mb-2 text-${iconColor}`}/></Card.Title>
                        <Card.Text>
                            <h6 variant={color}>
                                {`${numberOfImages} ${numberOfImages === 1 ? 'page' : 'pages'}`}
                            </h6>
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
            <Col xs={12} className='mb-4 p-4 border border-white bg-white text-dark'>
                <Row>
                    <Col xs={12} className='mb-4'>
                        <h2>OVERVIEW</h2>
                    </Col>
                    <Col xs={4}>
                        <Row>
                            <Col xs={12} className='mb-4'>
                                <h5>PAGES & IMAGES</h5>
                            </Col>
                            <Col xs={12} className='mb-4'>
                                <ProgressBar>
                                    <ProgressBar max={images} variant="primary" now={images} key={1} />
                                    <ProgressBar max={images-pages} variant="warning" now={pages} key={2} />
                                </ProgressBar>
                            </Col>
                            <Col xs={6}>
                                <h6>Total images: {images} <ImSpinner4 className='mb-2 ml-1'/> </h6>
                            </Col>
                            <Col xs={6}>
                                <h6>Analysed pages: {pages} <AiOutlineFileImage className='mb-1 ml-1'/> </h6>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={{span:6, offset:2}}>
                        <Row>
                            <Col xs={12} className='mb-2'><h5>FORMS</h5></Col>
                            <Col xs={12} className='mb-4'>
                                <ProgressBar>
                                    <ProgressBar max={newForms+analysedForms+verifiedForms} variant="info" now={newForms} key={4} />
                                    <ProgressBar max={newForms+analysedForms+verifiedForms} variant="warning" now={analysedForms} key={5} />
                                    <ProgressBar max={newForms+analysedForms+verifiedForms} variant="success" now={verifiedForms} key={6} />
                                </ProgressBar>
                            </Col>
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
            <Row className='bg-primary flex-vertical-center p-4'>
                <Col>
                    <Link to="/submit">
                        <Button variant='primary' className='border-white'>Submit New Form</Button>
                    </Link>
                </Col>
            </Row>
            <Row className='fluid-w p-4 pb-5 bg-light m-0'>
                {renderDashboardOverview()}
                <Col xs={12} className='p-4 border border-white bg-white text-dark analyses-table'>
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