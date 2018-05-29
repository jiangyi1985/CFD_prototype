//import liraries
import React, {
    Component,
} from 'react';
import PropTypes from "prop-types";
import { View, Text, StyleSheet,
    TouchableOpacity,
    ImageBackground,
    Image,
    Dimensions
} from 'react-native';
var LS = require("../../LS");
var {height, width} = Dimensions.get("window");

// create a component
class SubmitButton extends Component {
    static propTypes = {
        onPress: PropTypes.func,
        enable: PropTypes.bool,
        enableImage: Image.propTypes.source,
        disableImage: Image.propTypes.source,
        text: PropTypes.string
    }

    static defaultProps = {
        onPress: ()=>{},
        enable: true,
        enableImage: require("../../../images/position_confirm_button_enabled.png"),
        disableImage: require("../../../images/position_confirm_button_disabled.png"),
        text: LS.str("FINISH")
    }

    constructor(props){
        super(props)

        this.state = this.props
    }

    componentWillReceiveProps(props){
        var newProps = {}
        if(props.enable != undefined){
            newProps.enable = props.enable
        }
        this.setState(newProps);
    }
    onButtonPressed(){
        if(this.state.enable){
            this.props.onPress && this.props.onPress();
        }
    }

    render() {
        var buttonImage = this.state.enable ? this.state.enableImage : this.state.disableImage
        
        return (
            <TouchableOpacity
                onPress={()=>this.onButtonPressed()}
                style={styles.backgroundImageStyle}>
                <ImageBackground source={buttonImage}
                    resizeMode={"stretch"}
                    style={styles.okView}>
                    <Text style={styles.okButton}>
                        {this.props.text}
                    </Text>
                </ImageBackground>
            </TouchableOpacity>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    okView: {
		width: 332,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    okButton: {
		color: 'white',
		textAlign: 'center',
        fontSize: 17,
        position:'absolute',
        top:14
    },
    backgroundImageStyle: {
        alignSelf:'center',
        width: 332, height: 60, alignItems:'center', justifyContent:"center"
    }
});

//make this component available to the app
export default SubmitButton;