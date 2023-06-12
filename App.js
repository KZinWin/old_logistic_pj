import React, { useEffect, useState } from 'react';
import { StyleSheet, Platform, Image, Text, View, ScrollView, PermissionsAndroid, AppState } from 'react-native';
import { AppContainer } from './app/navigation/router';
// for navigation withot navigation props
import { NavigationActions, StackActions} from 'react-navigation';
import navigationwithoutProps from './app/navigation/navigationwithoutProps';

import 'react-native-gesture-handler'
import { Root } from 'native-base';
import UserStore from './app/mobx/userStore';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-community/async-storage';
import { API_URL } from './app/components/common';
import jwt_decode from 'jwt-decode'
import PushNotification from "react-native-push-notification";
import { HomePageBtn } from './app/components/button';
import { getData } from './app/components/fetch';


const App = () => {
 
  const [counter, setcounter] = useState(1)
  const [messages, setmessages] = useState([])
  const [positions, setpositions] = useState([])
  const [token, settoken] = useState('')
  const [type, settype] = useState({})
  const [RoomUsers, setRoomUsers] = useState([])

  PushNotification.configure({
    onRegister: function (token) {
      // console.log("TOKEN:", token);
    },
    onNotification: function (notification) {
      // console.log("NOTIFICATION:", notification);
      // notification.finish(PushNotificationIOS.FetchResult.NoData);
      navigationwithoutProps.navigate('CustomChat',{roomId: notification.data.id})

    },
    onAction: function (notification) {
      // console.log("ACTION:", notification.action);
      // console.log("NOTIFICATION:", notification);
    },
    onRegistrationError: function(err) {
      console.error(err.message, err);
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: true,
  })
  
  useEffect(() => {
    async function forasynawait (){
      var token = await AsyncStorage.getItem('access_token')
      settoken(token)
      if(token){
        settype(jwt_decode(token))
      }
      if(type.userType == 'COURIER' || type.userType == 'DRIVER'){
        currentTracking();
      }
      
      var makeAlert = await AsyncStorage.getItem('lastAttempts')
      var arr = makeAlert?JSON.parse(makeAlert):[]
      var response = await getData(`${API_URL}/api/v0.1/rooms`)
      if(response.ok){
        var roomsusers =[]
        response.data.map(x=>{
          x.users.map(j=>{
            roomsusers.length>0?
              roomsusers.find(i=> i._id ==j._id)?
              <></>
              :
              roomsusers.push(j)
              :
              roomsusers.push(j)
          })
        })
        setRoomUsers(roomsusers)

          response.data.map(res=>{
              
              var index = arr ? arr.findIndex(x=>x.id == res._id): null
              if(index >= 0){
                  getData(`${API_URL}/api/v0.1/rooms/${res._id}/messages/check-latest?timestamp=${arr[index].time}`)
                  .then(result=>{
                    if(result.ok){
                      if(result.data.newer_messages_count >0){
                        testnoti(res)
                      }
                    } 
                  })
              }
          })
      }

    }
    forasynawait()
     
    return () => {
      if(token){
        
        if(type.userType == 'COURIER' || type.userType == 'DRIVER'){
          BackgroundGeolocation.removeAllListeners();
        }
      }
    }
  }, [])

  useEffect(() => {
    const socket = io( API_URL+"/chat", {
      "transports": ["polling","websocket"],
      "query": {
        "token": token
      }
    });
    socket.on("connect", (data) => {
      //  console.log("socket connected");
    });

    socket.on('message',msg=>{
      // console.log(msg.userId, type._id)
      if(msg.userId != type._id){
        testnoti(msg)
      }
    })
    
  }, [RoomUsers])

  const testnoti = (res) => {
    if(res.users){
      var roommate = res.users.find(x=>x._id != type._id)
    }else{
      var roommate = RoomUsers.find(x=>x._id == res.userId)
      // console.log(roommate)
     }
    PushNotification.createChannel(
      {
        channelId: "logistic-channel", // (required)
        channelName: "My channel", // (required)
        channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
        playSound: true, // (optional) default: true
        soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'` ) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.localNotification({
      vibrate: true, // (optional) default: true
      vibration: 300,
      playSound: true,
      soundName: 'default',
      priority: "high",
      channelId: "logistic-channel",
      title: "New Message Arrived", // (optional)
      message: `${roommate.name} send new messages`, // (required)
      data:{id: res.roomId? res.roomId: res._id}
    });
  }

  const currentTracking = async() =>{
    if(token){

          BackgroundGeolocation.configure({
            desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
            stationaryRadius: 1,
            distanceFilter: 1,
            notificationTitle: 'Background tracking',
            notificationText: 'enabled',
            debug: false,
            startOnBoot: false,
            stopOnTerminate: true,
            locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
            interval: 5000,
            fastestInterval: 5000,
            activitiesInterval: 5000,
            stopOnStillActivity: false,
            startForeground: true,
          });
      
          BackgroundGeolocation.on('location', (location) => {
            BackgroundGeolocation.startTask(taskKey => {
              // this.setState({ counter: counter + 1 })
              setcounter(counter+1)
              // console.log('location', location)
              messages.push('[Location] ' + location.latitude + ', ' + location.longitude)
              // this.setState({ messages: messages })
              setmessages(messages)
              sendLocation(location);
              // IMPORTANT: task has to be ended by endTask
              BackgroundGeolocation.endTask(taskKey);
            });
          });
      
          BackgroundGeolocation.on('authorization', (status) => {
            messages.push('[INFO] BackgroundGeolocation authorization status: ' + status);
              setmessages(messages)
              // this.setState({ messages: messages });
            // console.log(status , BackgroundGeolocation.AUTHORIZED)
            if (status !== BackgroundGeolocation.AUTHORIZED) {
              // we need to set delay or otherwise alert may not be shown
              setTimeout(() =>
                Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
                  { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
                  { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
                ]), 1000);
            }
          });
      
          BackgroundGeolocation.on('background', () => {
            messages.push('[INFO] App is in background');
              setmessages(messages)
              // this.setState({ messages: messages });
            // console.log('[INFO] App is in background');
          });
      
          BackgroundGeolocation.on('foreground', () => {
            messages.push('[INFO] App is in foreground');
              setmessages(messages)
              // this.setState({ messages: messages });
            // console.log('[INFO] App is in foreground');
          });
      
          BackgroundGeolocation.start();
      }
  }

  const  sendLocation = async(location) => {
    if (token) {
      // var model = {
      //   latitude: location.latitude,
      //   longitude: location.longitude
      // }
    const socket = io( API_URL+"/location", {
          "transports": ["polling","websocket"],
          "query": {
              "token": token
          }
          });

          socket.on('connect',()=>{
              // console.log(socket.connected)
          })
      
          socket.emit("locationUpdate", 
              {"lat":location.latitude, "long":location.longitude}
          );
          
          socket.on("disconnect", () => {
              // console.log("socket disconnected");
          });
    }

  }

    return (

      <Root>
          <View style={{flex: 1}}>
              <AppContainer ref={navigatorRef => {
                  navigationwithoutProps.setTopLevelNavigator(navigatorRef);
              }}
          />
          </View>
      </Root>
    );
}

export default App;
