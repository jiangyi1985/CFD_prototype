//import liraries
import React, { Component } from 'react';
import { View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ImageBackground,
    Keyboard,
    Platform,
    Image,
    Dimensions,
    KeyboardAvoidingView
} from 'react-native';
import CustomStyleText from '../component/CustomStyleText';
import NavBar from '../component/NavBar';
var {height,width} = Dimensions.get('window');
var ColorConstants = require('../../ColorConstants');
var NetworkModule = require("../../module/NetworkModule");
var NetConstants = require("../../NetConstants");
import LogicData from "../../LogicData";
import ViewKeys from '../../ViewKeys';
import SubmitButton from '../component/SubmitButton';
var LS = require("../../LS");
import { connect } from 'react-redux';

import { fetchBalanceData } from "../../redux/actions/balance";
// create a component
class WithdrawTokenScreen extends Component {
    constructor(props){
        super(props)

        this.state = {
            balance: 0,
            balanceText: "...",
            withdrawStringValue: "",
            withdrawValue: 0,
            isAgreementRead: false,
            isButtonEnable: false,
            isRequestSending: false,
            precision:0,
        }
    }

    componentWillMount(){
        this.props.fetchBalanceData();
        this.getDecimalPlace();
    }

    updateButtonStatus(){
        this.setState({
            isButtonEnable: this.isReadyToPay()
        })
    }

    isReadyToPay(){
        return this.state.withdrawValue > 0 
                && this.state.withdrawValue <= this.props.balance
                && this.state.isAgreementRead
                && !this.state.isRequestSending
                && this.props.thtAddress != undefined
                && this.props.thtAddress != "";
    }

    onWithdrawAllPressed(){
        this.updatePaymentAmount("" + this.props.balance)
    }

    cutToDecimal(inputValue){
        var re = new RegExp('^\\d+\\.?\\d{0,' + this.state.precision + '}');
        if(this.state.precision == 0 ){
            re = new RegExp('^[0-9]+');
        }
        var cutWithdrawValue = inputValue.match(re);
        if(cutWithdrawValue && cutWithdrawValue.length > 0){
            return cutWithdrawValue[0];
        }else{
            var floatValue = parseFloat(inputValue);
            return "" + floatValue;
        }
    }

    updatePaymentAmount(withdrawValue){
        var state = {
            withdrawStringValue: withdrawValue
        };

        if(withdrawValue){
            console.log("this.state.precision", this.state.precision)

            state.withdrawStringValue = this.cutToDecimal(withdrawValue);
            state.withdrawValue = parseFloat(state.withdrawStringValue);

            // var re = new RegExp('^\\d+\\.?\\d{0,' + this.state.precision + '}');
            // if(this.state.precision == 0 ){
            //     re = new RegExp('^[0-9]+');
            // }


            // var cutWithdrawValue = withdrawValue.match(re);
            // if(cutWithdrawValue && cutWithdrawValue.length > 0){
            //     state.withdrawValue = parseFloat(cutWithdrawValue[0]);
            //     if(!state.withdrawValue){
            //         state.withdrawValue = 0
            //     }
            //     state.withdrawStringValue = cutWithdrawValue[0];
            // }else{
            //     state.withdrawValue = parseFloat(withdrawValue);
            //     if(!state.withdrawValue){
            //         state.withdrawValue = 0
            //     }
            //     state.withdrawStringValue = "" + state.withdrawValue;
            // }
            

            // // console.log("cutWithdrawValue", cutWithdrawValue);
            // // console.log("withdrawValue", cutWithdrawValue)
            // console.log("state.withdrawValue", state.withdrawValue);
            // console.log("state.withdrawStringValue", state.withdrawStringValue);
        }else{
            state.withdrawValue = 0;
        }     

        this.setState(state, ()=>this.updateButtonStatus())
    }

    getDecimalPlace(){
        var userData = LogicData.getUserData();
        NetworkModule.fetchTHUrl(
            NetConstants.CFD_API.WITHDRAW_DECIMAL_PLACE,
            {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                },
            },
            (response )=>{
                for(var i in response){
                    if(response[i].code == LogicData.getBalanceType()){
                        this.setState({
                            precision:response[i].precision
                        });
                    }
                }
            },
            (error)=>{
                console.log("WITHDRAW_DECIMAL_PLACE error", error);
                
            });
    }

    withdraw(){
        if(this.isReadyToPay()){
            this.setState({
                isRequestSending: true,
            }, ()=>{
                this.updateButtonStatus();
                var userData = LogicData.getUserData();

                NetworkModule.fetchTHUrl(
                    NetConstants.CFD_API.WITHDRAW_BALANCE,
                    {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                            'Content-Type': 'application/json; charset=UTF-8'
                        },
                        body: JSON.stringify({
                            "amount": this.state.withdrawValue,
                        }),
                    },
                    (response )=>{
                        var backFrom = this.props.navigation.state.key;
                        var onGoBack = ()=>{};
                        if(this.props.navigation.state.params){
                            if(this.props.navigation.state.params.backFrom){
                                backFrom = this.props.navigation.state.params.backFrom;
                            }
                            if(this.props.navigation.state.params.onGoBack){
                                onGoBack = this.props.navigation.state.params.onGoBack
                            }
                        }
                        this.props.navigation.navigate(ViewKeys.SCREEN_WITHDRAW_SUBMITTED, {
                            backFrom: backFrom,
                            onGoBack: onGoBack,
                        });
                    },
                    (error)=>{
                        console.log("withdraw balance", error);
                        alert(error.errorMessage)
                        this.setState({
                            isRequestSending: false,
                        }, ()=>{
                            this.updateButtonStatus();
                        });
                    });
            })            
        }
    }

    renderAgreement(){
        var checkIcon;
        if(this.state.isAgreementRead){
            checkIcon = require("../../../images/selection_small_selected.png");
        }else{
            checkIcon = require("../../../images/selection_small_unselected.png");
        }
        return (
            <TouchableOpacity style={{flexDirection:'row', marginBottom:15, marginTop:15}} onPress={()=>{
                    this.setState({
                        isAgreementRead: !this.state.isAgreementRead
                    },()=>this.updateButtonStatus())
                }}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Image style={{height:15, width:15}}
                        source={checkIcon}/>
                    <CustomStyleText>
                        {LS.str("WITHDRAW_READ_AGREEMENT")}
                        <CustomStyleText onPress={this.onLinkPress} style={{color: ColorConstants.COLOR_MAIN_THEME_BLUE}}>
                        {LS.str("WITHDRAW_AGREEMENT")}
                        </CustomStyleText>
                        。
                    </CustomStyleText>                   
                </View>
            </TouchableOpacity>);
    }

    renderPurseAddress(){
        if(this.props.thtAddress && this.props.thtAddress != ""){
            return (
                <View style={styles.rowContainer}>
                    <CustomStyleText style={{fontSize:17}}>{LS.str("WITHDRAW_ADDRESS_HINT")}</CustomStyleText>
                    <CustomStyleText style={{color:"#7d7d7d", fontSize:15, marginTop:10}}>{this.props.thtAddress}</CustomStyleText>
                </View>);
        }else{
            return null;
        }
    }

    render(){
        if(Platform.OS == "ios"){
            return (            
                <KeyboardAvoidingView style={{width:width,
                    flex:1}}
                    behavior={"padding"}>
                    {this.renderContent()}
                </KeyboardAvoidingView>
            );
        } else {
            return (            
                <KeyboardAvoidingView style={{width:width,
                    flex:1}}
                    >
                    {this.renderContent()}
                </KeyboardAvoidingView>
            );
        }
    }

    renderContent() {
        var balanceValue;
        if(this.props.isBalanceLoading){
            balanceValue = "--";
        }else{
            balanceValue = this.cutToDecimal(""+this.props.balance);
        }

        return (
            <TouchableWithoutFeedback style={styles.container} 
                onPress={()=>{
                    Keyboard.dismiss()
                }}>
                <View style={styles.container} >
                    <NavBar title={LS.str("ME_WITHDRAW_TITLE")}
                        showBackButton={true}
                        backgroundGradientColor={ColorConstants.COLOR_NAVBAR_BLUE_GRADIENT}
                        navigation={this.props.navigation}
                    />
                    <View style={{flex:1, paddingLeft: 15, paddingRight: 15}}>
                        {this.renderPurseAddress()}
                        <View style={styles.rowContainer}>
                            <CustomStyleText style={{fontSize:15, color:"#7d7d7d"}}>{LS.str("WITHDRAW_AMOUNT")}</CustomStyleText>
                            <View style={styles.withdrawValueRow}>
                                <CustomStyleText style={{fontSize:20, fontWeight:"bold", marginRight:15}}>{LS.str("WITHDRAW_BTH").replace("{1}", LS.getBalanceTypeDisplayText())}</CustomStyleText>
                                <TextInput 
                                    underlineColorAndroid={"transparent"}
                                    style={{fontSize:40, flex:1,}}
                                    keyboardType='numeric' 
                                    onChangeText={(withdrawValue)=>this.updatePaymentAmount(withdrawValue)}
                                    value={this.state.withdrawStringValue}/>
                            </View>
                            <CustomStyleText style={{color:"#7d7d7d", fontSize:14}}>
                                {LS.str("WITHDRAW_AVAILABLE_AMOUNT").replace("{1}", balanceValue).replace("{2}", LS.getBalanceTypeDisplayText())}
                                <CustomStyleText onPress={()=>this.onWithdrawAllPressed()} style={{color:ColorConstants.COLOR_MAIN_THEME_BLUE}}>{LS.str("WITHDRAW_ALL")}</CustomStyleText>
                            </CustomStyleText>
                        </View>
                        <View style={{flex:1}}/>
                        {this.renderAgreement()}
                        <SubmitButton 
                            style={{marginBottom:10}}
                            enable={this.state.isButtonEnable}
                            onPress={()=>this.withdraw()}
                            text={this.state.isRequestSending ? LS.str("VERIFING") : LS.str("WITHDRAW_WITHDRAW")} />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    withdrawValueRow:{
        flexDirection:'row', 
        alignItems:'center',
        justifyContent:'center',
        marginTop:15,
        marginBottom:15,
    },
    rowContainer: {
        padding: 15, 
        borderWidth: 1, 
        borderColor: "#dddddd",
        borderRadius: 10,
        marginTop: 15,
    }
});

const mapStateToProps = state => {
    return {
        ...state.balance,
        ...state.meData,
    };
};

const mapDispatchToProps = {
    fetchBalanceData
};

var connectedComponent = connect(mapStateToProps, mapDispatchToProps)(WithdrawTokenScreen);

export default connectedComponent;
module.exports = connectedComponent;