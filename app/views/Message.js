import { Icon } from 'native-base';
import React, { useState, useEffect, useRef } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Background from '../../components/background';
import { ChatCard } from '../../components/card';
import { default_font, grey_color, light_grey_color, primary_color, white_color } from '../../components/common';
import { standard_font_size, xxL, xxS, xxxL, xxxS } from '../../components/font';
import { OriginTextInput } from '../../components/form';

const Messages = (props) =>{

    return(
      <>
        <Background>
            <View style={{flex: 1, flexDirection: "column", justifyContent: 'center', paddingHorizontal: 10, borderRadius: 5, margin: 10, borderWidth: 0.5, borderColor: grey_color}}>
               
                <ScrollView>
                    <TouchableOpacity onPress={()=>props.navigation.navigate('CustomChat')}>
                        <View style={{padding: 5,marginTop: 10, height: 50, flexDirection: 'row', borderWidth: 0.5, borderRadius: 5, backgroundColor: white_color, width: '100%',alignSelf: 'flex-start'}}>
                            <View style={{flex:1, borderWidth: 0.5, alignItems:'center', justifyContent: 'center'}}>
                                <Text style={{fontFamily: default_font}}>Photo</Text>
                            </View>
                            <View style={{flex:3, justifyContent: 'center', flexDirection: 'column', alignContent: 'center'}}>
                                <Text style={{color: primary_color, textAlign: 'center', fontFamily: default_font, fontSize: standard_font_size}}>
                                    Name
                                </Text>
                                <Text style={{color: primary_color, textAlign: 'center', fontFamily: default_font, fontSize: xxxS}}>
                                    message message message ...
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>props.navigation.navigate('CustomChat')}>
                        <View style={{padding: 5,marginTop: 10, height: 50, flexDirection: 'row', borderWidth: 0.5, borderRadius: 5, backgroundColor: white_color, width: '100%',alignSelf: 'flex-start'}}>
                            <View style={{flex:1, borderWidth: 0.5, alignItems:'center', justifyContent: 'center'}}>
                                <Text style={{fontFamily: default_font}}>Photo</Text>
                            </View>
                            <View style={{flex:3, justifyContent: 'center', flexDirection: 'column', alignContent: 'center'}}>
                                <Text style={{color: primary_color, textAlign: 'center', fontFamily: default_font, fontSize: standard_font_size}}>
                                    Name
                                </Text>
                                <Text style={{color: primary_color, textAlign: 'center', fontFamily: default_font, fontSize: xxxS}}>
                                    message message message ...
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </Background>
      </>
    )
}
export default Messages;