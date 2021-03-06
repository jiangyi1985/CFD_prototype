import React, { Component } from 'react';
import {
  AppRegistry,
  Button,
  View,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ScrollView,
} from 'react-native';
import CustomStyleText from './component/CustomStyleText';
var {height,width} = Dimensions.get('window');
var BUTTON_WIDTH = width - 20;
var BUTTON_HEIGHT = BUTTON_WIDTH / 701 * 132;
var BIG_BUTTON_HEIGHT = BUTTON_WIDTH / 722 * 380;
var bgWidth = width-20; 
import ViewKeys from '../ViewKeys';
import NavBar from './component/NavBar';
import BalanceBlock from './component/BalanceBlock';

var UIConstants = require('../UIConstants');
var ProfitTrendCharts = require('./component/personalPages/ProfitTrendCharts')
var TradeStyleBlock = require('./component/personalPages/TradeStyleBlock')
var TradeStyleCircleBlock = require('./component/personalPages/TradeStyleCircleBlock')
import LoginScreen from './LoginScreen';
import * as Animatable from 'react-native-animatable';
import { fetchMeData, updateUnread } from '../redux/actions'
import { connect } from 'react-redux';
import SubmitButton from './component/SubmitButton';
import LogicData from '../LogicData';

var ColorConstants = require('../ColorConstants');
var {EventCenter, EventConst} = require('../EventCenter')
var WebSocketModule = require('../module/WebSocketModule');
var LS = require('../LS');

var layoutSizeChangedSubscription = null;

//Tab4:我的
class  TabMeScreen extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      userLoggedin: false,
    }
  }

  componentDidMount() {
    layoutSizeChangedSubscription = EventCenter.getEventEmitter().addListener(EventConst.ME_TAB_PRESS_EVENT, () => {
      console.log("ME_TAB_PRESS_EVENT")
      WebSocketModule.cleanRegisteredCallbacks();
			this.refresh();
    }); 
  } 

  componentWillUnmount(){
    layoutSizeChangedSubscription && layoutSizeChangedSubscription.remove()
  }

  userChanged = false

  refresh(){
    console.log("Mepage refresh")
    if(!LogicData.isLoggedIn()){
      this.setState({
        userLoggedin: false,
      })
    }else{
      this.setState({
        userLoggedin: true,
      })
      this.props.fetchMeData();
      this.props.updateUnread();
      
      this.ProfitTrendCharts && this.ProfitTrendCharts.refresh();
      this.tradeStyleCicleBlock && this.tradeStyleCicleBlock.refresh();
      this.tradeStyleBlock && this.tradeStyleBlock.refreshData();
    }
  }

  goToUserConfig(){
    this.props.navigation.navigate(ViewKeys.SCREEN_USER_CONFIG);
  }

  goToHelp(){
    this.props.navigation.navigate(ViewKeys.SCREEN_HELP);
  }

  goToAbout(){
    this.props.navigation.navigate(ViewKeys.SCREEN_ABOUT);
  }

  goToMessage(){
    this.props.navigation.navigate(ViewKeys.SCREEN_MESSAGE);
  }

  goToSettings(){
    this.props.navigation.navigate(ViewKeys.SCREEN_SETTINGS,{onGoBack:()=>{
      this.tradeStyleCicleBlock && this.tradeStyleCicleBlock.refresh()
    }});

  } 
   

  onBalancePressed(){
    //this.props.navigation.navigate(ViewKeys.SCREEN_DEPOSIT_WITHDRAW);
    if(this.props.thtAddress){
      this.props.navigation.navigate(ViewKeys.SCREEN_DEPOSIT_WITHDRAW, {
        onGoBack:()=>this.refresh()
      });
    }else{
      this.props.navigation.navigate(ViewKeys.SCREEN_BIND_PURSE, {
        nextView: ViewKeys.SCREEN_DEPOSIT_WITHDRAW,
        onGoBack:()=>this.refresh()
      });
    }
  }

  renderLogin(){
    return <LoginScreen 
              navigation={this.props.navigation}
              hideBackButton={true} 
              onLoginFinished={()=>{this.refresh()}}
              />;
  }  

  renderSeparator(){
    return <View style={styles.separator}></View>
  }

  renderPortrait(){
    return(
      <TouchableOpacity style={{justifyContent:'center'}}
        onPress={()=>this.goToUserConfig()}>
        <View>
          <Image style={styles.headPortrait} source={this.props.avatarSource}></Image>
          <CustomStyleText style={styles.nickName}>{this.props.nickname}</CustomStyleText>
        </View>
      </TouchableOpacity>
    )
  }

  renderBalance(){

    console.log("getBalanceType", LogicData.getBalanceType())

    return (
      <View style={[styles.bigButtonContainer, styles.radiusBackground]}>
        {/* <ImageBackground source={require('../../images/me_balance_border.png')}
          resizeMode={'contain'}
          style={{
              width: '100%',
              height: '100%',
              justifyContent:'center',
              flexDirection:'column',
          }}> */}
          <View style={styles.topBlockContainer}>
            <View style={styles.balanceRow}>
              <View style={styles.balanceBlock}>
                <CustomStyleText style={styles.balanceValueText}>{this.props.errorMessage ? "--" : this.props.totalProfit.toFixed(2)}</CustomStyleText>
                <CustomStyleText style={styles.balanceLabelText}>{LS.str("SUGAR_PROFIT")}</CustomStyleText>
              </View>
              <View style={styles.balanceBlock}>
                <CustomStyleText style={styles.balanceValueText}>{this.props.errorMessage ? "--" : this.props.total.toFixed(2)}</CustomStyleText>
                <CustomStyleText style={styles.balanceLabelText}>{LS.str("SUGAR_AMOUNT").replace("{1}", LS.getBalanceTypeDisplayText())}</CustomStyleText>
              </View>
              <View style={styles.balanceBlock}>
                <BalanceBlock style={styles.balanceValueText}/>
                <CustomStyleText style={styles.balanceLabelText}>
                  {LS.str("SUGAR_AVAILABLE").replace("{1}", LS.getBalanceTypeDisplayText())}
                </CustomStyleText>
              </View>
            </View>     
            {this.renderSeparator()}        
            <View style={{flex:1, justifyContent:'center'}}>
              <SubmitButton
                style={{height:43, width:235, marginTop: 15, marginBottom: 15,}}
                text={LS.str("ME_DEPOSIT_WITHDRAW")} 
                onPress={()=>this.onBalancePressed()}/>
            </View>
          </View>
        {/* </ImageBackground> */}
        <View>

        {/* <ProfitStatisticsBlock/> */}
        </View>
      </View>
    )
  }

  renderChart(){
    return (
      <View style={[styles.historyChartContainer, styles.radiusBackground]}>
        {/* <ImageBackground style={{height:"100%", width:"100%", justifyContent:'center'}}
          resizeMode='stretch' source={require('../../images/bg_block.png')}> */}
            <ProfitTrendCharts              
              ref={(ref)=>this.ProfitTrendCharts = ref}
              userId={this.props.userId}
              viewHeight={180}
              isPrivate={false}/>          
        {/* </ImageBackground>  */}
      </View>
    );
  }

  renderTradeStyleCicleBlock(){
    return (
      <View style={[styles.TradeStyleCycleContainer, styles.radiusBackground]}>
        {/* <ImageBackground style={{height:"100%", width:"100%", justifyContent:'center'}}
          resizeMode='stretch' source={require('../../images/bg_block.png')}>
            */}
            <TradeStyleCircleBlock 
              ref={(ref)=>this.tradeStyleCicleBlock = ref}
              userId={this.props.userId}
              viewHeight={180}
              isPrivate={false}/>
           
        {/* </ImageBackground>  */}
      </View>
    );
  }

  renderTradeStyleBlock(){
    console.log("this.props.userId", this.props.userId )
    return (
      <View style={[styles.TradeStyleContainer, styles.radiusBackground]}>
        {/* <ImageBackground style={{height:'100%', width:"100%", justifyContent:'center'}} resizeMode='stretch' source={require('../../images/bg_block.png')}>  */}
          <TradeStyleBlock
            ref={(ref)=>this.tradeStyleBlock = ref}
            userId={this.props.userId}
            isPrivate={false} />
        {/* </ImageBackground> */}
      </View>
    );
  }

  renderMessageView(){
    var view = null;
    if(this.props.unread > 0){
      var unreadCount = this.props.unread > 9 ? "9+" : this.props.unread;
      view = (<View style={styles.unreadMessageCount}>
        <CustomStyleText style={{textAlign:'center', fontSize:8, color:'white'}}>{unreadCount}</CustomStyleText>
      </View>);
    }
    return (
      <View style={{alignItems:'center', justifyContent:'center', flex:1}}>
        <View>
          <Animatable.Image animation="pulse" easing="ease-out" iterationCount="infinite" style={styles.messageImage} source={require('../../images/me_messages.png')}/>
          {view}
        </View>
    </View>);
  }

  renderContent(){
    if(this.state.userLoggedin){
      return (
        <ScrollView style={styles.mainContainer}>         
          <View style={styles.backgroundContainer}>
            <Image
              style={styles.backgroundImage}
              source={require("../../images/me_top_background.jpg")}
              resizeMode={'contain'}/>
          </View>
          <NavBar 
            backgroundColor="transparent"
            title=""
            viewOnLeft={this.renderMessageView()}
            leftPartOnClick={()=>this.goToMessage()}
            imageOnRight={require('../../images/me_settings.png')}
            rightPartOnClick={()=>this.goToSettings()}/>
          {this.renderPortrait()}
          {this.renderBalance()} 
          {this.renderChart()}
          {this.renderTradeStyleCicleBlock()}
          {this.renderTradeStyleBlock()}
          <View style={{height:15}}/>
        </ScrollView>);
    }else{
      return this.renderLogin();
    }
  }

  render() {
      return this.renderContent();
  }
}

const styles = StyleSheet.create({
    mainContainer:{
      flex:1,
      flexDirection:'column',
      backgroundColor:ColorConstants.COLOR_MAIN_THEME_BLUE
    },
    backgroundContainer: {
      position:'absolute',
      top:0,
      left:0,
    },
    backgroundImage:{
      width: width,
      height: width / 750 * 438,
    },
    icon: {
      width: 26,
      height: 26,
    },
    smallButtonContainer:{
      height: BUTTON_HEIGHT,
      paddingLeft: 10,
      paddingRight: 10,
      justifyContent: 'center',
    },
    separator: {
      height: 0.5,
      backgroundColor: '#f0f0f0',
      marginLeft:20,
      marginRight:20,
    },
    radiusBackground:{
      backgroundColor:'white',
      borderRadius:UIConstants.ITEM_ROW_BORDER_RADIUS,
    },
    bigButtonContainer:{
      //height: BIG_BUTTON_HEIGHT,
      marginLeft:UIConstants.ITEM_ROW_MARGIN_HORIZONTAL,
      marginRight:UIConstants.ITEM_ROW_MARGIN_HORIZONTAL,
      marginTop:15,
    },
    historyChartContainer:{
      height:240,
      marginLeft:UIConstants.ITEM_ROW_MARGIN_HORIZONTAL,
      marginRight:UIConstants.ITEM_ROW_MARGIN_HORIZONTAL,
      marginTop:15,
      justifyContent:'center',
      alignContent:'center',
      //backgroundColor:'white'
    },
    TradeStyleCycleContainer:{
      height:280,
      marginLeft:UIConstants.ITEM_ROW_MARGIN_HORIZONTAL,
      marginRight:UIConstants.ITEM_ROW_MARGIN_HORIZONTAL,
      marginTop:15,
      justifyContent:'center',
      alignContent:'center',
      //backgroundColor:'white'
    },
    TradeStyleContainer:{
      height:140,
      marginLeft:UIConstants.ITEM_ROW_MARGIN_HORIZONTAL,
      marginRight:UIConstants.ITEM_ROW_MARGIN_HORIZONTAL,
      marginTop:15,
      justifyContent:'center',
      alignContent:'center',
    },
    buttonBackground: {
      width: '100%',
      height: '100%',
      justifyContent:'center',
      flexDirection:'column',
    },
    topBlockContainer: {
      alignItems:'stretch',
      flexDirection:'column',
      flex:1,
    },
    rowContainer: {
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between',
      alignSelf:'stretch',
      flex:1,
    },
    rowLeftTextContainer:{
      flexDirection:'row',
    },
    headPortrait:{
      width:101,
      height:101,
      borderWidth:3,
      borderColor:ColorConstants.BORDER_LIGHT_BLUE,
      borderRadius:50,
      alignSelf:'center'
    },
    nickName: {
      textAlign:'center',
      marginTop:10,
      height:30, 
      fontSize: 19,
      color: ColorConstants.BORDER_LIGHT_BLUE
    },
    balanceRow:{
      flexDirection:'row',
      flex:1,
      marginLeft: 10,
      marginRight: 10,
    },
    balanceBlock:{
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
      flex:1,
    },
    balanceValueText:{
      fontSize:20, 
      color:'black', 
      marginTop:15
    },
    balanceLabelText:{
      fontSize:12, 
      color:'#999999', 
      marginBottom: 15,
    },
    messageImage: {
      width: 21,
      height: 21,
      marginLeft: 20,
      resizeMode: Image.resizeMode.contain,
      marginRight: 8,
      marginTop:10,
      marginBottom:10,
    },
    unreadMessageCount: {
      backgroundColor:'red', 
      width:18,
      height:12, 
      borderRadius:5,
      alignItems:'center',
      justifyContent:'center',
      position:'absolute',
      top:5,
      right:0
    }
})

const mapStateToProps = state => {
  return {
      ...state.meData,
      ...state.balance,
      ...state.settings,
      ...state.message
  };
};

const mapDispatchToProps = {
  fetchMeData,
  updateUnread
};

export default connect(mapStateToProps, mapDispatchToProps)(TabMeScreen);

