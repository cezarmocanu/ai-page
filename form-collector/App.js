import React,{useState} from 'react';
import {CameraPage} from './CameraPage';
import { StyleSheet, View,Dimensions } from 'react-native';
import {NativeRouter,Route} from 'react-router-native';
import {HomePage} from './HomePage';
import {FormDetailsPage} from './FormDetailsPage';
import { CollectedImagesContext } from './Contexts';
console.disableYellowBox = true;

export default function App() {

  const [collected, setCollected] = useState([]);


  return (
      <NativeRouter>
        <CollectedImagesContext.Provider value={{collected, setCollected}}>
          <View style={styles.container}>
              <Route exact path="/" component={HomePage} />
              <Route path="/form/:id" component={FormDetailsPage} />
              <Route path="/form/:formId/camera/:pageOrderNumber" component={CameraPage} />      
          </View>
        </CollectedImagesContext.Provider>
      </NativeRouter>
  );
  
  
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height:Dimensions.get('window').height,
    flex:1,
    
    paddingTop:50,
    backgroundColor:'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


