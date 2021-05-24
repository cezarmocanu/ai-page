import React, {useState, useEffect} from 'react';
import axios from 'axios';
import b64toBlob from 'b64-to-blob';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';

import styles from './styles';

const COLLECTOR_ROUTE = 'http://192.168.1.104:5000/collector/';
const JPEG_PREFIX = 'data:image/jpeg;base64,'

function CameraPage() {
    const [camera, setCamera] = useState(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [imageUri, setImageUri] = useState(null);


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


    const takePicture = async () => {
        const {uri, base64} = await camera.takePictureAsync({quality:0.5,base64: true});
        // const blob = b64toBlob(base64);
        const formData = new FormData();
        formData.append('image', base64);
        
        await axios.post(COLLECTOR_ROUTE, formData, {
            headers:{
                'Content-Type': 'multipart/form-data'
            }
        });
        
        setImageUri(uri);
    };

    const dismissImage = () => {
        setImageUri(null);
    }

    if (hasCameraPermission === null) {
        return <View />;
    } else if (hasCameraPermission === false) {
        return <Text>Access to camera has been denied.</Text>;
    }

    return (
        <View style={styles.container}>
            {imageUri === null ?
            (
                <React.Fragment>
                    <Camera
                        style={styles.preview}
                        ref={camera => setCamera(camera)}
                    />
                    <View style={styles.overlay}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={takePicture}
                        >
                            <Text style={styles.buttonText}>Take photo Razvan</Text>
                        </TouchableOpacity>
                    </View>
                </React.Fragment>
            ):
            <TouchableOpacity
                onPress={dismissImage}
            >
                <Image
                    style={styles.displayImage}
                    source={{
                    uri: imageUri
                    }}
                />
            </TouchableOpacity>
            }
        </View>
    );

};

export {CameraPage};