import { StyleSheet, Dimensions } from 'react-native';

const { width: winWidth, height: winHeight } = Dimensions.get('window');

export default StyleSheet.create({
    preview: {
        flex:1
    },
    container:{
        height: winHeight,
        width: winWidth
    },
    overlay:{
        position:'absolute',
        width: '100%',
        height:'100%',
        zIndex:1000,
        top:0,
        left:0,
        display: 'flex',
        backgroundColor: 'rgba(255,255,255,0.1)'
    },
    displayImage:{
        width: '100%',
        height:'100%',
        zIndex:1000,
        top:0,
        left:0
    },
    button:{
        position: 'absolute',
        zIndex:1000,
        width:'100%',
        height:100,
        bottom:0,
        backgroundColor: 'rgba(255,255,255,0.4)',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    buttonText:{
        fontSize: 24
    },
    goBack:{
        position:'absolute',
        backgroundColor: 'rgba(255,255,255,0.4)',
        display:'flex',
        justifyContent:'center',
        paddingTop:100,
        zIndex:1000,
        width:'100%',
        height:100,
        top:0,
        display:'flex'
    },
    previewButtonLeft:{
        position:'absolute',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        left:0,
        width:'50%',
        height:100,
        backgroundColor: 'rgba(255,0,0,0.4)',
    },
    previewButtonRight:{
        position:'absolute',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        right:0,
        width:'50%',
        height:100,
        backgroundColor: 'rgba(0,255,0,0.4)',
    },
    link:{
        position:'absolute',
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center'
    }

});