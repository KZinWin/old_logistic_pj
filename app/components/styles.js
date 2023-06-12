import React, { Component } from 'react';
import { View, Dimensions, StyleSheet, Platform } from 'react-native';
import { default_font,primary_color,bg_color,secondary_color,reg_color,type_one_color,type_two_color,type_three_color,grey_color,light_grey_color,white_color,red_color,yellow_color,green_color,medium_grey_color } from './common'
import { standard_font_size, xxxS, xxS, label_font_size, S } from './font';

export const styles = StyleSheet.create({

    SelectStatePicker: {
        backgroundColor: light_grey_color,
        width: '100%', 
        borderRadius: 5, 
        borderColor: grey_color, 
        height: 50, 
        paddingLeft: 20, 
        marginBottom: 15
    },
    FleetLabel: {
        fontSize: label_font_size, 
        marginVertical: 5,
        fontFamily:default_font, 
        color: grey_color
    },
    PackageLabel: {
        flex: 1, 
        height: 50, 
        textAlign: 'center', 
        fontSize: standard_font_size, 
        color: primary_color, 
    },
    smallText: { 
        fontFamily: default_font, 
        color: grey_color, 
        fontSize: xxxS 
    },
    standard_grey_text: {
        color: grey_color, 
        textAlign: 'left', 
        fontFamily: default_font, 
        fontSize: standard_font_size, 
        paddingVertical: 10
    },
    flexWrap: {
        flexDirection: 'row', flexWrap: 'wrap'
    },
    fw_with_spaceAR_mb: {
        flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', paddingBottom: 10 
    },
    fw_with_m20:{ 
        flexDirection: 'row', 
        flexWrap: 'wrap', margin: 20 
    },
    fw_with_pv10:{ 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        paddingVertical : 10
    },
    ExpenseList:{
        flexDirection: 'row',
        width: '90%',
        // marginTop: 20,
        padding: 20, 
        alignSelf: 'center', 
        justifyContent: 'center', 
        margin: 10,
        backgroundColor: white_color,
        borderRadius:10,
        borderColor: light_grey_color,
        borderWidth: 1
    },
    packageSizeLable:{
        color: grey_color, 
        textAlign: 'center', 
        fontFamily: default_font, 
        fontSize: label_font_size 
    },
    headerStyle: { 
        fontFamily: default_font , 
        fontSize: standard_font_size, 
        textAlign: 'center', 
    },

    tableRowStyle: { 
        width: 70,
        flexDirection: 'column',
        justifyContent: 'center' , 
        height: 40, 
        marginHorizontal: 10, 
        alignItems: 'center'
    },

    transparentHeader : {
        flexDirection: 'row', 
        flex: 1,
        backgroundColor: grey_color,
        opacity: 0.5,
        top: 0, 
        height: 40, 
        elevation: 5, 
        position : 'absolute', 
        paddingTop: 10, 
        width: 35
    },

//  radio button
    container: {
        flex:1,
        paddingHorizontal: 15,
        marginBottom: 15,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    radioText: {
        marginHorizontal: 15,
        fontSize: xxS,
        color: primary_color,
        fontFamily: default_font
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: primary_color,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedRb: {
        width: 10,
        height: 10,
        borderRadius: 50,
        backgroundColor: secondary_color,
    },
    mymsg: {
        flexDirection: 'row',
        marginVertical: 5,
        padding: 10, 
        borderRadius: 10, 
        backgroundColor: primary_color, 
        width: '50%',
        alignSelf: 'flex-end',
    },
    othersmsg: {
        flexDirection: 'row',
        marginVertical: 5,
        padding: 10, 
        borderWidth: 0.1, 
        borderRadius: 10, 
        backgroundColor: light_grey_color, 
        width: '50%',
        alignSelf: 'flex-start'
    },
    floatbottom: { 
        flexDirection: 'row', 
        position: 'absolute', 
        bottom: 25, 
        right: 25 
    },
    imageCircle: { width: 60, height: 60, borderRadius: 70 }

});


