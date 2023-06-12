import React, { useState, useEffect } from 'react'
import { Text, View, PermissionsAndroid } from 'react-native'
import { CameraKitCameraScreen, } from 'react-native-camera-kit';
import { Toast } from 'native-base';
import { invalid } from 'moment';
import { red_color, default_font } from './common';
import { duration } from 'moment';
import { invalid_qr_message } from './labels and messges';
import { NavigationEvents } from 'react-navigation';

export default Qrscanner = (props) =>{
    const [value, setqrvalue] = useState('')
    const [openscanner, setopenscanner]= useState(false)
    const [type,setType] = useState(props.navigation.getParam('type'))

    useEffect(() => {

        if(Platform.OS === 'android'){
            async function requestCameraPermission() {
              try {
                const granted = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.CAMERA,{
                    'title': 'CameraExample App Camera Permission',
                    'message': 'CameraExample App needs access to your camera '
                  }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                  //If CAMERA Permission is granted
                  setqrvalue('')
                  setopenscanner(true)
                } else {
                  alert("CAMERA permission denied");
                }
              } catch (err) {
                alert("Camera permission err",err);
                console.warn(err);
              }
            }
            //Calling the camera permission function
            requestCameraPermission();
          }else{
            setqrvalue('')
            setopenscanner(true)
          }    
        
    }, [])

    function onOpenLink(qrvalue) {
      // var link = type == 'provider'? 'PackageDetail': type == 'customer'? 'PackageListForCustomer' : type == 'courier'?'PackageListForCourier' : 'PackageEntryDetailForCourier'
      try{
        var link = JSON.parse(qrvalue)
          if(link.entity == "package-assigns"){
            type == 'provider'?
              props.navigation.navigate('PackageDetail',{assignID: link.id})
            : type == 'customer'?
                props.navigation.navigate('PackageEntryDetailForCustomer',{id: link.id})
              : type == 'courier'?props.navigation.navigate('PackageEntryDetailForCourier',{id: link.id}): props.navigation.navigate('PackageEntryDetailForCourier',{id: link.id})
          }else{
            props.navigation.goBack();
            Toast.show({
              text: invalid_qr_message,
              textStyle: {color: red_color, fontFamily: default_font},
              duration: 3000
            })
          }
        }
        catch(error){
          props.navigation.goBack();
          Toast.show({
            text: invalid_qr_message,
            textStyle: {color: red_color, fontFamily: default_font},
            duration: 3000
          })
        }
    }

    return(
      <View style={{ flex: 1 }}>
        <NavigationEvents onDidFocus={()=>setopenscanner(true)} />

            {
                openscanner?
                    <CameraKitCameraScreen
                        showFrame={true}
                        //Show/hide scan frame
                        scanBarcode={true}
                        //Can restrict for the QR Code only
                        laserColor={'blue'}
                        //Color can be of your choice
                        frameColor={'yellow'}
                        //If frame is visible then frame color
                        colorForScannerFrame={'white'}
                        //Scanner Frame color
                        cameraOptions={{
                          focusMode: 'on',               // off/on(default)
                        }}
                        onReadCode={event =>
                          event.nativeEvent? (
                          setopenscanner(false),
                          onOpenLink(event.nativeEvent.codeStringValue))
                          : <></>
                        }
                    />
                :
                <></>
            }
        </View>
    )
}