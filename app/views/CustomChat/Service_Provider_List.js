import { Icon } from 'native-base';
import React, { useState, useEffect, useRef } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Background from '../../components/background';
import { DLCard, ProfileListCard } from '../../components/card';
import { API_URL, default_font, grey_color, light_grey_color, primary_color, white_color } from '../../components/common';
import { getData } from '../../components/fetch';
import { standard_font_size, xxL, xxS, xxxL, xxxS } from '../../components/font';
import AppStore from '../../mobx/AppStore';

const ServiceProviderList = (props) =>{
    const [list, setlist] = useState([])
    const [userToken, setuserToken] = useState(AppStore.token)

    useEffect(() => {
        getData(`${API_URL}/api/v0.1/customer/service-providers`)
        .then(response => {
            if(response.ok){
                setlist(response.data.data)
            }
        })
    }, [])

    return(
      <>
        <Background>
            <View style={{flex: 1, flexDirection: "column", justifyContent: 'center', paddingHorizontal: 10, margin: 10}}>
               
                <ScrollView>
                
                    {
                        list.map((x,i)=>{
                            return(
                                <ProfileListCard
                                    key={i}
                                    img={{ uri: x.avatar ? `${API_URL}/api/v0.1/files?filename=${x.avatar.Key}&random=${Math.random().toString(36).substring(7)}` :
                                        `${API_URL}/api/v0.1/files?filename=${x.avatar.Key}&random=${Math.random().toString(36).substring(7)}` ,
                                        headers: {
                                            Authorization: `Bearer ${userToken}`
                                        },cache: 'reload'
                                    }} 
                                    name={x.name} onPress={()=>props.navigation.navigate('CustomChat',{id: x._id})} 
                                />
                            )
                        })
                    }
                </ScrollView>
            </View>
        </Background>
      </>
    )
}
export default ServiceProviderList;