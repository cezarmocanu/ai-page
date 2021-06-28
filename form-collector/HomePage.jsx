import React,{useEffect, useState} from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import {Link, useHistory} from 'react-router-native';
import {ENDPOINTS} from './Endpoints.js';
import Icon from 'react-native-vector-icons/Feather';

  
  function HomePage(){
    const [forms, setForms] = useState([]);
    const history = useHistory();

    const fetchData = async () => {
      try {
        
        const {data} = await axios.get(ENDPOINTS.FORMS);
        
        setForms(data);
      }
      catch(e){
        setForms([]);
      }
      
    }
  
    useEffect(()=>{
      fetchData();
    },[]);
  
    const navigateToDetails = (id) => () => {
      history.push(`/form/${id}`);
    };

    const renderForm = (form) => {
      const {id, title} = form;
      return (
        <View style={HomeStyles.analysis} key={id}>
            
            <View style={HomeStyles.analysisHeader}>
                <Text style={HomeStyles.analysisHeaderText}>
                {title}
                </Text>
                <Icon name="check-circle" size={30} color="#3EAD68" />
            </View>
            <View style={HomeStyles.analysisLabel}>
                <Text style={HomeStyles.analysisLabelText}>
                VERIFIED
                </Text>
            </View>
            <View style={HomeStyles.actionSection}>
                
                <TouchableOpacity onPress={navigateToDetails(id)} style={HomeStyles.button}>
                
                  {/* <Link style={HomeStyles.linkStyle} to={`/form/${id}`}> */}
                  <Text style={HomeStyles.buttonText}>
                      COLLECT IMAGES
                  </Text>
                  
                </TouchableOpacity>
                
            </View>
          
        </View>);
    }
  
    return (
      <View style={HomeStyles.container}>
        <Text style={HomeStyles.title}>AI-PAGE</Text>
        <ScrollView style={HomeStyles.scroll}>
            {forms.map(form => renderForm(form))}
        </ScrollView>
      </View>
    )
  }
  

  const HomeStyles = StyleSheet.create({
    scroll:{
        padding:20,
        flex:1
        
    }, 
    container:{
      padding:0,
      backgroundColor:'#ffffff',
      borderRadius: 10,
      width:'100%',
      height:'100%',
      display:'flex',
      flexDirection:'column',
      justifyContent:'flex-start',
      alignItems:'center'
    },
    analysis:{
      width:'80%',
      height:250,
      borderWidth:2,
      borderColor:'#eaeaea',
      marginBottom:20,
      borderRadius: 10,
      display:'flex',
      flexDirection:'column',
      justifyContent:'flex-start',
      padding:10,
      marginBottom:50
    },
    analysisLabel:{
      backgroundColor:'#3EAD68',
      width: 120,
      borderRadius:10,
      padding:10,
      display:'flex',
      justifyContent:'center',
      flexDirection:'row'
    },
    analysisLabelText:{
      fontSize:20,
      color:'#fff'
    },
    analysisHeader:{
      display:'flex',
      flexDirection:'row',
      justifyContent:'space-between',
      width:'100%',
      padding:10
    },
    analysisHeaderText:{
      fontSize:26
    },
    title:{
      fontSize:30,
      marginBottom: 30
    },
    actionSection:{
  
    },
    button:{
      display:'flex',
      justifyContent:'flex-start',
      flexDirection:'row',
      paddingTop:45
      
    },
    buttonText:{
        fontSize:30,
        padding:5,
        color:'#000',
        borderWidth:2,
        borderColor:'#0060af',
        color:'#0060af',
        borderRadius:10
    },
    linkStyle:{
      
      display:'flex',
      
    }
  });

  export {HomePage};