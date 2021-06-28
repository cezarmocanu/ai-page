import React, {useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { View, Text, TouchableOpacity, Image, Dimensions} from 'react-native';
import {Link,Route, useParams, useHistory} from 'react-router-native';
import { Camera } from 'expo-camera';
import {ENDPOINTS} from './Endpoints.js';
import {CollectedImagesContext} from './Contexts';
import styles from './styles';


const JPEG_PREFIX = 'data:image/jpeg;base64,'

function CameraPage() {
    const [camera, setCamera] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [imageUri, setImageUri] = useState(null);
    const [cameraRatios, setCameraRatios] = useState([]);
    const [ratio, setRatio] = useState('4:3');
    const [encodedData, setEncodedData] = useState('');

    const {formId, pageOrderNumber} = useParams();

    const {collected, setCollected} = useContext(CollectedImagesContext);
    const history  = useHistory();
    useEffect(()=>{
        const getPermissions = async () => {
            try {
                
                const {status} = await Camera.requestPermissionsAsync();
                const cameraPermission = (status === 'granted');
        
                setHasCameraPermission(cameraPermission);
            }
            catch(e){
                console.log(e);
            }
        };
        getPermissions();
    },[]);

    const getRatios = async () => {
        const ratios = await camera.getSupportedRatiosAsync();
        setCameraRatios(ratios);
    }

    useEffect(()=>{
        if (camera === null) {
            return;
        }
        getRatios();
    },[camera]);

    useEffect(()=>{
        const { height, width } = Dimensions.get('window');
        const screenRatio = height / width;
        const sizes = cameraRatios
                    .map(ratio => ratio.split(':').map(s => parseInt(s)))
                    .filter(s => screenRatio -  s[0] / s[1] > 0);
        
        const bestSize = sizes.reduce((min,s) => {
            const aspect = screenRatio - s[0] / s[1];
            return aspect < min ? aspect : min;
        }, sizes[0]);

        if (bestSize) {
            const r = bestSize.join(':');
            setRatio(r);
        }

    },[cameraRatios])


   

    if (hasCameraPermission === null) {
        return <View />;
    } else if (hasCameraPermission === false) {
        return <Text>Access to camera has been denied.</Text>;
    }


    const takePicture = async () => {
        const {uri, base64} = await camera.takePictureAsync({quality:0.5,base64: true});
        setEncodedData(base64);
        setImageUri(uri);
    };

    const sendImage = () => {
        // const blob = b64toBlob(encodedData);
        const imageCollectedIndex = collected.findIndex(image => parseInt(image.pageOrderNumber) === parseInt(pageOrderNumber));

        if (imageCollectedIndex === -1) {
            setCollected([...collected, { pageOrderNumber, data: encodedData }]);
        }
        else {
            const pre = collected.slice(0, imageCollectedIndex);
            const post = collected.slice(imageCollectedIndex + 1);
            setCollected([...pre, { pageOrderNumber, data: encodedData }, ...post]);
        }
        setImageUri(null);
        setEncodedData(null);
        history.push(`/form/${formId}`)
        
    }

    const dismissImage = () => {
        setImageUri(null);
    }
      
    return (
        <View style={styles.container}>
            {imageUri === null ?
            (
                <React.Fragment>
                    <Camera
                        style={styles.preview}
                        ref={camera => setCamera(camera)}
                        onCameraReady={getRatios}
                        ratio={ratio}
                    />
                    <View style={styles.overlay}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={takePicture}
                        >
                            <Text style={styles.buttonText}>Take photo</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.goBack}>
                    
                        <TouchableOpacity style={styles.button} onPress={dismissImage}>
                            <Link style={styles.link} to={`/form/${formId}`}> 
                                <Text style={styles.buttonText}>Go back</Text>
                            </Link>
                        </TouchableOpacity>
                        
                    </View>
                    
                </React.Fragment>
            ):
            <View>
                <Image
                    style={styles.displayImage}
                    source={{
                    uri: imageUri
                    }}
                />
                <View style={styles.goBack}>
                    <TouchableOpacity style={styles.previewButtonLeft} onPress={dismissImage}>
                            <Text style={styles.buttonText}>Go back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.previewButtonRight} onPress={sendImage}>
                            <Text style={styles.buttonText}>Finish</Text>
                    </TouchableOpacity>
                </View>
            </View>
            }
        </View>
    );

};

export {CameraPage};