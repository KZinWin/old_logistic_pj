
import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay';
import { primary_color } from './common'
const Loading =(props) => {
    return (
        <View style={styles.container}>
            <Spinner
                visible={props.visible}
                textContent={props.textContent ? props.textContent : "Loading..."}
                textStyle={styles.spinnerTextStyle}
                color={primary_color}
            />
        </View>
    )
}
const styles = StyleSheet.create({
   spinnerTextStyle: {
       color: primary_color
   },
   container: {
       justifyContent: 'center',
       alignItems: 'center',
       backgroundColor: '#F5FCFF',
       elevation: 10
   },
});

export default Loading;