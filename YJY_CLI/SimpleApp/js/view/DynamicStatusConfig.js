'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	ListView,
	Image,
	TouchableOpacity,
	Alert,
	ScrollView,
	Linking,
	Platform, 
	Text,
	Switch,
} from 'react-native' 
import CustomStyleText from './component/CustomStyleText';
import LogicData from "../LogicData";
import NavBar from './component/NavBar';
var WebViewPage = require('./WebViewPage');

var ColorConstants = require('../ColorConstants') 
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule')
var LS = require("../LS"); 
const FOCUS_FOLLOW = 0
const FOCUS_TRADE_FOLLOW = 1
const FOCUS_SYSTEM = 2

var listRawData = [ 
	{type:FOCUS_FOLLOW,"title":'WATCHLIST',"desciption":'关注用户的交易动态'},
	{type:FOCUS_TRADE_FOLLOW,"title":'COPIERS',"desciption":'自己的交易动态'},
	{type:FOCUS_SYSTEM,"title":'NEWS',"desciption":'系统推送的每日资讯'},
] 
var {height, width} = Dimensions.get('window')
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var MyPie = require('./component/Pie/MyPie')


	//  showFollowing: true, 关注的用户
	// 	showTradeFollowing: true, 跟随的用户
	// 	showHeadline: true 平台资讯
 
export default class DynamicStatusConfig extends Component {

	static defaultProps = {

	}

	static propTypes = {

	} 

	constructor(props){
		super(props); 
		this.state = { 
			showFollowing:false,
			showTradeFollowing:false,
			showHeadline:false,
			dataSource: ds.cloneWithRows(listRawData),
		}
	}

	renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
		return (
		  <View style={styles.line} key={rowID}>
			<View style = {styles.separator}></View>
		  </View>
		);
	}

	componentDidMount(){
		this.loadLiveFilter()
	}

	onSwitchPressed(value,rowData){
		if(rowData.type == FOCUS_FOLLOW){
			this.setState({
				dataSource: ds.cloneWithRows(listRawData),
				showFollowing: value
			})
		}else if(rowData.type == FOCUS_TRADE_FOLLOW){
			this.setState({
				dataSource: ds.cloneWithRows(listRawData),
				showTradeFollowing: value
			})
		}
		else if(rowData.type == FOCUS_SYSTEM){
			this.setState({
				dataSource: ds.cloneWithRows(listRawData),
				showHeadline: value
			})
		}
	}

	renderRow(rowData, sectionID, rowID){
		var switchIsOn = false;

		if(rowData.type == FOCUS_TRADE_FOLLOW){
			switchIsOn = this.state.showTradeFollowing
		}else if(rowData.type == FOCUS_FOLLOW){
			switchIsOn = this.state.showFollowing
		}else if(rowData.type == FOCUS_SYSTEM){
			switchIsOn = this.state.showHeadline
		}
		

		return(
			<View style={styles.viewWapper}>
				<View style={styles.leftWapper}>
					<CustomStyleText style={styles.titleText}>{LS.str(rowData.title)}</CustomStyleText>
					{/* <CustomStyleText style={styles.desciptionText}>{rowData.desciption}</CustomStyleText> */}
				</View> 
				<Switch
					onValueChange={(value) => this.onSwitchPressed(value, rowData)}
					value={switchIsOn}
					onTintColor={ColorConstants.BGBLUE} />
			</View>
			
		) 
	}
 
	loadLiveFilter() { 
		var userData = LogicData.getUserData()
		
		if(LogicData.isLoggedIn()){
			NetworkModule.fetchTHUrl(
				NetConstants.CFD_API.GET_DYNAMIC_CONFIG_FILTER,
				{
					method: 'GET',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
					},  
				},
				(responseJson) =>{ 
					this.setState(
						{ 
							showFollowing:responseJson.showFollowing,
							showTradeFollowing:responseJson.showTradeFollowing,
							showHeadline:responseJson.showHeadline, 
							dataSource: ds.cloneWithRows(listRawData),
						}
					)
				}
			)
		}
	} 

	setLiveFilter(){
		var userData = LogicData.getUserData()
		var notLogin = Object.keys(userData).length === 0
		if(!notLogin){
			NetworkModule.fetchTHUrl(
				NetConstants.CFD_API.PUT_DYNAMIC_CONFIG_FILTER_SETTING,
				{
					method: 'PUT',
					headers: {
						'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
						'Content-Type': 'application/json; charset=utf-8',
					}, 
					body: JSON.stringify({
						showTradeFollowing: this.state.showTradeFollowing,
						showFollowing: this.state.showFollowing,
						showHeadline: this.state.showHeadline, 
					}),
				},
				(responseJson) =>{ 
					// this.props.navigator.goBack(); 
					// if(this.props.navigation.state.params.onGoBack){
					//    this.props.navigation.state.params.onGoBack();
					// } 

					this.props.navigation.goBack();
					if(this.props.navigation.state.params.onGoBack){
						this.props.navigation.state.params.onGoBack();
					} 
				}
			)
		}
	} 

	onCompleted(){
		this.setLiveFilter(); 
		// this.props.navigation.goBack();
		// if(this.props.navigation.state.params.onGoBack){
		// 	this.props.navigation.state.params.onGoBack();
		// } 
	}

	renderWebView(){
		var url = NetConstants.CFD_API.HELP_CENTER_URL_ACTUAL
		Alert.alert(url)
		return(
			<View style = {{width:width,height:800,backgroundColor:'yellow'}}>
				<WebViewPage url={url}
					// onNavigationStateChange={route.onNavigationStateChange}
					// onWebPageLoaded={route.onWebPageLoaded}
					// showTabbar={showTabbar}
					// title={route.title} navigator={navigationOperations}
					// backFunction={()=>{
					// 	if (route.backFunction) {
					// 		this.showTabbar()
					// 		route.backFunction()
					// 	}
					// }}
					showShareButton={true}
					// shareID={route.shareID}
					// shareUrl={route.shareUrl}
					// shareTitle={route.shareTitle}
					// shareDescription={route.shareDescription}
					// shareFunction={this._doShare}
					// shareTrackingEvent={route.shareTrackingEvent}
					// themeColor={route.themeColor}
					isShowNav={true}
					// isLoadingColorSameAsTheme={route.isLoadingColorSameAsTheme}
					// logTimedelta={route.logTimedelta}
					/>
			</View>	
		)
	}

	render(){
		return(
			<View style={{backgroundColor:'#FFFFFF',flex:1,width:width}}>
				<NavBar title={LS.str('DYNAMIC_SETTING')} showBackButton={true} 
				rightPartOnClick={()=>this.onCompleted()}
				navigation={this.props.navigation} textOnRight={LS.str('FINISH')}/>
				 <ListView  
					style={styles.list}
					dataSource={this.state.dataSource}
					renderRow={this.renderRow.bind(this)}
					renderSeparator={this.renderSeparator} /> 
				{/* <View>
					{this.renderWebView()}
				</View>	 */}
			</View>
		 ) 
	}


}

var styles = StyleSheet.create({
	list:{
		// backgroundColor:'yellow', 
	},
	viewWapper:{
		height:60,
		width:width, 
		paddingLeft:15,
		paddingRight:15,
		flexDirection:'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	leftWapper:{
		justifyContent:'center'
	},
	titleText:{
		fontSize:15, 
		marginBottom:2.5,
		color:'black'
	},
	desciptionText:{
		fontSize:13,
		color:'grey'
	},
	separator: {
		height: 0.5,
		backgroundColor: '#eeeeee',
    	marginLeft:15,
	  },
	line: {
		height: 0.5,
		backgroundColor: 'white',
   		marginLeft:0,
	},
});


module.exports = DynamicStatusConfig;
