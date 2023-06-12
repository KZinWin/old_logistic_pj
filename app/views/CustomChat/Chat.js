import { Icon } from 'native-base';
import React, { useState, useEffect, useRef } from 'react'
import { BackHandler, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Background from '../../components/background';
import { API_URL, default_font, grey_color, light_grey_color, primary_color, white_color } from '../../components/common';
import { xxL, xxS, xxxL, xxxS } from '../../components/font';
import { OriginTextInput } from '../../components/form';
import io from 'socket.io-client';
import AppStore from '../../mobx/AppStore';
import { styles } from '../../components/styles';
import { CustomizeBtn } from '../../components/button';
import { getData } from '../../components/fetch';
import UserStore from '../../mobx/userStore';
import AsyncStorage from '@react-native-community/async-storage';

const CustomChat = (props) =>{
    const [new_msg, setnew_msg] = useState('')
    const [my_msgs, setmy_msgs] = useState([])
    const [messages, setmessages] = useState([])
    const [providerId, setproviderId] = useState('')
    const [roomId, setroomId] = useState(null)
    const [userToken, setUserToken] = useState(AppStore.token)
    const [ nextpage, setNextPage] = useState(0)
    const [loading, setloading]= useState(false)
    const userId = UserStore.UserStore._id
    const scrollViewRef = useRef();
    // socket
    const socket = io( API_URL+"/chat", {
      transports: ["polling","websocket"],
      query: {
        token: userToken
      }, 
      secure: true, reconnection: true, rejectUnauthorized: false , upgrade: true
    });

    const _handleScroll=()=> {
      setloading(true)
          if(nextpage){
            getData(`${API_URL}/api/v0.1/rooms/${roomId}/messages?page=${nextpage}`)
            .then(response =>{
              if(response.ok){
                 var newarr = messages
                  setNextPage(response.data.links.next)
                  response.data.data.map(x=>{
                    newarr.unshift(x)
                  })
                  
                    setmessages(JSON.parse(JSON.stringify(newarr)))
                  }
            })
          }
          setloading(false)
      // }
  }

    useEffect(() => {
    var provider_id = props.navigation.getParam('id')
    if(props.navigation.getParam('roomId')){
      AsyncStorage.setItem('current_room', props.navigation.getParam('roomId'))
    }
    if(provider_id && props.navigation.getParam('roomId') == undefined){
      getData(`${API_URL}/api/v0.1/rooms`)
        .then(response => {
          var room = response.data.find(x=>x.userIds.find(j=> j == provider_id))
          if(room){
            setroomId(room._id)
            
          }
          
        })
        setproviderId(provider_id)
    }
      setroomId(props.navigation.getParam('roomId'))
      setproviderId(provider_id)
    }, [])

    useEffect(() => {
      
      getData(`${API_URL}/api/v0.1/rooms/${roomId}/messages`)
      .then(response =>{

        if(response.ok){
            
            setNextPage(response.data.links.next)
              setmessages(response.data.data.reverse())
            }
      })
    }, [roomId])


    useEffect(() => {
      
        var newmsgarr = messages
         socket.on("connect", (data) => {
          //  console.log("socket connected");
         });
   
         socket.on('message',msg=>{
           if(msg.userId != userId){
             var cond_not_to_repeat = newmsgarr.find(x=>x.createdAt == msg.createdAt)
             if(!cond_not_to_repeat){
               newmsgarr.push(msg)
                 setmessages(newmsgarr)
                 setroomId(msg.roomId)
             }
           }
         })
    }, [messages, roomId])
    // back
    const back = async() => {
      var id = roomId
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
      props.navigation.goBack(null)
    }

    useEffect(() => {
      BackHandler.addEventListener("hardwareBackPress", ()=>back());
  
      return () =>
        BackHandler.removeEventListener("hardwareBackPress", ()=>back());
    }, []);
    
    // message emit 
    const emitmessage = async() =>{
      
      if(new_msg != ''){
        var room_id = roomId 
      socket.on('connect',()=>{
          // console.log(socket.connected)
        
        socket.on('error',(error)=>{
          console.log(error)
        })

          socket.emit("message",
          {
            to: providerId,
            message : new_msg,
            roomId : room_id
          }
          );

      socket.on('disconnect', (reason) => {
        if (reason === 'io server disconnect') {
          // the disconnection was initiated by the server, you need to reconnect manually
          socket.connect();
        }
        // else the socket will automatically try to reconnect
      });
      socket.on('reconnect_attempt', () => {
        socket.io.opts.query = {
          token: userToken
        }
      });
      
      socket.on('message',async (msg)=>{
        room_id = msg.roomId
        if (roomId == undefined || roomId == null){
          await setroomId(JSON.parse(JSON.stringify(msg.roomId)))
        }
       
      })
    
      })
      messages.push({
        to: providerId,
        message : new_msg,
        roomId : roomId,
        userId: userId
    })
    setmessages(JSON.parse(JSON.stringify(messages)))
    setnew_msg('')
    }

  }

    return(
      <>
        <Background>
            <View style={{flex: 1, flexDirection: "column", justifyContent: 'center', padding: 10}}>
               
                    <View style={{height: '90%',padding: 5, marginTop: 5, flexDirection: "column-reverse", justifyContent: 'flex-end'}}>
                        <ScrollView style={{marginBottom: 10}} ref={scrollViewRef}
                          onContentSizeChange={(contentWidth, contentHeight)=> {nextpage == 2 ? scrollViewRef.current.scrollToEnd({animated: true}) : <></>}}
                            // onScroll={(nativeEvent)=>_handleScroll(nativeEvent)}
                            refreshControl={<RefreshControl refreshing={loading} onRefresh={() => _handleScroll()} />}
                           >
                            {
                              messages.map((msg,i)=>(
                                  msgstyle = msg.userId == userId? {color: white_color,style:styles.mymsg} : {color: primary_color, style: styles.othersmsg},
                                    <View style={msgstyle.style} key={i}>
                                        <Text style={{color: msgstyle.color, fontFamily: default_font, fontSize: xxS}}>
                                            {msg.message}
                                        </Text>
                                    </View>
                              ))
                            }
                        </ScrollView>
                    </View>
                    <View style={{
                        padding: 5, 
                        flexDirection: 'row',
                        justifyContent: 'flex-end', 
                        margin: 5,
                        backgroundColor: grey_color,
                        backgroundColor: white_color,
                        borderTopWidth: 0.5,
                        borderColor: light_grey_color
                    }}>
                    
                        <View style={{width: '85%'}}>
                            <OriginTextInput value={new_msg} onChangeText={(test)=>setnew_msg(test)}  />
                        </View>
                        <View style={{width: '15%', alignItems: 'center'}}>
                          <CustomizeBtn  onPress={()=>emitmessage()} style={{ width: '90%', justifyContent: 'center', alignItem: 'center'}}>
                              <Icon type={'Ionicons'} name={'send'} style={{ color: primary_color, textAlign: 'center', fontSize: xxxL}}/>
                          </CustomizeBtn>
                        </View>
                    </View>
            </View>
        </Background>
      </>
    )
}
export default CustomChat;


