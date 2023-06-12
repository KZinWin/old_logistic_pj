import React, { useState,useEffect,useRef } from "React";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { primary_color, default_font, light_grey_color, grey_color, white_color, dashboard_green, dashboard_red } from "./common";
import { Icon } from "native-base";
import DatePicker from "react-native-datepicker";
import { OriginTextInput } from "./form";
import { getDateForInput } from "./date";
import { standard_font_size, xxS, S, xS, xxxS, label_font_size, xxxL } from "./font";
import { styles } from "./styles";
import ModalWrapper from "react-native-modal-wrapper";
import ImagePicker from 'react-native-image-picker';
import AppStore from "../mobx/AppStore";


//  // Delivery List Card
export const DLCard= (props) => {
    return(
            <View style={{
                flexDirection: 'row',
                    width: '95%',
                    padding: 5, 
                    height: 60,
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: 5,
                    backgroundColor: white_color,
                    borderRadius:5,
                    borderWidth: 1,
                    borderColor: light_grey_color
            }}>
                <View style={{flex: 0.5,  justifyContent: 'center' }}>
                    <Image source={props.img} style={{ width: '100%', height: '100%'}}/>
                </View>
                <View style={{flex: 2}}>
                    {props.title? 
                    <Text style={{ textAlign: 'center',fontSize: standard_font_size,fontFamily: default_font,color: grey_color}}>{props.title}</Text>
                    :<></>}
                    <Text style={{ textAlign: 'center',fontFamily: default_font,color: grey_color}}>{props.name.length > 50 ? `${props.name.substring(0,50)} ..` :props.name}</Text>
                </View>
                <View style={{flex: 0.3, alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableOpacity onPress={props.onPress}>
                        <Icon name={'screen-smartphone'} type={'SimpleLineIcons'} style={{ color: light_grey_color }}/>
                    </TouchableOpacity >
                </View>
            </View>
    )
}

//  // Assigned delivery card
export const ADcard = (props) =>{
    return(
        <View style={{
            flexDirection: 'row',
                width: '90%',
                padding: 10, 
                height: 100,
                alignSelf: 'center', 
                justifyContent: 'center', 
                margin: 10,
                backgroundColor: white_color,
                borderRadius:10,
                elevation: 10,
                shadowColor: '#000', 
                shadowOpacity: 0.3, 
                shadowOffset :{
                width: 5,
                height: 10,
                }
        }}>
            <View style={{flex: 1, justifyContent: 'center', padding: 10}}>
                <Text style={{ textAlign: 'left', fontFamily: default_font}}>{props.name}</Text>
                <Text style={{ textAlign: 'left', fontFamily: default_font}}>{props.date}</Text>
            </View>
        </View>
    )
}

//  // Package List Card
export const PgList =(props) => {
    return(
        <TouchableOpacity onLongPress={props.longPress} onPress={props.onPress}  style={{
            // flexDirection: 'row',
            // width: 175,
            height: 175,
            // alignSelf: 'center', 
            justifyContent: 'center', 
            // marginVertical: 5,
            backgroundColor: props.bgColor? props.bgColor:white_color,
            borderRadius:5,
            elevation: 10,
            shadowColor: '#000', 
            shadowOpacity: 0.3, 
            shadowOffset :{
                width: 5,
                height: 5,
            }
        }}>
                <View style={{flex: 2, justifyContent: 'center'}}>
                    <Image source={props.image} style={{width: '100%', height: '100%'}}/>
                </View>
                <View style={{flex: 0.5, justifyContent: 'flex-start', padding: 10}}>
                    <Text style={{ textAlign: 'left', fontFamily: default_font }}>{props.tsp}</Text>    
                </View>
        </TouchableOpacity >
    )
}

//multiselect card
// export const MultiSelectCard =(props) => {
//     return(
//         <TouchableOpacity onPress={props.onPress}>
//             <View style={{
//                     height: 175,
//                     justifyContent: 'center', 
//                     backgroundColor: light_grey_color,
//                     borderRadius:5,
//                     elevation: 10,
//                     shadowColor: '#000', 
//                     shadowOpacity: 0.3, 
//                     shadowOffset :{
//                     width: 5,
//                     height: 5,
//                     }
//             }}>
//                 {props.children}
//             </View>
//         </TouchableOpacity >
//     )
// }

//  // Fleet List Card
export const FLCard =(props) => {
    return(
        <TouchableOpacity onLongPress={props.longPress} onPress={props.onPress} style={{
            // flexDirection: 'row',
                // width: 175,
                height: 175,
                // alignSelf: 'center', 
                marginVertical: 5,
                backgroundColor: white_color,
                borderRadius:5,
                elevation: 10,
                shadowColor: '#000', 
                shadowOpacity: 0.3, 
                shadowOffset :{
                width: 5,
                height: 5,
                }
        }}>
                <View style={{flex: 2, justifyContent: 'flex-start'}}>
                    <Image source={props.image} style={{width: '100%', height: '100%'}}/>
                </View>
                <View style={{ justifyContent: 'flex-end', padding: 10}}>
                    <Text style={{ textAlign: 'left', fontFamily: default_font , fontWeight: 'bold', fontSize: label_font_size}}>{props.no.length > 13 ? `${props.no.substring(0,13)} ..` :props.no}</Text>
                    <Text style={{ textAlign: 'left', fontFamily: default_font, fontSize: label_font_size }}>{props.plate.length > 20 ? `${props.plate.substring(0,20)} ..` :props.plate}</Text>
                    {
                    props.type || props.year? 
                        <Text style={{ textAlign: 'left', fontFamily: default_font, fontSize: xxxS}}>{props.type}.{props.year}</Text>
                        : <></>
                    }
                </View>
        </TouchableOpacity >
    )
}

//  // Payment List Card
export const PLCard = (props) =>{
    return(
        <View style={{
            flexDirection: 'row',
                width: '90%',
                marginTop: 20,
                padding: 10, 
                alignSelf: 'center', 
                justifyContent: 'center', 
                margin: 10,
                backgroundColor: white_color,
                borderRadius:10,
                elevation: 10,
                shadowColor: '#000', 
                shadowOpacity: 0.3, 
                shadowOffset :{
                width: 5,
                height: 10,
                }
        }}>
            <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={{ textAlign: 'center', fontFamily: default_font}}>{props.bank}</Text>
            </View>
            <View style={{flex: 2, justifyContent: 'flex-start', padding: 10}}>
                <Text style={{ textAlign: 'center', fontFamily: default_font}}>{props.no}</Text>
            </View>
            <TouchableOpacity style={{flex: 0.5, justifyContent: 'flex-start', padding: 10}} onPress={props.onPress}>
                <Icon name={'trash'} type={'Entypo'} style={{color: grey_color, textAlign: 'right', fontSize: standard_font_size}} />
            </TouchableOpacity>
        </View>
    )
}

export const SACard = (props) =>{
    return(
        <View style={[styles.ExpenseList,props.style]}>
            <View style={{flex: 0.2, justifyContent: 'center', alignItems: 'center'}}>
                <Icon name={'location-pin'} type={'Entypo'} style={{ color: primary_color }}/>
            </View>
            <View style={{flex: 1.5, justifyContent: 'center', alignItems: 'flex-start'}}>
                <Text style={{ textAlign: 'left', fontFamily: default_font,fontSize: xxS,color: grey_color}}>{props.from} ({props.fpost}) {"\n"}{props.to} ({props.tpost}) </Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-end'}}>
                <Text style={{ textAlign: 'left', fontFamily: default_font,fontSize: standard_font_size,color: grey_color}}>{props.tCol} Ks</Text>
            </View>
        </View>
    )
}

export const ExpenseCard = (props) =>{
    return(
        <View style={[styles.ExpenseList,props.style]}>
            <View style={{flex: 1, justifyContent: 'center'}}>
                <Text style={{ textAlign: 'left', fontFamily: default_font,fontSize: standard_font_size,color: grey_color}}>{props.fCol}</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
                <Text style={{ textAlign: 'left', fontFamily: default_font,fontSize: standard_font_size,color: grey_color}}>{props.sCol}</Text>
            </View>
            <TouchableOpacity style={{flex: 0.5, justifyContent: 'center', alignItems: 'flex-end'}} onPress={props.onPress}>
                <Icon name={'trash'} type={'Entypo'} style={{color: grey_color, fontSize: standard_font_size}} />
            </TouchableOpacity>
        </View>
    )
}

// Dashboard and select time picker 
export const DatetimepickerText = (props) =>{
    // console.log(props)
    return(
            <TouchableOpacity onPress={props.ref == undefined ? <></>:props.ref.current.onPressDate()}>
                <Text style={{ color: grey_color, fontFamily: default_font }}>{props.text}</Text>

                <DatePicker
                    mode={props.mode}
                    showIcon={props.showIcon}
                    date={props.date}
                    style={{ width: 50, height: 10 }}
                    hideText={props.hideText}
                    {...props}
                    // is24Hour
                    // ref={ToRef.current[index]}
                    // androidMode={'spinner'}
                    // onDateChange={async(time) => await settime(time, index, type = 'to')}
                />

            </TouchableOpacity>
    )
}

//  // Dashboard card
export const DashboardCard = props =>{
    return(
        <TouchableOpacity 
        onPress={props.onPress}
        style={[{width: '48%', height: 80, borderRadius: 20,alignItems: 'center', justifyContent: 'center', paddingRight: 5,backgroundColor: dashboard_green},props.style]}>
            <Text style={{textAlign: "left", fontFamily: default_font, fontSize: xxS, color: white_color}}>{props.name}</Text>
            <View style={{flexDirection: 'row',alignItems: 'center'}}>
                <Text style={{textAlign: 'center', fontFamily: default_font, fontSize:  standard_font_size, color: white_color}}>{ props.count.length>= 13? `${props.count}\n` :props.count}{props.unit}</Text>
                {/* <Text style={{textAlign: 'right', fontFamily: default_font, fontSize: xxS, color: white_color}}></Text> */}
            </View>
        </TouchableOpacity>
    )
}

//  // Dashboard list
export const DashboardList = props =>{
    return(
        <>
            <View style={{flexDirection: 'row', alignItems: 'center', paddingVertical: 10}}>
                <Icon name={props.iconName} type={props.iconType} style={{fontSize: standard_font_size, color:grey_color}}/> 
                <Text style={{textAlign: "left", fontFamily: default_font, fontSize: xS, color: grey_color}}>{props.listName}</Text>
            </View>
            <View style={{flexDirection: "row",justifyContent: 'space-between',paddingHorizontal: 10}}>
                {props.children}
            </View>
        </>
    )
}

//  // Common multi image with function 
export const MultiImageCard = props =>{
    const [imgindex, setindex] = useState(0)
    const [isOpen, setisOpen] = useState(false)
    const[ CamCounter, setCamCounter ] = useState(["cam"])
    const [images, setimages] = useState([])
    const [disabled, setDisabled] = useState(false)
    const [userToken, setUserToken]=useState(AppStore.token)

    useEffect(() => {
        setimages(props.images)
        if(props.maxImage){
            setCamCounter([])
        }
        setDisabled(props.disabled)
    }, [props.images])

    //  initial image pick function 
    const initPick = (response) =>{
        setCamCounter(CamCounter.slice(1))
        props.initPick(response)
    }

    // edit image pick function 
    const editPick = (response) =>{
        props.editPick({res: response, id: imgindex})
    }

    // open image picker package and call functions
    const imagePick = (type) => {
        const options = {
            title: "Select Logo",
            maxWidth: 400,
            maxHeight: 400
        };
        
        ImagePicker.launchImageLibrary(options, (response) => {
            if(!response.didCancel){
                var pickedImage = {uri: response.uri, base64:`data:image/jpeg;base64,${response.data}` }
                if(props.initPick && type=='initpick'){
                    initPick(pickedImage)
                }else if(props.editPick && type=='editpick'){
                    editPick(pickedImage)
                }
                setisOpen(false)
            }
        })
    }

    // set id and open model for edit or delete image
    const action = (index) =>{
        setindex(index)
        setisOpen(true)
    }

    // add more images
    const addCameraCounter = () => {
        var camera = CamCounter
        camera.push('cam');
        setCamCounter(JSON.parse(JSON.stringify(camera)))
    }

    return(
        <View style={[styles.fw_with_m20,{backgroundColor: 'white'}]}>
            {
                images.map((img, index) => (
                    <TouchableOpacity onPress={()=>action(index)} disabled={disabled}
                        key={index} style={{ marginHorizontal: 10, width: '15%', marginBottom : 5, backgroundColor: white_color}}>
                            {props.bearTokenEdit?
                                <Image source={{ uri: img.Location ,
                                headers: {
                                    Authorization: `Bearer ${userToken}`
                                } }} style={styles.imageCircle} /> 
                            :
                                <Image source={{ uri: img }} style={styles.imageCircle} /> 
                            }
                    </TouchableOpacity>
                ))
            }
            {
                CamCounter.map((cam, j) => (
                    <TouchableOpacity onPress={()=>imagePick("initpick")} key={j} style={{ marginHorizontal: 10, width: '15%', marginBottom : 5}}>
                        <View style={{ width: 60, height: 60, borderWidth: 0.5, borderRadius: 50, justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name={'camera'} type={'Entypo'} style={{ color: grey_color }} />
                        </View>
                    </TouchableOpacity>
                ))
            }
            {
                props.maxImage?
                    CamCounter.length + images.length < props.maxImage ?
                        <TouchableOpacity style={{justifyContent:'center', marginHorizontal: 20 }} onPress={()=>addCameraCounter()}>
                            <Icon type={'Feather'} name={'plus-circle'} style={{color: light_grey_color, fontSize: xxxL}}/>
                        </TouchableOpacity>
                    :
                    <></>
                :
                <TouchableOpacity style={{justifyContent:'center', marginHorizontal: 20 }} onPress={()=>addCameraCounter()}>
                    <Icon type={'Feather'} name={'plus-circle'} style={{color: light_grey_color, fontSize: xxxL}}/>
                </TouchableOpacity>
            }
                
            {/* function choice model (edit or delete) */}
            <ModalWrapper
                containerStyle={{ flexDirection: 'row', alignItems: 'flex-end' }}
                onRequestClose={()=>setisOpen(false)}
                style={{ flex: 1 }}
                visible={isOpen}
                overlayStyle={light_grey_color}>
                <TouchableOpacity onPress={()=>imagePick('editpick')}>
                    <View style={{padding: 10, margin: 10}}>
                        <Text style={styles.FleetLabel}>Edit image</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{setisOpen(false),props.ondelete? props.ondelete(imgindex):<></>}}>
                    <View style={{padding: 10, margin: 10}}>
                        <Text style={styles.FleetLabel}>delete image</Text>
                    </View>
                </TouchableOpacity>
            </ModalWrapper>
        </View>
    )
}

//  // Common Tags
export const CommonTags = props => {

    const [arr, setTabArr] = useState(props.TabArr)
    const [active, setactive] = useState(props.active)
  
    const Active = (active) =>{
      setactive(active)
      props.onPress(active)
    }

    useEffect(()=>{
        setactive(props.active)
    },[props.active])
  
    return (
      <>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap'}}>
            {
                arr.map((x,i)=>(
    
                    <TouchableOpacity style={{ width: active == i ?'28%':'24%', padding:10 }} key={i} onPress={() => Active(x.value)}>
                        <Text
                            style={[{
                                color: grey_color, 
                                textAlign: 'center', 
                                paddingVertical: 5,
                                fontSize: active == i ?12: 9, 
                                borderBottomWidth :active == i ? 1 : 0, 
                                borderBottomColor: grey_color, 
                                fontFamily: default_font, 
                                fontWeight: 'bold'
                            },props.style]}>
                            {x.name.toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                
                ))
            }
          </View>
        {props.children}
      </>
    );
  };

  
//  // service provider List Card
export const ProfileListCard= (props) => {
    return(
        <TouchableOpacity onPress={props.onPress}>
            <View style={{
                flexDirection: 'row',
                    width: '95%',
                    padding: 5, 
                    height: 60,
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: 5,
                    backgroundColor: white_color,
                    borderRadius:5,
                    borderWidth: 1,
                    borderColor: light_grey_color
            }}>
                <View style={{flex: 0.5,  justifyContent: 'center' }}>
                    <Image source={props.img} style={{ width: '100%', height: '100%'}}/>
                </View>
                <View style={{flex: 2}}>
                    {props.title? 
                    <Text style={{ textAlign: 'center',fontSize: standard_font_size,fontFamily: default_font,color: grey_color}}>{props.title}</Text>
                    :<></>}
                    <Text style={{ textAlign: 'center',fontFamily: default_font,color: grey_color}}>{props.name.length > 50 ? `${props.name.substring(0,50)} ..` :props.name}</Text>
                </View>
                <View style={{flex: 0.3, alignItems: 'center', justifyContent: 'center'}}>
                    <Icon name={'message1'} type={'AntDesign'} style={{ color: grey_color }}/>
                </View>
            </View>
        </TouchableOpacity >
    )
}
