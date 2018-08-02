'use strict';

import React, { Component} from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  ListView,
  TouchableHighlight,
  Dimensions,
} from 'react-native';

import CustomStyleText from '../CustomStyleText';
var ColorConstants = require('../../../ColorConstants');  
var UIConstants = require('../../../UIConstants');
var NetworkModule = require('../../../module/NetworkModule');
var NetConstants = require('../../../NetConstants');
 
var {height, width} = Dimensions.get('window');
var stockNameFontSize = Math.round(14*width/375.0);
var LS = require('../../../LS')
import LogicData from "../../../LogicData";

var {height, width} = Dimensions.get('window');
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {
		if(r1.security && r2.security){
			if(r1.security.last !== r2.security.last || r1.security.bid !== r2.security.bid || r1.security.ask !== r2.security.ask){
				return true;
			}
		}
		return r1.id !== r2.id || r1.profitPercentage!==r2.profitPercentage || r1.hasSelected!==r2.hasSelected
	}});

export default class ProfitBlock extends Component {
  static propTypes = {
    userId: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    isPrivate: PropTypes.bool.isRequired,
    style: PropTypes.object,
  }

  static defaultProps = {
    userId: 0,
    style: {},
    type: "open",
    isPrivate: false,
    height:236,
  }

  constructor(props) {
    super(props);

    this.state = {
      stockInfo: ds.cloneWithRows([]),
      stockInfoRowData: [],
      statisticsSumInfo: [],
      maxBarSize: 1,
      barAnimPlayed: false,
      contentLoaded: false,
	    isRefreshing: false,
    }

    
  }

  componentDidMount(){
    this.refresh();
  }

  getLastPrice(rowData) {
		var lastPrice = rowData.isLong ? rowData.security.bid : rowData.security.ask
 
		return lastPrice === undefined ? rowData.security.last : lastPrice
	}

  refresh(){
    if(this.props.isPrivate){
      return;
    } 
    this.loadData(); 
    // var moke = [
    //   { id: 36003,symbol: 'USDCAD',name: '美元/加元',pl: 0.5872,rate: 0.7801 ,count:7},
    //   { id: 36003,symbol: 'GOLDS',name: '黄金',pl: 0.3310,rate: 0.4402 ,count:7},
    //   { id: 36003,symbol: 'USDJPY',name: '美元/日元',pl: 0.0898,rate: 0.1604 ,count:12}
    // ]
    // this.setState({
    //   contentLoaded: true,
    //   isRefreshing: false,
    //   stockInfoRowData: moke,
    //   stockInfo: this.state.stockInfo.cloneWithRows(moke),
    //   height:0+UIConstants.LIST_HEADER_BAR_HEIGHT+moke.length*46
    // }); 

  }

  loadData(){

    console.log('ProfitBlock loadData userId = ' + this.props.userId)

    this.setState({
        isRefreshing: true,
    }, ()=>{ 
      var url = NetConstants.CFD_API.PERSONAL_PAGE_PLDIST;
 
      url = url.replace("<id>", this.props.userId);
       

      NetworkModule.fetchTHUrl(
        url,
        {
          method: 'GET', 
          cache: 'none',
        },
        (responseJson) => {
          console.log('===>>>'+responseJson)
          this.setState({
            contentLoaded: true,
            isRefreshing: false,
            stockInfoRowData: responseJson,
            stockInfo: this.state.stockInfo.cloneWithRows(responseJson),
            height:0+UIConstants.LIST_HEADER_BAR_HEIGHT+responseJson.length*46
          });
        },
        (result) => {
          if(!result.loadedOfflineCache){
            this.setState({
              contentLoaded: false,
              isRefreshing: false,
            })
          }
          // Alert.alert('', errorMessage);
        }
	   )
	});
   }

	//,{ id: 36004,symbol: 'NDX',name: '美国科技股100',pl: 36.65,rate: 0.3665 ,count:5}
    //
    //      var moke = [{ id: 36003,symbol: 'SPX',name: '美国标准500',pl: 11.72,rate: 0.2344 ,count:7},{ id: 36003,symbol: 'SPX',name: '美国标准500',pl: 11.72,rate: 0.2344 ,count:7},{ id: 36003,symbol: 'SPX',name: '美国标准500',pl: 11.72,rate: 0.2344 ,count:12}]
    //      this.setState({
    //                  contentLoaded: true,
    //                  isRefreshing: false,
    //                  stockInfoRowData: moke,
    //                  stockInfo: this.state.stockInfo.cloneWithRows(moke),
    //                  height:0+UIConstants.LIST_HEADER_BAR_HEIGHT+moke.length*46
    //                });
    //      });

  renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
		return (
			<View style={styles.line} key={rowID}>
				<View style={styles.separator}/>
			</View>
		);
	}

  renderHeaderBar() {
    var strCP = LS.str('CP')
    var strPJSY = LS.str('PJYK')
    var strZSL = LS.str('ZSL')
    return (
      <View style={styles.headerBar}>
        <View style={[styles.rowLeftPart, {	paddingTop: 5,}]}>
          <CustomStyleText style={styles.headerTextLeft}>{strCP}</CustomStyleText>
        </View>
        <View style={[styles.rowCenterPart]}>
          <CustomStyleText style={[styles.headerTextLeft]}>{strPJSY}</CustomStyleText>
        </View>
        <View style={styles.rowRightPart}>
          <CustomStyleText style={styles.headerTextLeft}>{strZSL}</CustomStyleText>
        </View>
      </View>
    );
  }

  renderRow(rowData, sectionID, rowID, highlightRow) {
		var profitPercentage = rowData.rate
		var profitAmount = rowData.pl
		var bgcolor = 'transparent'
    var topLine = rowData.name
    var bottomLine = rowData.symbol 
		return (
			<View>
				<TouchableHighlight activeOpacity={1}>
					<View style={[styles.rowWrapper, {backgroundColor: bgcolor}]} key={rowID}>
						<View style={styles.rowLeftPart}>
						    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                <CustomStyleText style={styles.stockNameText} allowFontScaling={false} numberOfLines={1}>
                                    {topLine}
                                </CustomStyleText> 
                            </View>
							<View style={{flexDirection: 'row', alignItems: 'center'}}>
								<CustomStyleText style={styles.stockSymbolText}>
									{bottomLine}
								</CustomStyleText>
							</View>
						</View>

						<View style={styles.rowCenterPart}>
							{this.renderProfit(profitAmount * 100, "%")}
						</View>

						<View style={styles.rowRightPart}>
							{this.renderProfit2(profitPercentage * 100, "%")}
						</View>
					</View>
				</TouchableHighlight>
			</View>
		);
	}

    renderProfit(percentChange, endMark) {
		var textSize = Math.round(14*width/375.0)
		percentChange = percentChange.toFixed(2)
		var startMark = percentChange > 0 ? "+":null
		return (
			<CustomStyleText style={[styles.stockPercentText, {color: ColorConstants.stock_color(percentChange), fontSize:textSize}]}>
				 {startMark}{percentChange} {endMark}
			</CustomStyleText>
		);

	}

    renderProfit2(percentChange, endMark) {
            var textSize = Math.round(14*width/375.0)
            percentChange = percentChange.toFixed(2)
            var startMark = percentChange > 0 ? "+":null
            return (
                <CustomStyleText style={[styles.stockPercentText, {fontSize:textSize}]}>
                     {startMark}{percentChange} {endMark}
                </CustomStyleText>
            );

        }

  renderPrivate(){
    var strYHWGKSJ = LS.str('YHWGKSJ')
    return(
        <View style={styles.emptyView}>
           <CustomStyleText style={styles.loadingText}>{strYHWGKSJ}</CustomStyleText>
        </View>
        )
  }

  renderPublic(){

    var strZWYKFB = LS.str('ZWPCJL')
    if(!this.state.contentLoaded){
        return (
            <View></View>
        )
    }else {
        if(this.state.stockInfo.length === 0) {
            return (
                <View style={styles.emptyView}>
                    <CustomStyleText style={styles.loadingText}>{strZWYKFB}</CustomStyleText>
                </View>
                )
        }else{
          return (
            <View style={{height:this.state.height}}>
              <ListView
                style={styles.list}
                ref="listview"
                initialListSize={3}
                dataSource={this.state.stockInfo}
                enableEmptySections={true}
                renderRow={(rowData, sectionID, rowID, highlightRow)=>this.renderRow(rowData, sectionID, rowID, highlightRow)}
                renderSeparator={this.renderSeparator}/> 
              <View style={{position:'absolute',width:width,marginTop:-this.state.height,height:this.state.height,backgroundColor:'transparent'}} />
            </View>
          );
        }
    }
  } 
// 

  renderContent(){
    if(this.props.isPrivate){
        return this.renderPrivate();
    }else{
        return this.renderPublic();
    }

  }

  render() {
    var strYKFB = LS.str('YKFB')
      return (
        <View style={{backgroundColor:'transparent'}}>
            <View>
                <View style={styles.titleRow}>
                    <CustomStyleText style={styles.titleText}>{strYKFB}</CustomStyleText>
                </View>
            </View>
            {/* <View style={styles.separator}/> */}
            {this.renderHeaderBar()}
            {this.renderContent()}
        </View>
      )
  }
}

const styles = StyleSheet.create({ 
  list: {
    alignSelf: 'stretch',
    flex: 1,
  },
  line: {
    height: 0.5,
    backgroundColor: 'white',
  },
  separator: {
    marginLeft: 20,
    marginRight:20,
    height: 0.5,
    backgroundColor: ColorConstants.SEPARATOR_GRAY,
  },
  rowWrapper: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: '#ffffff',
  }, 
	stockNameText: {
		fontSize: stockNameFontSize,
		textAlign: 'center',
		// fontWeight: 'bold',
		lineHeight: 22,
	},
	stockSymbolText: {
		fontSize: 12,
		textAlign: 'center',
		color: '#999999',
		lineHeight: 14,
  },
  rowLeftPart: {
    flex: 3,
    alignItems: 'flex-start',
    paddingLeft: 0,
  },
  rowCenterPart: {
    flex: 3,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 5,
    alignItems: 'flex-end',
  },
	rowRightPart: {
		flex: 2.5,
		paddingTop: 5,
		paddingBottom: 5,
		paddingRight: 0,
		alignItems: 'flex-end',
	},
	headerBar: {
		flexDirection: 'row',
		backgroundColor: 'transparent',
		height: UIConstants.LIST_HEADER_BAR_HEIGHT,
		paddingLeft: 15,
		paddingRight: 15,
		paddingTop:2,
	},
	headerCell: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		// borderWidth: 1,
	},
	headerText: {
		fontSize: 14,
		textAlign: 'center',
		color:'#576b95',
	},

	headerTextLeft: {
		fontSize: 12,
		textAlign: 'left',
		color:'#999999',
	},
	emptyView: {
		flex: 2,
		backgroundColor: 'white',
		alignItems: 'center',
		justifyContent: 'space-around',
		height:180,
	},
    loadingText: {
        fontSize: 13,
        color: '#9f9f9f'
    },
    titleText: {
        fontSize: 15,
        color: '#474747',
    }, 
    titleRow: {
        paddingLeft: 15,
        justifyContent: 'space-around',
        height: 39,
      },
    textCount:{
        fontSize:12,
        color:'#999999'
    }
});

module.exports = ProfitBlock;
