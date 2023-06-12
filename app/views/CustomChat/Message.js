import { Icon } from 'native-base';
import React, { useState, useEffect, useRef } from 'react'
import { RefreshControl, ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import { NavigationEvents } from 'react-navigation';
import Background from '../../components/background';
import { PlusBtn } from '../../components/button';
import { ChatCard, DLCard } from '../../components/card';
import { API_URL, default_font, grey_color, light_grey_color, primary_color, red_color, white_color } from '../../components/common';
import { getData } from '../../components/fetch';
import { standard_font_size, xxL, xxS, xxxL, xxxS } from '../../components/font';
import { OriginTextInput } from '../../components/form';
import { styles } from '../../components/styles';
import AppStore from '../../mobx/AppStore';
import io from 'socket.io-client';
import UserStore from '../../mobx/userStore';
import roomLastAttemptStore from '../../mobx/roomLastAttemptStore';
import { set } from 'mobx';
import AsyncStorage from '@react-native-community/async-storage';

const Messages = (props) =>{
    const [user, setuser] = useState(UserStore.UserStore)
    const [rooms, setrooms] = useState([])
    const [token, settoken] = useState(AppStore.token)
    const [loading, setLoading] = useState(false)
    const [lastAttempts, setlastattempts] = useState([])

    const socket = io( API_URL+"/chat", {
        "transports": ["polling","websocket"],
        "query": {
          "token": token
        }
    });
    useEffect(() => {
        syncRooms()
    }, [])
    
    const syncRooms = async() =>{
        setLoading(true)
        var makeAlert = await AsyncStorage.getItem('lastAttempts')
        var arr = makeAlert? JSON.parse(makeAlert): []
        var response = await getData(`${API_URL}/api/v0.1/rooms`)
            var newrooms = []
            if(response.ok){
                response.data.map(res=>{
                    var index = arr ? arr.findIndex(x=>x.id == res._id): null
                    if(index >= 0){
                        getData(`${API_URL}/api/v0.1/rooms/${res._id}/messages/check-latest?timestamp=${arr[index].time}`)
                        .then(result=>{
                            res = {...res, makealert: result.ok? result.data.newer_messages_count: 0}
                        })
                    }else{
                        res = {...res, makealert: true}
                    }
                    newrooms.push(res)
                })
                setrooms(newrooms)
            }
        setLoading(false)
    }

    useEffect(() => {

        socket.on("connect", (data) => {
            // console.log('con', rooms)
            //  console.log("socket connected");
        });
    
        socket.on('message',msg=>{
            var new_message = 0
            var new_msg_room = rooms
            var index = new_msg_room.findIndex(x=> x._id == msg.roomId )
            if(index != -1){
                new_msg_room[index].createdAt = msg.createdAt
                new_msg_room[index].updatedAt = msg.updatedAt
                new_msg_room[index].makealert = new_message+1
            }
            setrooms(new_msg_room)
        })
    }, [rooms])

    const roomenter = (msgroom) =>{
        // roomLastAttemptStore.updateeachAttempt({id: msgroom.roomId, time: new Date()})
        // lastattemptUpdate(roomId, now())
        props.navigation.navigate('CustomChat',msgroom)
    }   

    return(
      <>
        <Background>
            <NavigationEvents onDidFocus={()=>syncRooms()} />
            <View style={{flex: 1, flexDirection: "column", justifyContent: 'center', paddingHorizontal: 20, margin: 10}}>
               
                <ScrollView 
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={() => syncRooms()} />
                    }
                >
                    
                    {
                        rooms.map((room,i)=>(
                        chatuser = room.users.find(x=>x._id != user._id),
                        <TouchableOpacity onPress={()=>roomenter({id: chatuser._id ,roomId: room._id})} key={i}>
                            {
                                room.makealert>0?
                                // i==1?
                                <>
                                    <View style={{padding: 5,marginTop: 10, height: 80, flexDirection: 'row', width: '100%',alignSelf: 'flex-start'}}>
                                        <View style={{flex: 1, justifyContent: 'center', flexDirection: 'column-reverse'}}>
                                            <View style={{ width: 68, height: 68,borderRadius: 70, borderWidth: 1, borderColor: primary_color, paddingVertical: 3,paddingHorizontal: 3}}>
                                                <Image source={{ uri: chatuser.avatar.Location ,
                                                    headers: {
                                                        Authorization: `Bearer ${token}`
                                                    },cache: 'reload'
                                                }} style={styles.imageCircle}
                                                />
                                            </View>
                                            {/* <View style={{ borderRadius: 50 ,alignSelf: 'flex-start', backgroundColor: white_color, marginBottom: -20}}>
                                                <Text style={{color: primary_color,fontWeight: 'bold',marginHorizontal:2, fontSize: 8, fontFamily: default_font}}>{room.makealert}</Text>
                                            </View> */}
                                        </View>               
                                        <View style={{flex:3, justifyContent: 'center', paddingLeft: 20, flexDirection: 'column', alignContent: 'center'}}>
                                            <Text style={
                                                        {color:'black', fontFamily: default_font, fontSize: standard_font_size,fontWeight: 'bold'}
                                                        }>
                                                {chatuser.name}
                                            </Text>
                                        </View>
                                        <View style={{flex:0.5, justifyContent: 'center', flexDirection: 'column', alignContent: 'flex-end'}}>
                                            <Icon name={"primitive-dot"} type={'Octicons'} style={{color: primary_color, fontSize: 30 }}  />
                                        </View>

                                    </View>
                                    <View style={{flexDirection: 'row', borderTopWidth: 0.5, width: '50%', alignSelf: 'center'}}>
                                    </View>
                                </>
                            :
                            <>
                            <View style={{padding: 5,marginTop: 10, height: 80, flexDirection: 'row', width: '100%',alignSelf: 'flex-start'}}>
                                    <Image source={{ uri: chatuser.avatar.Location ,
                                        headers: {
                                            Authorization: `Bearer ${token}`
                                        },cache: 'reload'
                                    }} style={styles.imageCircle}
                                    />
                                        
                                <View style={{flex:3, justifyContent: 'center', paddingLeft: 35, flexDirection: 'column', alignContent: 'center'}}>
                                    <Text style={
                                                {color:primary_color, fontFamily: default_font, fontSize: standard_font_size}
                                                }>
                                        {chatuser.name}
                                    </Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row', borderTopWidth: 0.5, width: '50%', alignSelf: 'center'}}></View>
                            </>
                            }
                        </TouchableOpacity>
                        ))
                    }
                </ScrollView>
            </View>
            {
                user.userType == 'NORMAL'?
                <PlusBtn onPress={()=>props.navigation.navigate('ServiceProviderList')} />
                :<></>
            }
        </Background>
      </>
    )
}
export default Messages;