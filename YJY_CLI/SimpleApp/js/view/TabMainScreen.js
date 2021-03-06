import React, { Component } from 'react';
import {
    AppRegistry,
    Button,
    View,
    StyleSheet,
    Platform, 
    Alert,
    ScrollView,
    Dimensions,
    TouchableOpacity, 
    ListView,
    Image,
    ActivityIndicator,
    ProgressBarAndroid,
    ActivityIndicatorIOS,
    TouchableHighlight,
    PanResponder,
    Text
} from 'react-native';

import CustomStyleText from './component/CustomStyleText';
import NavBar from './component/NavBar';
import DynamicRowComponent from './component/DynamicRowComponent';
import NetworkErrorIndicator from './component/NetworkErrorIndicator';
import ViewKeys from '../ViewKeys';
var LS = require('../LS')

var ColorConstants = require('../ColorConstants');
require('../utils/dateUtils')
var {height, width} = Dimensions.get('window');
var {EventCenter, EventConst} = require('../EventCenter');
var WebSocketModule = require('../module/WebSocketModule')
var NetConstants = require('../NetConstants')
var NetworkModule = require('../module/NetworkModule');

var childHeights=[];
var listViewOffY = 0; 
import PullToRefreshListView from 'react-native-smart-pull-to-refresh-listview'
import LogicData from '../LogicData';

  /*
  { time: '2018-03-05T01:58:31.263',
    type: 'close',
    user: { id: 7, nickname: 'u000007' },
    isRankedUser: true,
    security: { id: 34854, name: '英国100' },
    position: { id: 45, roi: -0.06526041005 } },
    { time: '2018-03-02T07:52:30.857',
    type: 'close',
    user: { id: 7, nickname: 'u000007' },
    isRankedUser: true,
    security: { id: 34854, name: '英国100' },
    position: { id: 48, roi: 0.0035087719 } },
    { time: '2018-03-02T07:51:49.377',
    type: 'close',
    user: { id: 7, nickname: 'u000007' },
    isRankedUser: true,
    security: { id: 34854, name: '英国100' },
    position: { id: 47, roi: 0.00701754385 } },
    { time: '2018-03-02T07:51:05.24',
    type: 'close',
    user: { id: 7, nickname: 'u000007' },
    isRankedUser: true,
    security: { id: 34854, name: '英国100' },
    position: { id: 46, roi: 0.00842069805 } },
    { time: '2018-03-02T07:50:17.643',
    type: 'open',
    user: { id: 7, nickname: 'u000007' },
    isRankedUser: true,
    security: { id: 34854, name: '英国100' },
    position: { id: 50, invest: 200, leverage: 50 } },
  */


//Tab0:动态
class TabMainScreen extends React.Component {
     
    constructor(props){
        super()
         

        this._dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2, 
        });
 

        this.state = {
            first: true,  
            isLoading:true,
            isContentLoaded:false,
            currentOperatedRow: -1,
            isAllowScroll: true,
            guideShow:true,
        } 

    }

     
    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.timer && clearTimeout(this.timer);
    }
 
    componentDidMount () { 

        this.startUpInitializeFinishedSubscription = EventCenter.getEventEmitter().addListener(EventConst.START_UP_INITIALIZE_FINISHED, () => {
            this.loadData()
            this.startUpInitializeFinishedSubscription && this.startUpInitializeFinishedSubscription.remove();
        });

        // this.timer = setInterval(
        //     () => {  
        //         // console.log('time Interval...')

        //         // var responseJson = this.state.dataResponse
        //         // if(responseJson && responseJson.length > 0){
        //         //     for(var i = 0; i < responseJson.length; i++){
        //         //         responseJson[i].isNew = false;
        //         //     }

        //         //     var add = {}
        //         //     $.extend(true, add, responseJson[0]);
        //         //     add.isNew = true;

        //         //     responseJson.splice(0, 0, add);
                    
        //         //     this.setState({ 
        //         //         dataResponse: responseJson,
        //         //         dataSource: this._dataSource.cloneWithRows(responseJson),
        //         //     })
        //         // } 
        //         this.loadCacheListData() 
        //     },
        //     30000
        // );

        // this.timerCacheList = setInterval(
        //     () => { 
        //         var responseJson = this.state.dataResponse
        //         if(this.state.cacheData&&this.state.cacheData.length>0){
        //             console.log('this.state.cacheData.length = '+this.state.cacheData.length)
                     
        //             if(responseJson && responseJson.length > 0){
        //                 for(var i = 0; i < responseJson.length; i++){
        //                     responseJson[i].isNew = false;
        //                 }
        //                 var add = {}
        //                 $.extend(true, add, this.state.cacheData[this.state.cacheData.length-1]);
        //                 responseJson.splice(0, 0, add);
        //                 this.state.cacheData.splice(this.state.cacheData.length-1,1)
        //                 this.setState({ 
        //                     dataResponse:responseJson,
        //                     cacheData:this.state.cacheData,
        //                     dataSource:this._dataSource.cloneWithRows(responseJson),
        //                 })
        //             }
        //         }else{
        //             try{
        //                 console.log("tab main screen responseJson", responseJson)
        //                 for(var i = 0; i < responseJson.length; i++){
        //                     responseJson[i].isNew = false;
        //                 } 
        //                 this.setState({ 
        //                     dataResponse:responseJson, 
        //                     dataSource:this._dataSource.cloneWithRows(responseJson),
        //                 })
        //             }catch(e){
        //                 console.log("error!", e)
        //             }
        //         }
        //     },
        //     2000
        //
 
        this.tabSwitchedSubscription = EventCenter.getEventEmitter().addListener(EventConst.HOME_TAB_RESS_EVENT, () => {
            WebSocketModule.cleanRegisteredCallbacks(); 

            this.loadData()
        });
    }

    componentWillUnmount() {
        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        this.tabSwitchedSubscription && this.tabSwitchedSubscription.remove();
        this.startUpInitializeFinishedSubscription && this.startUpInitializeFinishedSubscription.remove();
        this.timer && clearTimeout(this.timer);
        this.timerCacheList && clearTimeout(this.timerCacheList);
    }
 
    componentWillMount() {
        
    } 

    fetchMeData(){
        var userData = LogicData.getUserData();
        if(userData!=undefined){
            NetworkModule.fetchTHUrl(
                NetConstants.CFD_API.ME_DATA,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                        'Content-Type': 'application/json; charset=utf-8',
                    },
                    showLoading: true,
                }, (responseJson) => {                
                    LogicData.setMeData(responseJson); 

                    this.setState(
                        {
                            nickName:responseJson.nickname
                        }
                    )
                }, (error) =>{ 
                    
                }
            );}
    } 

    renderEmpty(){
		if(this.state.dataResponse&&this.state.dataResponse.length>0){
		}else{
			return(
				<View style={{height:height-150,alignItems:'center',justifyContent: 'center'}} >
                    <CustomStyleText style={{width:width-100,textAlign:'center',color:ColorConstants.BLUETEXT}}>{LS.str('DYNAMIC_OPEN_ASK')}</CustomStyleText>
                    <TouchableOpacity onPress={()=>this.onPressedConfig()} style={{alignItems:'center',justifyContent:'center',borderRadius:8, margin:15,borderColor:ColorConstants.BLUETEXT,borderWidth:1,width:120,height:32}}>
                        <CustomStyleText style={{color:'white',fontSize:16}}>{LS.str('GO')}</CustomStyleText>
                    </TouchableOpacity>
			   </View>	  
			) 
		} 
    } 
    
    _onScroll(event){ 
        listViewOffY = event.nativeEvent.contentOffset.y;
    } 
     
    onPopOut(){
        console.log('i am onPopOut!!')
        this.loadData(false) 
        // this.state = { 
        //     isLoading:true,
        //     isContentLoaded:false,
        // } 
    }

    onPressedConfig(){
        this.props.navigation.navigate(ViewKeys.SCREEN_DYNAMIC_STATUS_CONFIG,{onGoBack:()=>this.onPopOut()})
    }

    renderDateInfo(){ 
		// console.log('LOG ==> offY =' + listViewOffY)
		var maxOff = listViewOffY
        var fistItem = 0
        // console.log('LOG ===> childHeights.length = ' + childHeights.length);
		for(var i = 0;i<childHeights.length;i++){
            maxOff -= childHeights[i]
            // console.log('height:'+childHeights[i])
			if(maxOff <= 0) {
				fistItem = i
				break
			}
		}  
		var firstItemId = fistItem; 
		var dataTime = '';
		if(this.state.dataResponse.length>firstItemId){
			var d = new Date(this.state.dataResponse[firstItemId].time);
			dataTime = d.getDateFullString() 
		}

		return(
			<View style = {{height:36,paddingLeft:10,paddingRight:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
				 
				<CustomStyleText style={{color:ColorConstants.BLUE2}}>{dataTime}</CustomStyleText> 
				{this.renderConfigEnter()}
			</View>	
		)
    }
    
    renderConfigEnter(){
        if(LogicData.isLoggedIn()){
            return (
                <TouchableOpacity onPress={()=>{this.onPressedConfig()}} style={{height:24,width:32,justifyContent:'center'}}>
                        <Image style = {{width:26.5,height:5,}} source={require('../../images/three_point.png')}></Image>
                </TouchableOpacity>
            )
        }else{
            return null;
        }
        
    }

   

    render() { 
        if(!this.state.isContentLoaded){
            return (
                <View style = {styles.mainContainer}>
                    <NetworkErrorIndicator 
                        onRefresh={()=>this._onRefresh()}
                        refreshing={this.state.isLoading}/>
                </View>
			)
        }else{
            return (
                <View style = {styles.mainContainer}>
                    <NavBar onlyShowStatusBar={true}/>                                
                    {this.renderDateInfo()}
                    {this.renderEmpty()}
                    <PullToRefreshListView
                        ref={ (component) => this._pullToRefreshListView = component }
                        viewType={PullToRefreshListView.constants.viewType.listView}
                        contentContainerStyle={{backgroundColor: 'transparent', }}
                        style={{marginTop: Platform.OS == 'ios' ? 0 : 0, }}
                        initialListSize={20}
                        enableEmptySections={true}
                        dataSource={this.state.dataSource}
                        pageSize={20}
                        onScroll={this._onScroll}
				        scrollEventThrottle={8} 
                        renderRow={this._renderRow}
                        renderHeader={(viewState)=>this._renderHeader(viewState)}
                        renderFooter={(viewState)=>this._renderFooter(viewState)} 
                        onRefresh={()=>this._onRefresh()}
                        onLoadMore={()=>this._onLoadMore()}
                        pullUpDistance={35}
                        pullUpStayDistance={50} 
                        removeClippedSubviews={false}
                        pullDownDistance={35}
                        pullDownStayDistance={50}
                        scrollEnabled={this.state.isAllowScroll}
                        enabledPullUp={this.state.isAllowScroll}
                        enabledPullDown={this.state.isAllowScroll}
                    />
                </View>
            )
        } 
    }

    delItem(id){ 
        console.log('del = '+id)
		LogicData.addRemovdedDynamicRow(id) 

		LogicData.getRemovedRynamicRow().then((delList)=>{
             
            console.log("RAMBO:"+delList.length)
            for(var i = 0;i<delList.length;i++){ 
               console.log("RAMBO:"+delList[i])
            }

			var responseJson = this.state.dataResponse
			responseJson = responseJson.filter(function(item){
				for(var i = 0;i<delList.length;i++){ 
					if(delList[i] == item.time){
						return false
					}
				}
				return true
			}) 

			this.setState({ 
				dataResponse:responseJson,
				dataSource: this._dataSource.cloneWithRows(responseJson),
			})  

		 }) 

    }
    
    closeAllRows(){
		if(this.state.currentOperatedRow != -1){
			this.setState({
				currentOperatedRow: -1,
				dataSource: this._dataSource.cloneWithRows(this.state.dataResponse),
			});
		}
	}
  

    _renderRow = (rowData, sectionID, rowID) => {     
        
        return(
            <View onLayout={(e) => {
				childHeights[parseInt(rowID)] = e.nativeEvent.layout.height;
				// console.log("id = "+ rowID + "  height = " + e.nativeEvent.layout.height)
				// console.log('childHeights length2 = ' + childHeights.length)
				}} 
				>
                <DynamicRowComponent 
					navigation={this.props.navigation}
					rowData={rowData}
					rowID={rowID}
					delCallBack={(id)=>{this.delItem(id)}}
					close={this.state.currentOperatedRow != rowID}
					onRowPress={()=>{
						this.closeAllRows();
					}}
					onClose={()=>{
						if(this.state.currentOperatedRow == rowID){
							this.setState({
								currentOperatedRow: -1,
								dataSource: this._dataSource.cloneWithRows(this.state.dataResponse),
							});
						}
                    }}
                    scrollEventThrottle={50}
                    allowScroll={(value)=>{
                        this.setState({
                            isAllowScroll: value,
                        })
                    }}
					onOpen={()=>{
						if(this.state.currentOperatedRow != rowID){
							this.setState({
								currentOperatedRow: rowID,
								dataSource: this._dataSource.cloneWithRows(this.state.dataResponse),
							});
						}
					}}/>
                    
                {/* <DynamicRowComponent navigation={this.props.navigation} rowData={rowData}/> */}
            </View>
        ) 
    } 

    _renderHeader = (viewState) => {
        let {pullState, pullDistancePercent} = viewState
        let {refresh_none, refresh_idle, will_refresh, refreshing,} = PullToRefreshListView.constants.viewState
        pullDistancePercent = Math.round(pullDistancePercent * 100)
        switch(pullState) {
            case refresh_none:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <CustomStyleText style={styles.loadText}>{LS.str("PULL_TO_REFRESH")}</CustomStyleText>
                    </View>
                )
            case refresh_idle:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <CustomStyleText style={styles.loadText}>{LS.str("PULL_TO_REFRESH")}</CustomStyleText>
                    </View>
                )
            case will_refresh:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <CustomStyleText style={styles.loadText}>{LS.str("RELEASE_TO_REFRESH")}</CustomStyleText>
                    </View>
                )
            case refreshing:
                return (
                    <View style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        {this._renderActivityIndicator()}
                        <CustomStyleText style={styles.loadText}>{LS.str("REFRESHING")}</CustomStyleText>
                    </View>
                )
        }
    }

    _renderFooter = (viewState) => {
        let {pullState, pullDistancePercent} = viewState
        let {load_more_none, load_more_idle, will_load_more, loading_more, loaded_all, } = PullToRefreshListView.constants.viewState
        pullDistancePercent = Math.round(pullDistancePercent * 100)
        switch(pullState) {
            case load_more_none:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <CustomStyleText style={styles.loadText}>{LS.str("LOAD_MORE")}</CustomStyleText>
                    </View>
                )
            case load_more_idle:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <CustomStyleText style={styles.loadText}>{LS.str("LOAD_MORE")}</CustomStyleText>
                    </View>
                )
            case will_load_more:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <CustomStyleText style={styles.loadText}>{LS.str("RELEASE_FOR_LOAD_MORE")}</CustomStyleText>
                    </View>
                )
            case loading_more:
                return (
                    <View style={{flexDirection: 'row', height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        {this._renderActivityIndicator()}
                        <CustomStyleText style={styles.loadText}>{LS.str("LOADING")}</CustomStyleText>
                    </View>
                )
            case loaded_all:
                return (
                    <View style={{height: 35, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent',}}>
                        <CustomStyleText style={styles.loadText}>{LS.str("NO_MORE")}</CustomStyleText>
                    </View>
                )
        }
    }

    _onRefresh = () => {  
        this.loadData(true) 
    }

    loadCacheListData(){
        if(this.state.dataResponse&&this.state.dataResponse.length>0){
            var timer = this.state.dataResponse[0].time
            var url = NetConstants.CFD_API.MAIN_FEED_DEFAULT
            url += '?newerThan=' + timer
            url += '&count=' + 5


            NetworkModule.fetchTHUrl(
                url,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                    }, 
                },
                (responseJson) => {

                    LogicData.getRemovedRynamicRow().then((delList)=>{  
                        responseJson = responseJson.filter(function(item){
                            for(var i = 0;i<delList.length;i++){ 
                                if(delList[i] == item.time){
                                    return false
                                }
                            }
                            return true
                        })  
    
                        // for(var i = 0; i < responseJson.length; i++){
                        //     responseJson[i].isNew = true;
                        // }  

                        this.setState({ 
                            cacheData: responseJson,
                        }) 
    
                        this._pullToRefreshListView.endLoadMore()   
    
                        })     
                },
                (result) => {
                    //Alert.alert('提示', result.errorMessage);
                }
            )
        } 
    }

    loadData(isRefresh){
        var userData = LogicData.getUserData();
        var headerToken = undefined
        if(LogicData.isLoggedIn()){
            headerToken = {
                'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                'Content-Type': 'application/json; charset=utf-8',    
            }
        } else{
            headerToken = { 
                'Content-Type': 'application/json; charset=utf-8',    
            }
        }
        
        
            
        NetworkModule.fetchTHUrl(
            NetConstants.CFD_API.MAIN_FEED_DEFAULT,
            {
                method: 'GET',
                headers:headerToken, 
            },
            (responseJson) => {  

                LogicData.getRemovedRynamicRow().then((delList)=>{  
                    responseJson = responseJson.filter(function(item){
                        for(var i = 0;i<delList.length;i++){ 
                            if(delList[i] == item.time){
                                return false
                            }
                        }
                        return true
                    })  

                    // for(var i = 0; i < responseJson.length; i++){
                    //     responseJson[i].isNew = true;
                    // } 

                    this.setState({ 
                        dataResponse: responseJson,
                        dataSource: this._dataSource.cloneWithRows(responseJson),
                        isLoading:false,
                        isContentLoaded: true,
                    })

                })   
                
                
                
                if(isRefresh){
                    this._pullToRefreshListView && this._pullToRefreshListView.endRefresh()
                }
            },
            (result) => {
                this.setState({
                    isLoading:false
                })
                //Alert.alert('提示', result.errorMessage);
            }
        )
         
        
    }

    _onLoadMore = () => {

        var timer = this.state.dataResponse[this.state.dataResponse.length-1].time
		var url = NetConstants.CFD_API.MAIN_FEED_DEFAULT; 
		url += '?olderThan=' + timer
        url += '&count=' + 30

        var userData = LogicData.getUserData();
        var headerToken = undefined
        if(LogicData.isLoggedIn()){
            headerToken = {
                'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                'Content-Type': 'application/json; charset=utf-8',    
            }
        } else{
            headerToken = { 
                'Content-Type': 'application/json; charset=utf-8',    
            }
        }

        NetworkModule.fetchTHUrl(
			url,
			{
				method: 'GET',
				headers: headerToken, 
			},
			(responseJson) => {   

                LogicData.getRemovedRynamicRow().then((delList)=>{  
                    responseJson = responseJson.filter(function(item){
                        for(var i = 0;i<delList.length;i++){ 
                            if(delList[i] == item.time){
                                return false
                            }
                        }
                        return true
                    })  

                    // for(var i = 0; i < responseJson.length; i++){
                    //     responseJson[i].isNew = true;
                    // }  

                    var responseAll = this.state.dataResponse.concat(responseJson)

                    this.setState({ 
                        dataResponse: responseAll,
                        dataSource: this._dataSource.cloneWithRows(responseAll), 
                    })

                    this._pullToRefreshListView.endLoadMore()   

                    })     
			},
			(result) => {
                // Alert.alert('提示', result.errorMessage);
                this._pullToRefreshListView.endLoadMore()   
			}
		)
    }

    _renderActivityIndicator() {
        return ActivityIndicator ? (
            <ActivityIndicator
                style={{marginRight: 10,}}
                animating={true}
                color={ColorConstants.BLUE2}
                size={'small'}/>
        ) : Platform.OS == 'android' ?
            (
                <ProgressBarAndroid
                    style={{marginRight: 10,}}
                    color={ColorConstants.BLUE2}
                    styleAttr={'Small'}/>

            ) :  (
            <ActivityIndicatorIOS
                style={{marginRight: 10,}}
                animating={true}
                color={ColorConstants.BLUE2}
                size={'small'}/>
        )
    } 

}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1,
        backgroundColor: ColorConstants.BGBLUE,
        width:width,
        height:height,
    },
     
    icon: {
      width: 26,
      height: 26,
    },
    title: {
        fontSize: 24,
        margin: 10
    }, 

    itemHeader: {
        height: 35, 
        backgroundColor: 'blue',
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        height: 60, 
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },

    contentContainer: {
        paddingTop: 20 + 44,
    },
    loadText:{
        color:ColorConstants.BLUE2
    }
    

})

export default TabMainScreen;

