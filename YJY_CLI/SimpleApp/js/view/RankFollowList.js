
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  ListView,
  Alert,
} from 'react-native'; 
import LogicData from '../LogicData';
import UserBlock from './component/UserBlock';
import CustomStyleText from './component/CustomStyleText';
var NetworkModule = require('../module/NetworkModule');
var NetConstants = require('../NetConstants');
var UIConstants = require('../UIConstants');
var ColorConstants = require('../ColorConstants')
var {height, width} = Dimensions.get('window');
var listData = []
var LS = require('../LS')
import NetworkErrorIndicator from './component/NetworkErrorIndicator';

export default class  RankFollowList extends React.Component {
    static propTypes = {
        showMeBlock: PropTypes.bool,
    }

    static defaultProps = {
        showMeBlock: false,
    }

    constructor(props){
        super(props);
        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}); 
        this.state = {
            dataSource: ds.cloneWithRows(listData),
            rankListData:[ 
            ],
            isContentLoaded: false,
        };
    }

    componentDidMount () {
         this.onRefresh()
    }

    componentWillUnmount() {
        
    }

    gotoUserProfile(uid,name){ 
        var userData = {
            userId:uid,
            nickName:name,
        }
        this.props.navigation.navigate('UserProfileScreen',{userData:userData})
    }

    onRefresh(){
        this.loadRankData()
    }
 

    loadRankData(){  
        if(LogicData.isLoggedIn()){
                var userData = LogicData.getUserData();
                this.setState({
                    isDataLoading: true,
                }, ()=>{
                    NetworkModule.fetchTHUrl(
                        NetConstants.CFD_API.RANK_FOLLOWING,
                        {
                            method: 'GET',
                            headers: {
                                'Authorization': 'Basic ' + userData.userId + '_' + userData.token,
                                'Content-Type': 'application/json; charset=utf-8',
                            },
                            showLoading: true,
                            cache:'offline'
                        }, (responseJson) => { 
                            const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                            this.setState({
                                rankListData: responseJson,
                                isDataLoading: false,
                                isContentLoaded: true,
                                dataSource: ds.cloneWithRows(responseJson),
                            });
                        },
                        (exception) => {
                            this.setState({
                                isDataLoading: false,
                            })
                            //alert(exception.errorMessage)
                        }
                    );
                })			
            } 
     } 
  

    onPressItem(rowData){
       this.gotoUserProfile(rowData.id,rowData.nickname)
    }

    _renderRow = (rowData, sectionID, rowID) => {
        if(rowID>=0){
            return (<UserBlock 
                style={{borderRadius:10, height:UIConstants.ITEM_ROW_HEIGHT,width:width-30,marginLeft:15,marginBottom:15,backgroundColor:'white',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}
                rowData={rowData} 
                key={rowID}
                onPressItem={(v)=>this.onPressItem(v)}/>);
                 
            // return( 
            //     <TouchableOpacity onPress={()=>this.onPressItem(rowData)} style={{borderRadius:10, height:UIConstants.ITEM_ROW_HEIGHT,width:width-30,marginLeft:15,marginBottom:15,backgroundColor:'white',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
            //         <View style={{flexDirection:'row',alignItems:'center'}}>
            //             <Image style={{height:46,width:46,marginLeft:15,marginBottom:5,borderRadius:23}} source={{uri:rowData.picUrl}}></Image>
            //             <View style={{marginLeft:10,justifyContent:'center'}}>
            //                 <CustomStyleText style={{fontSize:15,color:'#999999'}}>{rowData.nickname}</CustomStyleText>
            //                 <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
            //                     <CustomStyleText style={{fontSize:12, color:'#999999'}}>{LS.str("WINRATE")}</CustomStyleText>
            //                     <CustomStyleText style={{fontSize:14, color:'#666666',fontWeight:'bold'}}>{rowData.winRate.toFixed(2)}%</CustomStyleText>
            //                 </View>
            //             </View>
            //         </View>
            //         <View style={{marginRight:15}}>
            //             <CustomStyleText style={{fontSize:17, fontWeight:'bold',color: ColorConstants.stock_color(rowData.roi)}}>{rowData.roi.toFixed(2)}%</CustomStyleText>
            //         </View> 
            //     </TouchableOpacity>
            // )
        }else{
            return null
        }
        
    }

    renderFooter(){

    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
		return (
			<View style={styles.line} key={rowID}>
				<View style={styles.separator}/>
			</View>
		);
    }
    
    tabPressed(){ 
		this.onRefresh()
	}
    

    renderListAll(){
        return(
            <View style={{flex:1,width:width,backgroundColor:'transparent',marginTop:15}}>
                <ListView
                    enableEmptySections={true}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow} 
                    removeClippedSubviews={false}
                />
            </View>
        )
    }
    render() {  
            if(!this.state.isContentLoaded){
                return(
                    <NetworkErrorIndicator 
                    onRefresh={()=>this.onRefresh()}
                    refreshing={this.state.isDataLoading}/>);
            }else{
                if(this.state.rankListData.length==0){
                    return(
                        <View style={{width:width,height:height-120,alignItems:'center', justifyContent:'center'}}>
                            <Image style={{width:290,height:244,}}source={require('../../images/no_attention.png')}></Image>
                        </View>
                    )
                }else{
                    return(
                        <View style={{flex:1}}> 
                            {this.renderListAll()}
                        </View>
                    )
                } 
            } 
     }
}


const styles = StyleSheet.create({
    list: {
		flex: 1, 
	},
    containerAll:{
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'flex-end', 
        height:198,
        width:width,
        paddingLeft:20,
        paddingRight:20,
    },
    headPortrait:{
        width:48,
        height:48,
        alignSelf:'center'
    },
    textTopUserName:{
        alignSelf:'center',
        marginTop:2,
        color:'#0278c1',
        fontSize:15,
    },
    textTopUserScore:{
        alignSelf:'center',
        marginBottom:2,
        color:'#d8effc',
        fontSize:15,
    },
    textProfit:{
        color:'#ffffff',
        fontSize:15
    },
    textWinRate:{
        fontSize:12,
        color:'#0278c1'
    },
    separator: {
        marginLeft: 15,
        marginRight:0,
        height: 0.5,
        backgroundColor: ColorConstants.SEPARATOR_GRAY,
    },
})



module.exports = RankFollowList;



