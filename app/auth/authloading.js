import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import bankAccStore from '../mobx/BankAccStore'
import bankStore from '../mobx/banks'
import CityStore from '../mobx/cityStore'
import VehicleStore from '../mobx/VehicleStore'
import UserStore from '../mobx/userStore'
import jwt_decode from 'jwt-decode'
import AppStore from '../mobx/AppStore'
import { PermissionsAndroid, BackHandler, DeviceEventEmitter } from 'react-native'
import io from 'socket.io-client';
import { API_URL } from '../components/common';
import Geolocation from '@react-native-community/geolocation';
import roomLastAttemptStore from '../mobx/roomLastAttemptStore'
// import Geolocation from 'react-native-geolocation-service';
const Authloading = (props) => {
    const [messagecount, setmessagecount] = useState(0)
    useEffect(() => {
        async function checkauthornot() {

            var token = await AsyncStorage.getItem('access_token')
            if (token) {
                var type = jwt_decode(token);
                await AppStore.updateData('token', token);
                await CityStore.load();
                await bankAccStore.load();
                await bankStore.load();
                await VehicleStore.load();
                await UserStore.load(props);

                // var makeAlert = await AsyncStorage.getItem('lastAttempts')
                // var arr = JSON.parse(makeAlert)
                // var response = await getData(`${API_URL}/api/v0.1/rooms`)
                // response.data.map( (res,i)=>{
                //     console.log(arr, res._id)
                //     var filter_attempt = arr.find(x=>x.id == res._id)
                //     if(filter_attempt){
                //         getData(`${API_URL}/api/v0.1/rooms/${res._id}/messages/check-latest?timestamp=${filter_attempt.time}`)
                //         .then(result=>{
                //             console.log(result)
                //             setmessagecount(result.data.newer_messages_count)
                //         })
                //     }
                // })

                if (type.userType == 'NORMAL') {
                    props.navigation.navigate('Customer');
                } else if (type.userType == 'BUSINESS') {
                    props.navigation.navigate('ServiceProvider');   
                }else if (type.userType == 'COURIER') {
                    props.navigation.navigate('Courier');
                } else if (type.userType == 'DRIVER') {
                    props.navigation.navigate('Driver');
                }
            } else {
                props.navigation.navigate('Anonymous');
            }
        }
        // window.addEventListener("keyup", checkauthornot);
        // return () => window.removeEventListener("keyup", checkauthornot);
        checkauthornot();
    })

    return (
        <>
        {/* <App /> */}
        </>
    )
}
export default Authloading;