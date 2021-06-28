import React,{useEffect, useState, useContext} from 'react';
import axios from 'axios';
import { StyleSheet, Text, View,ScrollView, TouchableOpacity,ActivityIndicator, Image} from 'react-native';
import {Link, useHistory, useParams} from 'react-router-native';
import {ENDPOINTS} from './Endpoints.js';
import {Buffer} from 'buffer';
import Icon from 'react-native-vector-icons/Feather';
import {CollectedImagesContext} from './Contexts';

/*
<Image
    style={styles.displayImage}
    source={{
    uri: imageUri
    }}
/>
*/
function FormDetailsPage(){

    const {collected, setCollected} = useContext(CollectedImagesContext);
    const [pages , setPages] = useState([]);
    const [images, setImages] = useState([]);
    const history = useHistory();

    const {id: formId} = useParams();

    const fetchData = async () => {
        const {data} = await axios.get(ENDPOINTS.FORM_PAGES(formId))
        setPages(data.pages);
    };


    const fetchImage = async () => {
        const defaultImages = [];
        for(const page of pages) {
            try{
                const {data} = await axios.get(ENDPOINTS.PAGE_IMAGE(formId, page.order_number,20), { responseType: 'arraybuffer'});
                const url = 'data:image/jpeg;base64,' + Buffer.from(data, 'binary').toString('base64');
                defaultImages.push(url);
            }
            catch(e){
                throw Error(e);
            }
        }

        defaultImages.sort((a,b) => a.order_number - b.order_number);
        setImages([...defaultImages]);
    };

    useEffect(() => {
        fetchImage()
        
    },[pages])

    useEffect(()=>{
        fetchData()
    },[]);

    const getImage = (orderNumber) => {
        const collectedImage = collected.find(image => parseInt(image.pageOrderNumber) === parseInt(orderNumber));
        return (collectedImage && `data:image/jpeg;base64,${collectedImage.data}`) || images[orderNumber] || undefined;
    };

    const clearAndGoBack = () => {
        history.push('/');
        setCollected([]);
    };

    const postFormData = async () => {
        const formData = new FormData();
        
        collected.forEach(image => {
            formData.append(image.pageOrderNumber, image.data);
        });
        
        await axios.post(ENDPOINTS.COLLECTOR(formId), formData, {
            headers:{
                'Content-Type': 'multipart/form-data'
            }
        });
    };

    const handleSendImages = () => {
        postFormData();
        setCollected([]);
        history.push('/')
    }

    const navigateToCamera = (order_number) => () => {
        history.push(`/form/${formId}/camera/${order_number}`);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={clearAndGoBack}>
                    <Text  style={styles.button}>Go back</Text>
                </TouchableOpacity>
                {pages.length !== collected.length ?  
                <Text style={styles.alert}>Select a page to photograph</Text>:
                <TouchableOpacity onPress={handleSendImages}>
                    <Text  style={styles.buttonSuccess}>Send Images</Text>
                </TouchableOpacity>
                }
            </View>
            <ScrollView style={styles.scroll} >
                    {pages.map(page =>(
                        <TouchableOpacity key={page.id} onPress={navigateToCamera(page.order_number)}>
                            <View  style={styles.cardBox}>
                                <View style={styles.imageBox}>
                                    {
                                    getImage(page.order_number) ?
                                    <Image
                                        style={styles.image}
                                        source={{
                                            uri: getImage(page.order_number)
                                        }}
                                    />:
                                    <ActivityIndicator size='large'/>
                                    }
                                </View>
                                <View style={styles.numberBox}>
                                    <Text>{`${page.order_number + 1} / ${pages.length}`}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        
        flex:1
    },
    header:{
        backgroundColor:'white',
        width:'100%',
        padding:20
    },
    button:{
        fontSize:30,
        padding:5,
        color:'#000',
        borderWidth:2,
        borderColor:'#0060af',
        color:'#0060af',
        borderRadius:10,
        textAlign:'center',
        backgroundColor:'white'
    },
    buttonSuccess:{
        marginTop:10,
        fontSize:30,
        padding:5,
        color:'#000',
        borderWidth:2,
        borderColor:'#3EAD68',
        color:'#3EAD68',
        borderRadius:10,
        textAlign:'center',
        backgroundColor:'white'
    },
    alert:{
        marginTop:10,
        padding:10,
        backgroundColor: '#29b0ff80',
        color:'white',
        fontSize:20,
        borderRadius:10,
        textAlign:'center'
    },
    scroll:{
        flex:1,
        paddingTop:20,
        padding:10,
        backgroundColor:'white'
    },
    cardBox:{
        backgroundColor:'white',
        width:'100%',
        height: 450,
        marginBottom: 30,
        borderRadius: 10,
        padding:10,
        display:'flex',
        justifyContent:'center',
        borderWidth:2,
        borderColor:'#eaeaea',
    },
    imageBox:{
        height:'90%',
        width:'100%',
        
    },
    image:{
        height:'100%',
        width:'auto'
    },
    numberBox:{
        height:'10%',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    
})

export {FormDetailsPage};