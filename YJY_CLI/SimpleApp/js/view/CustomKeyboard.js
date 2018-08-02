/* @flow */

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Modal,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
} from 'react-native';
import AnimatedView from './component/AnimatedView';
import CustomStyleText from './component/CustomStyleText';

var {height, width} = Dimensions.get('window');
var SHARE_CONTAINER_HEIGHT = 290;
var SHARE_CONTAINER_WIDTH = width;
var KEYBOARD_HEIGHT = SHARE_CONTAINER_HEIGHT - 50
var BUTTON_HEIGHT = KEYBOARD_HEIGHT / 3;
var BUTTON_WIDTH = SHARE_CONTAINER_WIDTH / 4;

export default class CustomKeyboard extends Component {
  constructor(props){
    super(props)

    this.state = {
      modalVisible: false,
    }
  }

  _setModalVisible(visible, callback) {
    this.setState({modalVisible: visible}, ()=> callback && callback());
  }

  showWithData(data){
    this.setState({
      currentDisplayText: data.value.toString(),
      maxValue: data.maxValue,
      minValue: data.minValue,
      onInputConfirmed: data.onInputConfirmed,
      getMinErrorText: data.getMinErrorText,
      getMaxErrorText: data.getMaxErrorText,
      checkError: data.checkError,
      hasDot: data.hasDot,
      dcmCount: data.dcmCount,
      error: null,
    })
    this._setModalVisible(true, ()=>{     
      this.fadeViewRef.fadeIn(400);
    });
  }

  hide(){
    this.fadeViewRef.fadeOut(210, ()=>{
      this._setModalVisible(false)
    });
  }

  getIsShown(){
    return this.state.modalVisible
  }

  updateErrorText(value){
    this.hasError();
  }

  onTextButtonPressed(textValue){
     
    if (textValue == "." && this.state.currentDisplayText.indexOf(".")!=-1){
      return
    } 

    this.setState({
      currentDisplayText: this.state.currentDisplayText + textValue.toString(),
      error: null,
    })
  }

  onOKButtonPressed(){
    if(!this.hasError()){
      var currentValue = parseFloat(this.state.currentDisplayText);
      if (this.state.onInputConfirmed){
        this.state.onInputConfirmed(currentValue);
      }
      this.hide()
    }
  }

  onDelButtonPressed(){
    var length = this.state.currentDisplayText.length;
    if(length > 0){
      this.setState({
        currentDisplayText: this.state.currentDisplayText.substring(0, length-1),
        error: null,
      });
    }
  }

  hasError(){
    var error = null;
    if(this.state.currentDisplayText.length == 0){
      error = this.state.getEmptyErrorText ? this.state.getEmptyErrorText() : "请输入金额";
    }else{
      var currentValue = parseFloat(this.state.currentDisplayText);

      if (isNaN(currentValue)){
        error = "请输入正确的金额"
      }else{
        console.log("checkError")
        if(this.state.checkError){
          console.log("has checkError")
          error = this.state.checkError(currentValue)

          console.log("checkError error: " + error)
        }
        else if (currentValue>this.state.maxValue){
          error = this.state.getMaxErrorText ? this.state.getMaxErrorText() : "输入金额大于最大值" + this.state.maxValue.toString()
        }
        else if (currentValue<this.state.minValue){
          error = this.state.getMinErrorText ? this.state.getMinErrorText() :   "输入金额小于最小值" + this.state.minValue.toString()
        }
      }
    }
    this.setState({
      error: error,
    })
    return error !== null ;
  }

  renderButton(value, flex){
    if (!flex){
      flex = 1
    }
    return (
      <TouchableOpacity style={[styles.keyboardButton, {flex: flex}]}
        onPress={()=>this.onTextButtonPressed(value)}>
        <CustomStyleText style={styles.buttonTextStyle}>
          {value}
        </CustomStyleText>
      </TouchableOpacity>
    )
  }

  renderDotButton(flex){
    if(this.state.hasDot){
      return this.renderButton(".", flex);
    }
    return (<View></View>)
  }

  renderDelButton(){
    return (
      <TouchableOpacity style={[styles.keyboardButton, styles.delButton]}
        onPress={()=>this.onDelButtonPressed()}>
        <Image style={{height: 23, width:40}} source={require('../../images/delete_button.png')}/>
      </TouchableOpacity>
    )
  }

  renderOKButton(){
    return (
      <TouchableOpacity style={styles.keyboardButton}
        onPress={()=>this.onOKButtonPressed()}>
        <CustomStyleText style={[styles.buttonTextStyle, {fontSize: 27}]}>
          确定
        </CustomStyleText>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {this._setModalVisible(!this.state.modalVisible)}}
        style={{height: height * 2, width: width}}
        >
        <AnimatedView style={{flex:1, width: width}}
          ref={(ref)=> this.fadeViewRef = ref}>
          <TouchableOpacity activeOpacity={1} style={{
              flex:1, 
              width: width,
              backgroundColor: 'rgba(0,0,0,0.7)',              
            }}
            onPress={() => {
              this.hide();
            }}>
            <View style={{flex:1, width: width}}/>
          </TouchableOpacity>
        </AnimatedView>

        <View style={styles.keyboardContainer}>
          <View style={styles.inputBarContainer}>
            <CustomStyleText style={[styles.keyboardTextInput, this.state.error == null ? {} : styles.error]}
              ellipsizeMode="tail" numberOfLines={1}>
              {this.state.currentDisplayText}
            </CustomStyleText>
            <CustomStyleText style={styles.errorHint}>{this.state.error}</CustomStyleText>
          </View>

          <View style={styles.keyboardButtonsContainer}>
            <View style={{flex: 3,}}>
              <View style={styles.keyboardRowContainer}>
                {this.renderButton(1)}
                {this.renderButton(2)}
                {this.renderButton(3)}
              </View>
              <View style={styles.keyboardRowContainer}>
                {this.renderButton(4)}
                {this.renderButton(5)}
                {this.renderButton(6)}
              </View>
              <View style={styles.keyboardRowContainer}>
                {this.renderButton(7)}
                {this.renderButton(8)}
                {this.renderButton(9)}
              </View>
              <View style={styles.keyboardRowContainer}>
                {this.renderButton(0, 2)}
                {this.renderDotButton()}
              </View>
            </View>
            <View style={{flex:1}}>
              {this.renderDelButton()}
              {this.renderOKButton()}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  errorHint:{
    color: '#b54118',
    fontSize: 15,
    textAlign: 'center'
  },
  error:{
    color: '#b54118',
  },
  inputBarContainer: {
    //backgroundColor:'#ecebeb',
    height: 50,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  keyboardContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    //padding: 20,
    backgroundColor: '#ecebeb',
    height: SHARE_CONTAINER_HEIGHT,
  },
  keyboardTextInput:{
    flex:1,
    fontSize: 19
  },
  keyboardButton:{
    flex:1,
    alignSelf:'stretch',
    borderTopWidth: 0.5,
    borderLeftWidth: 0.5,
    borderColor: '#dfdfdf',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#f7f7f7'
  },
  keyboardConfirmButton:{
    width:50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardConfirmText:{
    textAlign:'center'
  },
  delButton: {
    backgroundColor: "#dfdfdf"
  },
  keyboardRowContainer:{
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    flex: 1
  },
  buttonTextStyle: {
    textAlign:'center',
    fontSize:26
  },
  row: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    marginBottom: 20,
  },
  rowTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
  icon: {
    height:40,
    width:40,
  },
  keyboardButtonsContainer: {
    flex: 2,
    flexDirection:'row',
    backgroundColor:'#eeeeee',
  },

  container: {
    flex: 1,
    marginTop: 60
  },
  showtimeContainer: {
   borderTopColor: '#ededed',
    borderTopWidth:1
  },
  showtime: {
   padding:20,
    textAlign: 'center'
  },
});

module.exports = CustomKeyboard;
