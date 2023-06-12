import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { white_color, primary_color, default_font, medium_grey_color, light_grey_color, red_color } from "./common";
import { Icon } from "native-base";
import { xS, standard_font_size, xxL, L } from "./font";
import { styles } from "./styles";

//home page button
export const HomePageBtn = (props) => {
    return (
        <TouchableOpacity style={{ marginHorizontal: props.marginHorizontal, paddingHorizontal: 10, width: props.width ? props.width : '100%', borderWidth: props.borderWidth, height: props.height ? props.height : 45, justifyContent: 'center', borderRadius: 5, backgroundColor: props.btnBg ? props.btnBg : primary_color, padding: props.padding ? props.padding : 10 }}
            onPress={props.onPress} elevation={props.elevation}>
            <View >
                <Text style={{ color: props.color ? props.color : white_color, textAlign: props.textAlign ? props.textAlign : 'center', fontWeight: 'bold', fontFamily: default_font, fontSize: props.fontSize ? props.fontSize : standard_font_size }}> {props.children.toUpperCase()} </Text>
            </View>
        </TouchableOpacity>
    )
}

// customize button
export const CustomizeBtn = (props) =>{
    return(
        <TouchableOpacity style={[{ paddingHorizontal: 10, width: '100%',height: 45, justifyContent: 'center', borderRadius: 5, padding: 10 },props.style]}
            onPress={props.onPress}>
                {props.children}
        </TouchableOpacity>
    )
}


//plus button
export const PlusBtn = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress} style={[styles.floatbottom,props.style]}>
            <Icon name={'pluscircle'} type={'AntDesign'} style={{ fontSize: 45, color: primary_color }} />
        </TouchableOpacity>
    )
}

export const FloatDeleteBtn = (props) =>{
    return(
        <TouchableOpacity onPress={props.onPress} style={[styles.floatbottom,props.style]}>
            <Icon name={'delete-circle'} type={'MaterialCommunityIcons'} style={{ fontSize: 45, color: red_color }} />
        </TouchableOpacity>
    )
}