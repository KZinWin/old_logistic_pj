import React, { useState, useEffect } from "react";
import { View } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import ModalWrapper from "react-native-modal-wrapper"
import { HomePageBtn } from "./button"
import { light_grey_color } from "./common";

export const MapModal = (props) =>{
    return(
        <ModalWrapper
        containerStyle={{ flexDirection: 'row', alignItems: 'flex-end', padding: 0 }}
        onRequestClose={props.onRequestClose}
        style={{ flex: 1, height: '90%', width: '90%', marginVertical: 0, paddingVertical: 0 }}
        visible={props.visible}
        overlayStyle={light_grey_color}>
            
            <MapView 
                provider={PROVIDER_GOOGLE}
                style={{width: 500,height: '80%'}}
                region={{
                    latitude: props.coordinate.latitude,
                    longitude:  props.coordinate.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02
                }}
                // zoomEnabled = {true}
                onPress={props.onPressMap}
            >
                <Marker
                draggable={props.draggable? props.draggable: false}
                coordinate={props.coordinate}
                onDragEnd={props.markerDragEnd}
                />
            </MapView>
            <View style={{flexDirection: 'row', justifyContent: 'center' ,marginVertical: 5 }}>
                <HomePageBtn
                    width={'40%'}
                    onPress={props.onRequestClose}
                >CLOSE</HomePageBtn>
            </View>
        </ModalWrapper>
    )
}