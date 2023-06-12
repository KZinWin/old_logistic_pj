import React, { useState, useEffect } from "React";
import { View, Text } from "react-native";
import { default_font, primary_color } from "../components/common";
import WebView from "react-native-webview";
import { standard_font_size } from "../components/font";

const Demo = () =>{
    return(
        <View style={{ flexDirection: 'column', justifyContent: 'center', padding: 20, }}>
            <Text style={{fontFamily: default_font, color: primary_color, fontSize: standard_font_size}}>Demonstration Video</Text>
            <View style={{height: 200, justifyContent: 'center', borderWidth: 1}}>
                {/* <Text style={{textAlign: 'center', fontFamily: default_font, fontSize: standard_font_size}}>YOUTUBE VIDEO</Text> */}
                <WebView source={{ uri: 'https://www.youtube.com/watch?v=TtE_Y1O1w6I' }} />
            </View>
        </View>
    )
}

export default Demo;
