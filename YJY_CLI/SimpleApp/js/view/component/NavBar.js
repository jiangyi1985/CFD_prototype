import React, { Component } from 'react';
import {
	AppRegistry,
	StyleSheet,
	Navigator,
	Platform,
	View,
	Text,
	Image,Alert,
	TouchableHighlight,
	TouchableOpacity,
	StatusBar,
} from 'react-native';

var ColorPropType = require('ColorPropType');
var ColorConstants = require('../../ColorConstants')
var UIConstants = require('../../UIConstants');
// var MainPage = require('./MainPage')
// var WebSocketModule = require('../module/WebSocketModule'); 
// var NavBar = React.createClass({
export default class  NavBar extends React.Component {
 

	// static propTypes={
	// 	showBackButton: React.PropTypes.bool,
	// 	showSearchButton: React.PropTypes.bool,
	// 	imageOnLeft: React.PropTypes.number,
	// 	textOnLeft: React.PropTypes.string,
	// 	textOnRight: React.PropTypes.string,
	// 	imageOnRight: React.PropTypes.number,
	// 	rightImageStyle: React.PropTypes.object,
	// 	viewOnRight: React.PropTypes.element,
	// 	viewOnLeft: React.PropTypes.element,
	// 	leftTextOnClick: React.PropTypes.func,
	// 	leftButtonOnClick: React.PropTypes.func,
	// 	rightTextOnClick: React.PropTypes.func,
	// 	rightImageOnClick: React.PropTypes.func,
	// 	backButtonOnClick: React.PropTypes.func,
	// 	subTitle: React.PropTypes.string,
	// 	subTitleStyle: Text.propTypes.style,
	// 	backgroundColor: ColorPropType,
	// 	rightCustomContent: React.PropTypes.func,
	// 	barStyle: View.propTypes.style,
	// 	titleStyle: Text.propTypes.style,
	// 	enableRightText: React.PropTypes.bool,
	// 	hideStatusBar: React.PropTypes.bool,
	// 	onlyShowStatusBar: React.PropTypes.bool,
	// 	titleOpacity: React.PropTypes.number,
	// }



	onDidFocus(){
		if(Platform.OS === 'android'){
			var navBarColor = ColorConstants.BGBLUE;
			if(this.props.backgroundColor && this.props.backgroundColor !== "transparent"){
				//Which means the background doesn't have an alpha channel
				navBarColor = this.props.backgroundColor;
			}
			var bgColor = Platform.Version >= 21 ? "transparent" : navBarColor;
			var translucent = Platform.OS === "android";
			StatusBar.setBackgroundColor(bgColor);
			StatusBar.setTranslucent(translucent);
		}
	}

	backOnClick() { 
		if(this.props.navigation ==undefined){
			Alert.alert('this.props.navigation is undefined')
			return
		}
		 
		if(this.props.leftButtonOnClick){
			this.props.leftButtonOnClick();
		}else{
			this.props.navigation.goBack();
		}

		// WebSocketModule.cleanRegisteredCallbacks()
		if (this.props.backButtonOnClick) {
			this.props.backButtonOnClick()
		}
	}

	leftTextOnClick() {
		if (this.props.leftTextOnClick) {
			this.props.leftTextOnClick()
		}
	}

	rightTextOnClick() {
		if (this.props.rightTextOnClick) {
			this.props.rightTextOnClick()
		}
	}

	rightImageOnClick() {
		if (this.props.rightImageOnClick) {
			this.props.rightImageOnClick()
		}
	}

	searchButtonClicked() {
		// this.props.navigator.push({
		// 	name: MainPage.STOCK_SEARCH_ROUTE,
		// });
	}

	hexToRgb(hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? {
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    } : null;
	}

	renderPlaceholder(navBarColor){
		if(Platform.OS === "android"){
			if(Platform.Version >= 21){
				return (<View style={{height: StatusBar.currentHeight, backgroundColor: navBarColor}}/>);
			}else{
				StatusBar.setBackgroundColor(navBarColor);
			}
		}
		return null;
	}

	renderStatusBar(navBarColor){
		if (Platform.OS === "android"){
			var bgColor = Platform.Version >= 21 ? "transparent" : navBarColor;
			var translucent = Platform.OS === "android";
			// StatusBar.setBackgroundColor(bgColor);
			// StatusBar.setBackgroundColor(bgColor);
			return (<StatusBar barStyle="light-content" backgroundColor={bgColor}
				translucent={translucent}/>)
		}
	}

	renderTitle(){
		if(this.props.titleOpacity > 0){
			return(
				<View style={styles.centerContainer}>
					<Text style={[styles.title, this.props.titleStyle, {opacity: this.props.titleOpacity}]}>
						{this.props.title}
					</Text>
					{this.renderSubTitle()}
				</View>
			);
		}else{
			return ( <View style={styles.centerContainer}/>)
		}
	}

	render() {
		var backgroundColor = ColorConstants.BGBLUE;
		if(this.props.backgroundColor){
			backgroundColor = this.props.backgroundColor;
		}

		var navBarColor = ColorConstants.BGBLUE;
		if(this.props.backgroundColor && this.props.backgroundColor !== "transparent"){
			//Which means the background doesn't have an alpha channel
			navBarColor = this.props.backgroundColor;
		}

		if(this.props.titleOpacity < 1){
			var rgb = this.hexToRgb(navBarColor)
			var alpha = this.props.titleOpacity;
			navBarColor = 'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+alpha+')'
			backgroundColor = navBarColor
		}

		if(this.props.onlyShowStatusBar){
			//StatusBar.setBackgroundColor(navBarColor)
			return this.renderPlaceholder(navBarColor);
		}
		var h = Platform.OS === 'android' ? (Platform.Version >= 21 ? StatusBar.currentHeight : 0) : 0
		console.log("STATUS_BAR_ACTUAL_HEIGHT " + UIConstants.STATUS_BAR_ACTUAL_HEIGHT + ", " + h)

		return (
			<View style={[styles.container, {backgroundColor: backgroundColor}, this.props.barStyle]} >
				{this.renderStatusBar(navBarColor)}
				{this.renderLeftPart()}
				{this.renderTitle()}

				{this.renderRightPart()}

			</View>
		);
	}

	renderLeftPart(){
		//viewOnRight
		if(this.props.viewOnLeft){
			return this.props.viewOnLeft;
		}else{
			return (
				<View style={styles.leftContainer}>
					{this.renderBackButton()}
					{this.renderLeftText()}
				</View>)
		}
	}

	renderRightPart(){
		//viewOnRight
		if(this.props.viewOnRight){
			return this.props.viewOnRight;
		}else{
			return (
				<View style={styles.rightContainer}>
					{this.renderSearchButton()}
					{this.renderRightText()}
					{this.renderRightImage()}
					{this.renderRightCustomContent()}
				</View>);
		}
	}

	renderBackButton() {
		if (this.props.showBackButton) {
			var imageOnLeft = require('../../../images/back.png');
			if(this.props.imageOnLeft){
				imageOnLeft = this.props.imageOnLeft;
			}

			return (
				<TouchableOpacity
					onPress={()=>this.backOnClick()}
					// underlayColor={ColorConstants.title_blue()}
					>
					<View style={{padding: 5}}>
						<Image
							style={styles.backButton}
							source={imageOnLeft}/>
					</View>
				</TouchableOpacity>
			);
		}
	}

	renderLeftText() {
		if (this.props.textOnLeft !== null) {
			return (
				<TouchableOpacity
					onPress={this.leftTextOnClick}
					// underlayColor={ColorConstants.title_blue()}
					>

					<Text style={styles.textOnLeft}>
						{this.props.textOnLeft}
					</Text>

				</TouchableOpacity>
			);
		}
	}

	renderSearchButton() {
		if (this.props.showSearchButton) {
			return (
				<TouchableOpacity
					onPress={this.searchButtonClicked}
					// underlayColor={ColorConstants.title_blue()}
					>

					<Image
						style={styles.rightImage}
						source={require('../../../images/search.png')}/>

				</TouchableOpacity>
			);
		}
	}

	renderRightText() {
		if (this.props.textOnRight !== null) {
			if(this.props.enableRightText) {
				return (
					<TouchableOpacity
						onPress={this.rightTextOnClick}
						// underlayColor={ColorConstants.title_blue()}
						>

						<Text style={styles.textOnRight}>
							{this.props.textOnRight}
						</Text>

					</TouchableOpacity>
				);
			}
			else {
				return (
					<Text style={[styles.disabledTextOnRight,{color:'#3e86ff'}]}>
						{this.props.textOnRight}
					</Text>
					)
			}
		}
	}

	renderRightImage() {
		if (this.props.imageOnRight !== null) {
			var imageStyles = [styles.rightImage];
			if(this.props.rightImageStyle){
				imageStyles.push(this.props.rightImageStyle);
			}

			return (
				<TouchableOpacity
					onPress={this.rightImageOnClick}
					// underlayColor={ColorConstants.title_blue()}
					>

					<Image
						style={imageStyles}
						source={this.props.imageOnRight}/>

				</TouchableOpacity>
			);
		}
	}

	renderSubTitle() {
		if (this.props.subTitle !== null) {
			return (
				<Text style={this.props.subTitleStyle}>
					{this.props.subTitle}
				</Text>
			)
		}
	}

	renderRightCustomContent() {
		if (this.props.rightCustomContent !== null) {
			return (
				<View>
					{this.props.rightCustomContent()}
				</View>
			);
		}
	}
}

NavBar.defaultProps = { 
	showBackButton: false,
	showSearchButton: false,
	imageOnLeft: null,
	textOnLeft: null,
	textOnRight: null,
	imageOnRight: null,
	rightImageStyle: null,
	viewOnRight: null,
	viewOnLeft: null,
	leftTextOnClick: null,
	leftButtonOnClick: null,
	rightTextOnClick: null,
	rightImageOnClick: null,
	backButtonOnClick: null,
	subTitle: null,
	backgroundColor: null,
	rightCustomContent: null,
	enableRightText: true,
	hideStatusBar: false,
	onlyShowStatusBar: false,
	titleOpacity: 1, 
}



var styles = StyleSheet.create({
	container: {
		height: UIConstants.HEADER_HEIGHT,
		backgroundColor: ColorConstants.BGBLUE,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingTop: (Platform.OS === 'ios') ? 15 : UIConstants.STATUS_BAR_ACTUAL_HEIGHT,
	},
	leftContainer: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
	},
	centerContainer: {
		flex: 2,
	},
	rightContainer: {
		flex: 1,
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'flex-end'
	},
	backButton: {
		width: 20,
		height: 14,
		marginLeft: 10,
		resizeMode: Image.resizeMode.contain,
	},
	rightImage: {
		width: 21,
		height: 21,
		marginRight: 20,
		resizeMode: Image.resizeMode.contain,
	},
	left: {
		fontSize: 15,
		textAlign: 'center',
		color: '#ffffff',
	},
	title: {
		fontSize: 18,
		textAlign: 'center',
		color: '#ffffff',
	},
	textOnLeft: {
		fontSize: 15,
		textAlign: 'center',
		color: '#ffffff',
		marginLeft: 20,
	},
	textOnRight: {
		fontSize: 15,
		textAlign: 'center',
		color: '#ffffff',
		marginRight: 10,
	},
	disabledTextOnRight: {
		fontSize: 15,
		textAlign: 'center',
		color: '#3e86ff',
		marginRight: 10,
	},
});

module.exports = NavBar;
