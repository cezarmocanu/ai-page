import { StyleSheet, Dimensions } from 'react-native';

const { width: winWidth, height: winHeight } = Dimensions.get('window');

export default StyleSheet.create({
    preview: {
        height: winHeight,
        width: winWidth,
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex:0
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
        display: 'flex'
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
        backgroundColor: '#fff',
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    buttonText:{
        fontSize: 24
    }
});