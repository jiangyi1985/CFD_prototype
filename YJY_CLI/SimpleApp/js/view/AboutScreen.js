//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet} from 'react-native';

import NavBar from "./component/NavBar"

// create a component
class AboutScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <NavBar title="关于" showBackButton={true} navigation={this.props.navigation}/>
                <View style={{
                    flex:1,
                    justifyContent: 'center',
                    alignItems: 'center',}}>
                    <Text>AboutScreen</Text>
                </View>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

//make this component available to the app
export default AboutScreen;