import React,{useState, useEffect, useMemo} from 'react'; 
import {Row, Col, Alert, ButtonGroup, Card, Button, Badge, ProgressBar, Dropdown} from 'react-bootstrap';
import {Link, useParams} from "react-router-dom";
import {SiProbot} from 'react-icons/si';
import {GoLightBulb} from 'react-icons/go';
import {FiCheckCircle} from 'react-icons/fi';
import {ImSpinner4} from 'react-icons/im';
import {AiOutlineFileImage, AiFillDelete, AiFillCaretRight,AiFillCaretLeft} from 'react-icons/ai';

import {Page} from '../../components/page/Page';
import {Histogram} from '../../components/histogram/Histogram';

import {get, remove, ENDPOINTS, REFRESH_INTERVAL,COLORS} from '../../constants';
import './CollectionDashboard.scss';


function CollectionDashboard() {
    const [collections, setCollections] = useState([]);
    const [topics, setTopics] = useState([]);
    const {formId} = useParams();
    const [selectedTopic, setSelectedTopic] = useState({});
    const [histogramData, setHistogramData] = useState([]);
    const [histogramColors , setHistogramColors] = useState([]);
    
    const fetchData = async () => {
        const results = await get(ENDPOINTS.COLLECTOR,{formId});
        setCollections(results.data);
    };

    const fetchFormData = async () => {
        const {data} = await get(ENDPOINTS.ANALYSIS_ONE,{formId});
        const {pages} = data;

        const fetchedTopics = [].concat(...pages.map(page => page.topics))
        setTopics([...fetchedTopics])
        setSelectedTopic(fetchedTopics[0])
    }

    const fetchTopicStatistics = async () => {
        const {data} = await get(ENDPOINTS.COLLECTOR_TOPIC_STATISTICS,{formId, topicId: selectedTopic.id});
        setHistogramData(data);
    }

    // const handleOnDelete = (id) => (e) => {
    //     const formIndex = collections.findIndex(analysis => analysis.id === id);
    //     const pre = collections.slice(0,formIndex);
    //     const post = collections.slice(formIndex + 1);
    //     setCollections([...pre,...post]);
    //     remove({endpoint:ENDPOINTS.ANALYSIS_ONE,params:{formId:id}});
    // };

    useEffect(()=>{
        const interval = setInterval(fetchData, REFRESH_INTERVAL);
        fetchData();
        fetchFormData();
        return () => {
            clearInterval(interval);
        }
    }, [])

    //TODO create component for this
    const renderCollectionCard = (collection) => {
        const {id} = collection;

        // const renderAction = () => {
        //     if(status === 'NEW') {
        //         return (
        //             <div>
        //                 <span>{`Analizing... (${analisedPages} / ${numberOfImages})`}</span>
        //                 <ProgressBar animated variant="success" min={0} max={numberOfImages} now={analisedPages} />
        //             </div>
                    
        //         )
        //     }
        //     if(status === 'ANALYSED') {
        //         return (
        //             <Link to={`/verification/${id}`}>
        //                 <Button variant='outline-primary'>{label}</Button>
        //             </Link>)
        //     }

        //     return (
        //         <Link to={`/verification/${id}`}>
        //             <Button variant='outline-primary'>EDIT</Button>
        //         </Link>
        //     );
        // }

        // const StatusIcon = STATUS_ICON_MAP[status].Component;
        // const iconColor = STATUS_ICON_MAP[status].color;
        return (
            <Col xs={2} className='flex mb-4'>
                <Card className='analysis-card'>
                    <div className="delete-button" onClick={()=>{}}><AiFillDelete/></div>
                    <Card.Body>
                        <Card.Title>
                            <AiFillCaretRight/> 
                            Collection {id}
                        </Card.Title>
                        {/* <Card.Text>
                            <h6 variant={color}>
                                {`${numberOfImages} ${numberOfImages === 1 ? 'page' : 'pages'}`}
                            </h6>
                            <Badge variant={color}>
                                {status}
                            </Badge>
                        </Card.Text>
                        {renderAction()} */}
                    </Card.Body>
                </Card>
            </Col>
        )
    }

    const COLLECTIONS = useMemo(() => {
        return collections.map(collection => renderCollectionCard(collection))
    }, [collections])

    // const renderDashboardOverview = () => {
    //     //TODO De calculat countul in backend si de facut fetch pt date
    //     // const {id, title, status} = analysis;
    //     // STATUS_ICON_MAP

    //     const counts = {
    //         images: 0,
    //         pages: 0,
    //         newForms: 0,
    //         analysedForms: 0,
    //         verifiedForms: 0 
    //     };

    //     collections.forEach(analysis => {
    //         const {status, images, pages} = analysis;
    //         counts.images += images;
    //         counts.pages += pages;
    //         counts[status.toLowerCase()+'Forms'] += 1;
    //     });

    //     const {images, pages, newForms, analysedForms, verifiedForms} = counts;

    //     return (
    //         <Col xs={12} className='mb-4 p-4 border border-white bg-white text-dark'>
    //             <Row>
    //                 <Col xs={12} className='mb-4'>
    //                     <h2>OVERVIEW</h2>
    //                 </Col>
    //                 <Col xs={4}>
    //                     <Row>
    //                         <Col xs={12} className='mb-4'>
    //                             <h5>PAGES & IMAGES</h5>
    //                         </Col>
    //                         <Col xs={12} className='mb-4'>
    //                             <ProgressBar>
    //                                 <ProgressBar max={images} variant="primary" now={images} key={1} />
    //                                 <ProgressBar max={images-pages} variant="warning" now={pages} key={2} />
    //                             </ProgressBar>
    //                         </Col>
    //                         <Col xs={6}>
    //                             <h6>Total images: {images} <ImSpinner4 className='mb-2 ml-1'/> </h6>
    //                         </Col>
    //                         <Col xs={6}>
    //                             <h6>Analysed pages: {pages} <AiOutlineFileImage className='mb-1 ml-1'/> </h6>
    //                         </Col>
    //                     </Row>
    //                 </Col>
    //                 <Col xs={{span:6, offset:2}}>
    //                     <Row>
    //                         <Col xs={12} className='mb-2'><h5>FORMS</h5></Col>
    //                         <Col xs={12} className='mb-4'>
    //                             <ProgressBar>
    //                                 <ProgressBar max={newForms+analysedForms+verifiedForms} variant="info" now={newForms} key={4} />
    //                                 <ProgressBar max={newForms+analysedForms+verifiedForms} variant="warning" now={analysedForms} key={5} />
    //                                 <ProgressBar max={newForms+analysedForms+verifiedForms} variant="success" now={verifiedForms} key={6} />
    //                             </ProgressBar>
    //                         </Col>
    //                         <Col xs={4}>
    //                             <h6>NEW: {newForms} <STATUS_ICON_MAP.NEW.Component className={`mb-2 ml-1 text-${STATUS_ICON_MAP.NEW.color}`}/></h6>
                                
    //                         </Col>
    //                         <Col xs={4}>
    //                             <h6>ANALYSED: {analysedForms} <STATUS_ICON_MAP.ANALYSED.Component className={`mb-2 ml-1 text-${STATUS_ICON_MAP.ANALYSED.color}`}/></h6>
    //                         </Col>
    //                         <Col xs={4}>
    //                             <h6>VERIFIED: {verifiedForms} <STATUS_ICON_MAP.VERIFIED.Component className={`mb-2 ml-1 text-${STATUS_ICON_MAP.VERIFIED.color}`}/></h6>
                                
    //                         </Col>
    //                     </Row>
    //                 </Col>
                    
    //             </Row>
    //         </Col>
    //     );

    // }
    useEffect(() => {
        fetchTopicStatistics();
    }, [selectedTopic])

    const getHistogramColors = () => {
        let colors = [...COLORS.CATEGORIES];
        return Object.values(histogramData).map(d => {
            const index = parseInt(Math.random() * colors.length);
            return colors.splice(index,1)[0];
        });
    }

    useEffect(()=>{
        setHistogramColors(getHistogramColors());
    },[histogramData]);

    const handleSelectTopic = (topic) => () => {
        setSelectedTopic(topic);    
    };

    

    

    const renderTopicOverview = () => {
        return(
            <Col xs={12} className='p-4 border border-white bg-white text-dark analyses-table'>
                <Row>
                    <Col xs={12} className='mb-4'>
                        <h2>TOPICS OVERVIEW</h2>
                    </Col>
                    <Col xs={12} className='mb-4'>
                    <Dropdown>
                        <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
                            {selectedTopic.title || 'Choose a topic'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu className='topics-dropdown'>
                            {topics.length <= 0 ? 'No topics' : topics.map((topic) => (
                            <Dropdown.Item onClick={handleSelectTopic(topic)}>
                                {topic.title}
                            </Dropdown.Item>
                        ))}    
                        </Dropdown.Menu>
                    </Dropdown>
                    </Col>

                    <Col xs={6}>
                        <Histogram data={Object.values(histogramData)} colors={histogramColors}/>
                    </Col>
                    <Col xs={6}>
                        <Row className='p-0 m-0'>
                            {
                                selectedTopic.options &&
                                selectedTopic.options.map((opt,index) => (
                                    <Col xs={6}>
                                        <p>
                                            {/* <AiFillCaretRight /> */}
                                            <Badge
                                                style={{
                                                    color:'white',
                                                    backgroundColor:histogramColors[index],
                                                    marginRight:'1rem'
                                                }}
                                            >{histogramData[opt.id.toString()]}</Badge>
                                            
                                            {/* <AiFillCaretLeft style={{color:histogramColors[index]}}/> */}
                                            {opt.label}
                                            
                                        </p>
                                    </Col>
                                ))
                            }
                        </Row>
                        
                    </Col>
                                        
                </Row>
            </Col>
        );
    };

    
    return (
        <Page>
            <Row className='bg-primary flex-vertical-center p-4'>
                <Col xs={12} style={{display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                    <Link to="/">
                        <Button variant='primary' className='border-white'>Go Back</Button>
                    </Link>
                    <div style={{display:'flex',justifyContent:'space-between', alignItems:'center'}}>
                        <h5 className='mr-2 ml-5 text-white'>Export as</h5>
                        <a download target="_blank" href={`http://localhost:5000/collector/${formId}/json`}>
                            <Button variant='primary' className='border-white'>JSON</Button>
                        </a>
                    </div>

                    
                    
                </Col>
            </Row>
            <Row className='fluid-w p-4 pb-5 bg-light m-0'>
                {/* {renderDashboardOverview()} */}
                {renderTopicOverview()}
                <Col xs={12} className='mt-5 p-4 border border-white bg-white text-dark analyses-table'>
                    <Row>
                        <Col xs={12} className='mb-4'><h2>COLLECTED DATA</h2></Col>
                        {COLLECTIONS}    
                    </Row>
                </Col>
            </Row>
        </Page>
    );
}

export {CollectionDashboard};