import React, { useState, useEffect } from "React";
import { View, Text } from "react-native";
// import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { default_font, primary_color,white_color } from "../components/common";
import { standard_font_size } from "../components/font";

const HelpPage = (props) =>{
    return(
        <View style={{ flexDirection: 'column', justifyContent: 'center', padding: 20, }}>
            {/* <MapView 
                provider={PROVIDER_GOOGLE}
                style={{width: '100%', height: 200}}
                region={{
                    latitude: 16.855146,
                    longitude:  96.175649,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                }}
                zoomEnabled = {true}
            >
                <Marker
                coordinate={{
                    latitude: 16.855146,
                    longitude:  96.175649,
                }}
                />
            </MapView> */}
            <Text style={{fontFamily: default_font, color: white_color, fontSize: standard_font_size}}>Item Detail</Text>
        </View>
    )
}

export default HelpPage;
