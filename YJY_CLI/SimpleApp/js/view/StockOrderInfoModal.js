'use strict';

import React, { Component } from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	Modal,
    TouchableOpacity,
	Platform,
} from 'react-native';

var StockOrderInfoBar = require('./StockOrderInfoBar')
var {height, width} = Dimensions.get('screen');
import AnimatedView from './component/AnimatedView';
import AnimatedCoinView from './component/AnimatedCoinView';

var UIConstants = require('../UIConstants');
const BODY_HORIZON_MARGIN = Platform.OS === 'ios' ? 15 : 20;
const BODY_BOTTOM_MARGIN = 30;
const CONTENT_WIDTH = width - BODY_HORIZON_MARGIN * 2 - 2 - BODY_BOTTOM_MARGIN * 2;

// create a component
class StockOrderInfoModal extends Component {
    constructor(props){
        super(props);

        this.state = {
            modalVisible: false,
			orderData: null,
			showCoinView: false,
        };
    }

    show(orderData, callback) {
		var state = {
			modalVisible: true,
			hideCallback: callback,
		};
		if (orderData !== null) {
			state.orderData = orderData;
		}
		this.setState(state, ()=>{
			this.setState({
				showCoinView: true,
			})
			this.fadeViewRef.fadeIn(500)			
		});
	}

	hide() {
		this.state.hideCallback && this.state.hideCallback();
		this.setState({
			modalVisible: false,
		});
	}

	onContainerPress(){
		this.props.onContainerPress && this.props.onContainerPress();
	}


	_setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

	renderDialog(){
		return(
			<AnimatedView style={{flex:1, width: width}}
				ref={(ref)=> this.fadeViewRef = ref}>
				<TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={()=>this.hide()}>
					<View style={styles.modalContainer}>
						<TouchableOpacity onPress={()=>this.onContainerPress()}>
							{this.renderContent()}
						</TouchableOpacity>
						{this.renderCoinView()}
					</View>
				</TouchableOpacity>
			</AnimatedView>
		)
	}

	renderCoinView(){
        if(this.state.showCoinView){
			console.log("renderCoinView")
			return (
				<AnimatedCoinView 
					style={{position:'absolute', top:0, left:0, right:0, bottom:0}}
                	onAnimationFinished={()=>{
                    	console.log("renderCoinView onAnimationFinished")
                    	this.setState({
                        	showCoinView:false,
	                    })
					}}
					contentHeight={height - UIConstants.STATUS_BAR_ACTUAL_HEIGHT}
				/>);
		}
    }

	renderContent(){
		return (
            <StockOrderInfoBar 
                orderData={this.state.orderData}				
                width={CONTENT_WIDTH}
                bigMargin={false}/>
        );
	}

    render() {
        return (        
            <Modal
                transparent={true}
                visible={this.state.modalVisible}
                animationType={"slide"}
                style={{height: height, width: width}}
                onRequestClose={() => {this._setModalVisible(false)}}>
				{this.state.modalVisible ? this.renderDialog() : null}
            </Modal>
		);
    }
}

var styles = StyleSheet.create({
	container: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
	},

    modalBackground: {
        width:width,
        height:height,
		backgroundColor:'rgba(0, 0, 0, 0.7)',
    },

	modalContainer:{
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		height: height + (Platform.OS === 'android' ? 20 : 0),
		width: width,
	},
});


export default StockOrderInfoModal;
