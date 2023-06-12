import React, { forwardRef, useImperativeHandle } from 'react'
import { TouchableOpacity } from 'react-native'
import { Toast } from 'native-base'
import { red_color, default_font } from './common'
import { alreadyAssigned } from './labels and messges'
export const ToastAlert = ((props) =>{
    // useImperativeHandle(ref, ()=>({
    //     show(params){
    //         var text = params.text
    //         if(text.includes('duplicate')){
    //             text=alreadyAssigned
    //         }
    //         Toast.show({
    //             text: text,
    //             textStyle: {color: params.color? params.color: red_color, fontFamily: default_font},
    //             duration: params.duration? params.duration: 3000,
    //             onClose: () => params.funct? params.funct: Toast.hide()
    //         })
    //     }
    // }))

    useEffect(() => {
        Toast.show({
            text: props.text,
            textStyle: {color: params.color? params.color: red_color, fontFamily: default_font},
            duration: params.duration? params.duration: 3000,
            onClose: () => params.funct? params.funct: Toast.hide()
        })
    }, [])

    return(
        <></>
    )
})

// export const toastA = {
//     showToast: (message, funct, duration = 2500 ) =>{
//         Toast.show({
//             text: message,
//             duration,
//             position: 'bottom',
//             textStyle: { textAlign: 'left' },
//             onClose: () => funct
//         })
//     }
// }