import React from 'react';
import PushNotification from "react-native-push-notification";


const ShowNotification = (title , message) =>{
    console.log(title, message)
    PushNotification.localNotification({
        title: title,
        message: message
    })    
}


export {ShowNotification};