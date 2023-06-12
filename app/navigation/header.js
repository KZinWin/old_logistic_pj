import React, { Component } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Icon } from "native-base";
import { white_color, primary_color, default_font, grey_color } from "../components/common";
import { DrawerActions } from "react-navigation-drawer";
import { xxL, xL, xS, M, standard_font_size, S } from "../components/font";
import { styles } from "../components/styles";
import AsyncStorage from '@react-native-community/async-storage';
import roomLastAttemptStore from "../mobx/roomLastAttemptStore";

// simple header 
export const HeaderScreen = (props) => {
    return(
        <View style={{ flexDirection: 'row',height: 43, paddingTop: 12}}>
            <TouchableOpacity style={{ flex: 0.5,alignItems: 'center' }} onPress={()=>props.navigation.dispatch(DrawerActions.toggleDrawer())}>
                <Icon name={'menu'} type={'Entypo'} style={{fontFamily: default_font, fontSize : xL, color: grey_color}}/>
            </TouchableOpacity>
            <View style={{ flex: 2, alignItems: 'center',paddingTop: 3 }}>
                <Text style={styles.headerStyle}>{props.headerText}</Text>
            </View>
            <View style={{flex: 0.5}}>
            {
                props.qrbar?
                <TouchableOpacity style={{ alignItems: 'center' }} onPress={()=>props.navigation.navigate('Qrscanner',{type: props.type})}>
                    <Icon name={'scan1'} type={'AntDesign'} style={{fontFamily: default_font, fontSize : xL, color: grey_color}}/>
                </TouchableOpacity>
                :<></>
            }
            </View>
        </View>

    )
}

//header with back button
export const HeaderBackScreen = (props) => {
    const back = async() =>{
        if(props.navigation.state.routeName == 'CustomChat'){
            var id = await AsyncStorage.getItem('current_room')
            var lastAttempts = await AsyncStorage.getItem('lastAttempts')
            var newArr = JSON.parse(lastAttempts)
            if(newArr){
                var index = newArr.findIndex(x=>x.id == id)
                if(index != -1){
                    newArr[index]={id: id, time: new Date().getTime()}
                }else{
                    newArr.push({id: id, time: new Date().getTime()})
                }
            }else{
                newArr = []
                newArr.push({id: id, time: new Date().getTime()})
            }
            await AsyncStorage.setItem('lastAttempts',JSON.stringify(newArr))
        }
        props.navigation.goBack(null)
    }
    return(
        <View style={{ flexDirection: 'row',height: 43, paddingTop: 12}}>
            <TouchableOpacity style={{ flex: 0.5,alignItems: 'center'}} onPress={()=>back()}>
                <Icon name={'chevron-small-left'} type={'Entypo'} style={[{fontFamily: default_font, fontSize: xxL, color: grey_color},props.iconStyle]}/>
            </TouchableOpacity>
            <View style={{flex: 2, alignItems: 'center',paddingTop: 3}}>
                <Text style={styles.headerStyle}>{props.headerText}</Text>
            </View>
            <View style={{flex: 0.5}}></View>
        </View>

    )
}

//header with title
export const HeaderTitleScreen = (props) => {
    return(
        <View style={{ flexDirection: 'row',height: 43, paddingTop: 12}}>
            <TouchableOpacity style={{ flex: 0.5,alignItems: 'center' }} onPress={()=>props.navigation.goBack(null)}>
                <Icon name={'chevron-small-left'} type={'Entypo'} style={{fontFamily: default_font, fontSize: xxL, color: grey_color}}/>
            </TouchableOpacity>
            <View style={{flex: 2, alignItems: 'center',paddingTop: 3}}>
                <Text style={styles.headerStyle}>{props.headerText}</Text>
            </View>
            <View style={{flex: 0.5}}></View>
        </View>

    )
}

//header for anonymousStack
export const HeaderCallBackHome = (props) =>{
    return(
        <View style={{ flexDirection: 'row',height: 43, paddingTop: 12}}>
            <TouchableOpacity style={{ flex: 0.5,alignItems: 'center' }} onPress={()=>props.navigation.navigate('Home')}>
                <Icon name={'menu'} type={'Entypo'} style={{fontFamily: default_font, fontSize : xL, color: grey_color}}/>
            </TouchableOpacity>
            <View style={{flex: 2, alignItems: 'center',paddingTop: 3}}>
                <Text style={styles.headerStyle}>{props.headerText}</Text>
            </View>
            <View style={{flex: 0.5}}></View>
        </View>
    )
}

// plus header 
export const HeaderPlusScreen = (props) => {
    return(
        <View style={{ flexDirection: 'row',height: 43, paddingTop: 12}}>
            <TouchableOpacity style={{ flex: 0.5,alignItems: 'center' }} onPress={()=>props.navigation.dispatch(DrawerActions.toggleDrawer())}>
                <Icon name={'menu'} type={'Entypo'} style={{fontFamily: default_font, fontSize : xL, color: grey_color}}/>
            </TouchableOpacity>
            <View style={{flex: 2, alignItems: 'center',paddingTop: 3}}>
                <Text style={styles.headerStyle}>{props.headerText}</Text>
            </View>
            <View style={{flex: 0.5}}>
                {/* <TouchableOpacity style={{flex: 1,alignItems: 'center',paddingTop: 5 }}  onPress={props.onPress}>
                    <Icon name={'plus'} type={'SimpleLineIcons'} style={{fontFamily: default_font, fontSize: M, color: grey_color }}/>
                </TouchableOpacity> */}
            </View>
        </View>
    )
}

// transparent header 
export const TransparentHeader = (props) => {
    return(
        <View style={styles.transparentHeader}>
            <TouchableOpacity style={{ flex: 0.5,alignItems: 'center'}} onPress={()=>props.navigation.goBack(null)}>
                <Icon name={'chevron-small-left'} type={'Entypo'} style={{fontFamily: default_font, fontSize: S, color: grey_color}}/>
            </TouchableOpacity>
            
        </View>
    )
}