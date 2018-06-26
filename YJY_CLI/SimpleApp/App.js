
import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions
} from 'react-native';

var {height, width} = Dimensions.get('window');
require('./js/utils/dateUtils')
require('./js/utils/numberUtils')
import { NavigationActions } from 'react-navigation';
var StorageModule = require('./js/module/StorageModule');
import LogicData from './js/LogicData';
import Orientation from 'react-native-orientation';

var WebSocketModule = require('./js/module/WebSocketModule');
var {EventCenter, EventConst} = require('./js/EventCenter');

var Locale = require('react-native-locale');
import {SimpleApp, ViewKeys} from './AppNavigatorConfiguration';
// on Android, the URI prefix typically contains a host in addition to scheme
const prefix = Platform.OS == 'android' ? 'mychat://mychat/' : 'mychat://';

function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }

  console.log("navigationState ", navigationState)
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  console.log("getCurrentRouteName")
  console.log(route)
  return route.routeName;
}

class App extends React.Component {
  logOutOutsideAppSubscription = null;
  componentWillMount(){
    Orientation.lockToPortrait();
    
    this.startupJobs()
  }

  startupJobs(){
    StorageModule.loadLanguage().then((locale)=>{
      if(locale==undefined){
        var localConstants = Locale.constants();
        locale = localConstants.localeIdentifier;
        if(Platform.OS == "ios"){
          var language;
          if(localConstants.preferredLanguages && localConstants.preferredLanguages.length){
            locale = localConstants.preferredLanguages[0];
          }
        }
        StorageModule.setLanguage(locale);
      }
      LogicData.setLanguage(locale);
      LogicData.getRemovedRynamicRow();
    });    

    WebSocketModule.start();
    
    StorageModule.loadUserData().then((data)=>{
      if(data!=undefined){
        var userData = JSON.parse(data)
        LogicData.setUserData(userData);
      }
    });
    
    const backAction = NavigationActions.back({});

    const navigateAction = NavigationActions.navigate({
      routeName: ViewKeys.SCREEN_LOGIN,
      params: {
        onLoginFinished: ()=>{
          this.appNavigator.dispatch(backAction);
        }
      }
    });

    this.logOutOutsideAppSubscription = EventCenter.getEventEmitter().addListener(EventConst.ACCOUNT_LOGIN_OUT_SIDE, () => {
      console.log("ACCOUNT_LOGIN_OUT_SIDE")
      LogicData.logout(()=>{          
        this.appNavigator.dispatch(navigateAction)
      });
    });
  }

  render() {
    if(Platform.OS == "android"){
      StatusBar.setBarStyle("light-content");
      StatusBar.setTranslucent(true);
    }
    return <SimpleApp 
      style={{height: height, width: width}}
      ref={(ref)=>this.appNavigator = ref}
      uriPrefix={prefix}
      onNavigationStateChange={(prevState, currentState) => {        
        StatusBar.setBarStyle("light-content");
        var routeName = getCurrentRouteName(currentState);
        console.log("routeName ", routeName)
        switch(routeName){
          case ViewKeys.TAB_MAIN:
            EventCenter.emitHomeTabPressEvent();
            break;
          case ViewKeys.TAB_MARKET:
            EventCenter.emitStockTabPressEvent();
            break;
          case ViewKeys.TAB_RANK:
            EventCenter.emitRankingTabPressEvent();
            break;
          case ViewKeys.TAB_POSITION:
            EventCenter.emitPositionTabPressEvent();
            break;
          case ViewKeys.TAB_ME:
            EventCenter.emitMeTabPressEvent();
            break;
          default:
            break;
        }     
      }}
    />;
  }
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }, 
  icon: {
    width: 26,
    height: 26,
  },
});

export default App;