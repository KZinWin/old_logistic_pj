import React, { useState, useEffect } from "React";
import { View, Text } from "react-native";
import { grey_color, default_font, primary_color } from "../components/common";
import { Icon } from "native-base";
import { styles } from "../components/styles";
import { L, standard_font_size } from "../components/font";

const ParcelDetail = () =>{
    return(
        <View style={{flexDirection: 'column', padding: 20}}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: primary_color }}>
                <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, textDecorationLine: "underline"}}>
                    Parcel Information
                </Text>
                <View style={styles.flexWrap}>
                    <View style={{width: '50%'}}>
                        <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                            Parcel form
                        </Text>
                        <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                            Parcel to
                        </Text>
                        <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                            Packing size
                        </Text>
                        <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                            Courier date
                        </Text>
                    </View>
                    <View style={{width: '40%'}}>
                        <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                            East Dagon
                        </Text>
                        <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                            Kamayut
                        </Text>
                        <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                            18 x 34
                        </Text>
                        <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                        4 Oct 2019
                        </Text>
                    </View>
                </View>
            </View>
            <View style={{ paddingVertical: 10}}>
                <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, textDecorationLine: "underline"}}>
                    Courier Information
                </Text>
                <View style={styles.flexWrap}>
                    <View style={{width: '50%'}}>
                        <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                            Courier Photo
                        </Text>
                    </View>
                    <View style={{with: '50%', height: 50, borderWidth: 0.5, padding: 10, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name={'camera'} type={'Entypo'} style={{ color: grey_color, fontSize: L }} />
                    </View>
                    <Text style={{color: grey_color, width: '50%', textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                        Courier Name
                    </Text>
                    <Text style={{color: grey_color, width: '50%', textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                        Aung Myo Thet
                    </Text>
                    <Text style={{color: grey_color, width: '50%', textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                        Courier Phone
                    </Text>
                    <Text style={{color: grey_color, width: '50%', textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                        097785446446
                    </Text>
                    <Text style={{color: grey_color, width: '50%', textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                        Courier Company
                    </Text>
                    <Text style={{color: grey_color, width: '50%', textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                        Trifinity
                    </Text>
                </View>
            </View>
        </View>
    )
}
export default ParcelDetail;