import React ,{ useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { type_one_color, white_color, primary_color, secondary_color, reg_color, API_URL, light_grey_color, default_font } from "../../components/common";
import { HomePageBtn } from "../../components/button";
import { S } from "../../components/font";
import { App_Name } from "../../components/labels and messges";

const Home = (props) => {
        return(
            <View style={{flex: 1, width : '100%', height: '100%',backgroundColor: primary_color}}>
                <View style={{flex: 0.7, flexDirection: 'row', justifyContent: 'center', alignItems : 'center'}}>
                    <Text style={{textAlign: 'center'}}>Logo</Text>
                </View>
                <View style={{flex: 1, flexDirection: 'row',backgroundColor: white_color, alignContent: 'center', justifyContent: 'center',borderTopLeftRadius:15,borderTopRightRadius: 20, paddingHorizontal: 20}}>
                    <View style={{flexDirection: 'column'}}>
                        <View style={{flexDirection: 'row', marginVertical: 15}}>
                            <Text style={{textAlign: 'center' , fontSize:  S,fontWeight: 'bold' }}>{App_Name}</Text>
                        </View>
                        <View style={{flexDirection: 'row', marginVertical: 5}}>
                            <HomePageBtn 
                                btnBg={primary_color}
                                onPress={()=>props.navigation.navigate('Login')}
                            >LOGIN</HomePageBtn>
                        </View>
                        <View style={{flexDirection: 'row', marginVertical: 5}}>
                            <HomePageBtn 
                            btnBg={ reg_color }
                            onPress={()=> props.navigation.navigate('ChooseUser')}
                            >REGISTER USER</HomePageBtn>
                        </View>
                        <View style={{flexDirection: 'row', marginVertical: 15, justifyContent: 'space-between'}}>
                            <View style={{ flex:1,flexDirection: 'column', marginRight: 10}}>
                                <HomePageBtn btnBg={secondary_color} color={reg_color} padding={3}
                                onPress={()=>props.navigation.navigate('Demo')}
                                >DEMO VIDEO</HomePageBtn>
                            </View>
                            <View style={{ flex:1, flexDirection: 'column', marginLeft: 10}}>
                                <HomePageBtn btnBg={secondary_color} color={reg_color} padding={3}
                                onPress={()=>props.navigation.navigate('Help')}
                                >NEED HELP</HomePageBtn>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', marginVertical: 5}}>
                            <Text style={{textAlign: 'center' }}>By creating an account, you agreed to Terms & Conditions of our company. Check our Privacy & Policy.</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
}

export default Home;
