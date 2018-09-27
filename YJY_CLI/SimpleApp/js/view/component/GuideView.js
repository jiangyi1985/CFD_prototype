import React, { Component } from 'react';
import PropTypes from "prop-types";
import { View, StyleSheet, 
    Dimensions, 
    Modal,
    TouchableOpacity,
    Text,
    Image,
} from 'react-native';
 
const {height, width} = Dimensions.get("window");
var Swiper = require('react-native-swiper')
var ColorConstants = require('../../ColorConstants');

import Carousel from 'react-native-looped-carousel';//https://github.com/phil-r/react-native-looped-carousel
 

class GuideView extends Component {

    static propTypes = {
         
    };

    static defaultProps = {
         callback:()=>{}
    }

    constructor(props){
        super(props)
    }   

    closeGuide(){
        this.props.callback&&this.props.callback()
    }
 
    render() { 
        imageStyle = {width:width,height:890/750*width}
        return (  
            <View style={styles.guideWapper}>
                <Carousel
                    delay={2000}
                    style={{width:width,height:height}}
                    autoplay={false}
                    pageInfo={false}
                    bullets={true} 
                    bulletStyle={{backgroundColor:'black'}}
                    chosenBulletStyle={{backgroundColor:'white'}}
                    bulletsContainerStyle={{marginBottom:20}}
                    isLooped={false} 
                    onAnimateNextPage={(p) => console.log(p)}
                >
                            <View style={styles.slide}>  
                            <Image  
                                    style={imageStyle} 
                                    source={require('./../../../images/Guide-page01.png')}/>
                            </View>
                            <View style={styles.slide}> 
                                <Image 
                                    style={imageStyle} 
                                    source={require('./../../../images/Guide-page02.png')}/>
                            </View>
                            <View style={styles.slide}> 
                                <Image 
                                    style={imageStyle} 
                                    source={require('./../../../images/Guide-page03.png')}/>
                            </View>
                            <View style={styles.slide}> 
                                <Image 
                                    style={imageStyle} 
                                    source={require('./../../../images/Guide-page04.png')}/>
                                    <TouchableOpacity style={styles.enterArea} onPress={()=>{this.closeGuide()}}>
                                        <Text style={{color:'yellow'}}>进入</Text>
                                    </TouchableOpacity>   
                            </View>
                </Carousel>
    
            </View>
            
            // <View style={styles.guideWapper}> 
            //       <Swiper style={styles.wrapper}  
            //               loop={false} 
            //                >
            //             <View style={styles.slide}>  
            //                 <Image  
            //                     style={imageStyle} 
            //                     source={require('./../../../images/Guide-page01.png')}/>
            //             </View>
            //             <View style={styles.slide}> 
            //                 <Image 
            //                     style={imageStyle} 
            //                     source={require('./../../../images/Guide-page02.png')}/>
            //             </View>
            //             <View style={styles.slide}> 
            //                 <Image 
            //                     style={imageStyle} 
            //                     source={require('./../../../images/Guide-page03.png')}/>
            //             </View>
            //             <View style={styles.slide}> 
            //                   <Image 
            //                     style={imageStyle} 
            //                     source={require('./../../../images/Guide-page04.png')}/>
            //                     {/* <TouchableOpacity style={styles.enterArea} onPress={()=>{this.closeGuide()}}>
            //                         <Text style={{color:'yellow'}}>进入</Text>
            //                     </TouchableOpacity>    */}
            //             </View>
            //       </Swiper>  
            // </View>
        );

        
    }
}   
 
const styles = StyleSheet.create({ 
    guideWapper:{ 
        height: height, 
        width: width,
        backgroundColor:ColorConstants.BORDER_LIGHT_BLUE,
        justifyContent:'center',
        alignItems:'center' 
    },
    wrapper: {  
        backgroundColor:'yellow',
        height:height,
        width:width
    },
    slide: { 
          flex:1, 
          justifyContent:'center', 
    },
    enterArea:{
        position:'absolute',
        top:height-100, 
        left:width/2-15, 
    }, 
});
 
export default GuideView;