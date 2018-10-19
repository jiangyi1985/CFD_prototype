'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	ScrollView,
	Dimensions,
	Image,
	TextInput,
	Platform,
	TouchableOpacity,
	Text
} from 'react-native';
import CustomStyleText from './component/CustomStyleText'
import LogicData from '../LogicData';
import NavBar from "./component/NavBar";

import { setRegisterCode} from '../redux/actions'
import { connect } from 'react-redux';
// var LocalDataUpdateModule = require('../module/LocalDataUpdateModule')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var UIConstants = require('../UIConstants');
var ColorConstants = require('../ColorConstants');
var LS = require("../LS")

var {height, width} = Dimensions.get('window');
class ErrorMsg extends Component{
	constructor(prop){
		super(prop);
	}

	render(){
		if(this.props.showView){
			return (
				<View style={styles.errorMsg}>
						<Image source={require('../../images/error_dot.png')} style={[styles.errorDot]}/>
						<CustomStyleText style={styles.errorText}>{this.props.showText}</CustomStyleText>
				</View>
			);
		}else {
			return(
				<View></View>
			);
		}
	}

}

// create a component
class MeSettingBaiShiScreen extends Component {

	constructor(props){
		super(props);

		console.log("this.props.registerCode", this.props.registerCode)

		this.state = {
			isShowError:false,
			errorText: LS.str("ERROR_HINT"),
			registerCode:this.props.registerCode,
		}

		// this.props.getMaxNickNameLength();
		// this.props.updateLocalNickName(this.props.nickname);
	}

	componentWillReceiveProps(props){
		if(this.props.registerCode != props.registerCode){
			this.props.navigation.goBack(null)
		}
	}

	onComplete(){
		//Check if the new value is valid.
		console.log("this.state.registerCode", this.state.registerCode)
		console.log('this.props.setRegisterCode ='+this.props.setRegisterCode)
		this.props.setRegisterCode(this.state.registerCode) 
	}

	setRegisterCode(text){
		console.log("registerCode: " + text);
		this.setState({
			registerCode: text
		});
		// this.props.updateLocalNickName(text);
	}

	render() {
		console.log("this.props.isShowError", this.props.isShowError);
		console.log("this.props.error", this.props.error);
		return (
			<View style={{flex:1,backgroundColor:ColorConstants.COLOR_MAIN_THEME_BLUE}}>

				{this.renderHeader()}
				
				<TextInput style={styles.nickNameInputView}
				 	underlineColorAndroid={'transparent'}
					onChangeText={(text) => this.setRegisterCode(text)}
					placeholder={'请输入拜师码'}
					placeholderTextColor='grey'
					maxLength={4}
					value={this.state.registerCode}/>

				<View style={styles.line}>
					{/* <View style={[styles.separator, {marginLeft: 15, marginRight: 15}]}/> */}
				</View>
				<Text style={{color:'white',fontSize:12,marginLeft:15}}>拜师码只能填写一次，以后无法修改！</Text>
				{/* <ErrorMsg
					showView={this.props.isShowError} 
					showText={this.props.error}/> */}
			</View>
		);
	}

	renderHeader(){
		return (
			<NavBar
				showBackButton={true}
				titleStyle={{fontSize:18}}
				title={'填写拜师码'}
				subTitleStyle={styles.subTitle}
				textOnRight={LS.str("FINISH")}
				rightPartOnClick={()=>this.onComplete()}
				navigation={this.props.navigation}/>
		)
	}
	
}

// define your styles
const styles = StyleSheet.create({
	nickNameInputView:{
		color:'white',
		height:64,
		width:width,
		backgroundColor:'transparent',
		marginLeft: 15,
	},

	line: {
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_DARK,
	},

	separator: {
		height: 0.5,
		backgroundColor: ColorConstants.SEPARATOR_DARK,
	},

	errorDot: {
		width: 16,
		height: 16,
 		marginLeft: 15,
	},

	errorText:{
		fontSize:12,
		color:'red',
		flex:1,
		marginLeft:10,
		marginRight: 15,
	},

	subTitle: {
		fontSize: 17,
		textAlign: 'center',
		color: 'white',
		marginRight:10,
	},

	errorMsg:{
		flexDirection: 'row',
		alignItems: 'center',
		marginTop: 10,
		width:width,
	},

});


const mapStateToProps = state => {
    return {
		...state.meData,
		...state.settings,
    };
};
  
const mapDispatchToProps = {
	setRegisterCode, 
};

var connectedComponent = connect(mapStateToProps, mapDispatchToProps)(MeSettingBaiShiScreen);
export default connectedComponent;
module.exports = connectedComponent;