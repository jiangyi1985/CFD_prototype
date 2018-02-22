
import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  Button,
  View,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';


require('./js/utils/dateUtils')
require('./js/utils/numberUtils')

import { StackNavigator } from 'react-navigation';
import { TabNavigator } from 'react-navigation';
var MyHomeScreen = require('./js/view/MyHomeScreen');
var StockDetailScreen = require('./js/view/StockDetailScreen');
var LoginScreen = require('./js/view/LoginScreen');
var MyHomeScreen3 = require('./js/view/MyHome3Screen');
var TabMainScreen = require('./js/view/TabMainScreen');
var TabMarketScreen = require('./js/view/TabMarketScreen');
var TabRankScreen = require('./js/view/TabRankScreen');
var TabPositionScreen = require('./js/view/TabPositionScreen');
var TabMeScreen = require('./js/view/TabMeScreen');
var SplashScreen = require('./js/view/SplashScreen');
var UserProfileScreen = require('./js/view/UserProfileScreen');

// on Android, the URI prefix typically contains a host in addition to scheme
const prefix = Platform.OS == 'android' ? 'mychat://mychat/' : 'mychat://';

function getCurrentRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRouteName(route);
  }
  console.log("getCurrentRouteName")
  console.log(route)
  return route.routeName;
}

export default class App extends React.Component {
  render() {
    if(Platform.OS == "android"){
      StatusBar.setBarStyle("light-content");
    }
    StatusBar.setTranslucent(true);
    return <SimpleApp uriPrefix={prefix}
      onNavigationStateChange={(prevState, currentState) => {        
        var routeName = getCurrentRouteName(currentState);
        if(routeName == "TabPosition"){
          StatusBar.setBarStyle("dark-content")
        }else{
          StatusBar.setBarStyle("light-content")
        }
      }}
    />;
  }
} 

export const MainScreenNavigator = TabNavigator({
    TabMain: {
        screen: TabMainScreen,
        title:'首页',
    },
    TabMarket: {
        screen: TabMarketScreen
    },
    TabRank: {
        screen: TabRankScreen
    },
    TabPosition: {
      screen: TabPositionScreen,
    },
    TabMe: {
      screen: TabMeScreen
    },
}, {
   tabBarPosition: 'bottom',
   animationEnabled: false,
   swipeEnabled: false,
   backBehavior: 'none',
   tabBarOptions: {
     activeTintColor: '#1b9bec',
     inactiveTintColor:'grey',
     style:{
       backgroundColor: 'white',
     }, 
     labelStyle: {
       fontSize: 12, 
     },
     showIcon:true, 
     indicatorStyle:{height:0},//for android ,remove line on tab
   }, 
});

const SimpleApp = StackNavigator({
    SplashScreen:{ 
      screen: SplashScreen,
      navigationOptions:{
        header:null,
      }
    },
    Home: {
      screen: MainScreenNavigator,
      navigationOptions: {
        // title: '首页',
        header: null, 
      }, 
    }, 
    StockDetail:{
      screen:StockDetailScreen,      
    },
    LoginScreen:{
      screen: LoginScreen
    },
    UserProfileScreen:{
      screen:UserProfileScreen ,
      navigationOptions: { 
      header: null, 
      }, 
    }, 
},  
{
  cardStyle: {
    shadowColor: 'transparent',
  },
  navigationOptions: {
    headerStyle: {
      elevation: 0,
    },
    header: null,
  }
});



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }, 
});