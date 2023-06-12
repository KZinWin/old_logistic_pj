import React, { useState, useEffect, useRef, Children } from "react";
import { View, TextInput, Text, TouchableOpacity, Picker, ScrollView } from "react-native";
import { grey_color, primary_color, default_font, light_grey_color, white_color, red_color, API_URL } from "./common";
import { Icon, Spinner, Toast } from "native-base";
import Select2 from "react-native-select-two";
import { getData } from "./fetch";
import {styles} from "./styles";
import { standard_font_size, xxS, xxxS, label_font_size, S, L } from "./font";
import DatePicker from "react-native-datepicker";

const checkEmail = async (email , edit) => {
    // var format = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    var format = /^([a-z0-9_\.])+\@([a-z0-9_\-\.])+\.([a-z]{2,4})$/
    if(email){
        if (format.test(email)) {
            if(!edit){
                var response = await getData(`${API_URL}/api/v0.1/check/email?email=${email}`);
                if (response.ok) {
                    if (response.data.result) {
                        return 'It is already registered , forgot password?'
                    }
                }
            }
        } else {
            return 'Email is not in a correct format.'
        }
    }
    return '';
}


export const OriginTextInput = (props) => { 
    const [error, setError] = useState(props.errormessage);
    // const [value, setValue] = useState(props.value)
    useEffect(()=>{
        setError(props.errormessage)
    },[props.errormessage])

    useEffect(()=>{
        if(props.email){
            onBlur()
        }
        if(props.words){
            if(props.value == undefined || props.value.length < props.words){
                setError(`length must be ${props.words} or more than ${props.words} characters`)
            }else{
                setError('')
            }
        }
    },[props.value])

    const onBlur = async () => {
        
        if (props.email) {
            var message = await checkEmail(props.value, props.edit);
            setError(message);
            if (props.onBlur) {
                props.onBlur(message);
            }
        }
    }

    const convertNumber = (value)=>{
        if(value != ''){
            intvalue = parseInt(value.replace(/[^0-9\.]/g, ''),10)
            props.onChangeText(isNaN(intvalue) ? '': intvalue)
        }else{
            props.onChangeText(value)
        }
    }

    // const changeLowerCase = (value) =>{
    //     let val = '';
    //     // if(props.email)
    //     // {
    //     //     var i = 0;
    //     //     while ( i < value.length){
    //     //         character = value.charAt(i)
    //     //         if(character == character.toUpperCase()){
    //     //             // [a-zA-Z0-9]+
    //     //             // /^[a-zA-Z0-9- ]*$/
    //     //             if(().test(character)){
    //     //                 val = val.toLowerCase()
    //     //             }else{
    //     //                 val = val.concat(character)
    //     //             }
    //     //         }else{
    //     //             val = val.concat(character)
    //     //         }
    //     //         i++
    //     //     }
    //     // }
    //     props.onChangeText(value)
    // }

    return (
        <>

            {
                props.label ?
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[{ fontSize: label_font_size, marginVertical: 5, fontFamily: default_font,color: grey_color}, props.labelStyle]}>{props.label}</Text>
                    </View>
                    : <></>
            }
            <View style={[{ backgroundColor: light_grey_color, borderWidth: 1, width: props.width ? props.width : '100%', borderRadius: 5, borderColor: props.borderColor ? props.borderColor : light_grey_color, height: props.height ? props.height : 45, marginBottom: props.marginBottom ? props.marginBottom : 15 },props.style]}>
            {
                
                <TextInput 
                    placeholder={props.placeholder}
                    value={props.value}
                    onBlur={() => onBlur()}
                    secureTextEntry={props.secureTextEntry ? props.secureTextEntry : false}
                    keyboardType={props.type== 'number'? 'number-pad' :props.keyboardType}
                    onChangeText={props.type == 'number'? (value)=> convertNumber(value): props.onChangeText}
                    style={{ fontFamily: default_font, fontSize : xxS, marginLeft: 20 }}
                    editable={props.editable}
                />
            }
                {props.children}
                <ValidateForm value={props.value} required={props.required} errormessage={error} />
            </View>
        </>
    )
}

export const SmallHighTextInput = (props) => {
    
    const convertNumber = (value)=>{
        if(value != ''){
            intvalue = parseInt(value.replace(/[^0-9\.]/g, ''),10)
            props.onChangeText(isNaN(intvalue) ? '':intvalue)
        }else{
            props.onChangeText(value)
        }
    }

    return (
        <>
            {
                props.label ?
                    <Text style={[styles.FleetLabel]}>{props.label}</Text> : <></>
            }
            <View style={{ backgroundColor: light_grey_color, width: props.width ? props.width : '100%', borderRadius: 5, borderColor: grey_color, height: 40, paddingLeft: 10, marginBottom: props.marginBottom ? props.marginBottom : 15 }}>
                <TextInput
                    ref={props.ref}
                    placeholder={props.placeholder}
                    value={props.value}
                    autoFocus={props.autoFocus}
                    keyboardType={props.type== 'number'? 'number-pad' :props.keyboardType}
                    onChangeText={props.type == 'number'? (value)=> convertNumber(value): (props.onChangeText ? props.onChangeText : null)}
                    style={{ fontFamily: default_font, fontSize: xxS }}
                />
                <ValidateForm value={props.value} required={props.required} errormessage={props.errormessage}/>
            </View>
        </>
    )
}

//multiline with text input
export const MultilineTextInput = (props) => {
    return (
        <>
            {
                props.label ?
                    <Text style={{ fontSize: label_font_size, marginVertical: 5, fontFamily: default_font, color: grey_color }}>{props.label}</Text> : <></>
            }
            <View style={{ borderWidth: 0.5, width: props.width ? props.width : '100%', borderRadius: 5, borderColor: grey_color, paddingLeft: 20, marginBottom: props.marginBottom ? props.marginBottom : 15 }}>
                <TextInput
                    multiline
                    style={{ textAlignVertical: 'top' }}
                    numberOfLines={props.numberOfLines}
                    placeholder={props.placeholder}
                    keyboardType={props.keyboardType}
                    style={{ fontFamily: default_font }}
                    onChangeText={props.onChangeText}
                    value={props.value}
                />
            </View>
        </>
    )
}

//three column phone number text input 
export const TCPNTextInput = (props) => {
    const [error, setError] = useState(props.errormessage);
    useEffect(()=>{
        setError(props.errormessage)
    },[props.errormessage])

    const convertNumber = (value)=>{
        if(value != ''){
            intvalue = parseInt(value.replace(/[^0-9\.]/g, ''),10)
            props.onChangeText(isNaN(intvalue) ? '': intvalue)
        }else{
            props.onChangeText(value)
        }
    }

    return (
        <View style={{ marginBottom: 15 }}>
            {
                props.label ?
                    <Text style={{ fontSize: label_font_size, marginVertical: 5, fontFamily: default_font, color: grey_color }}>{props.label}</Text> : <></>
            }
            <View style={{ flexDirection: 'row', borderWidth: 0.5, width: '100%', borderRadius: 5, borderColor: grey_color, height: 50 }}>
                <View style={{ width: '15%', borderRightWidth: 0.5, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: grey_color, fontFamily: default_font }}>09</Text>
                </View>
                <View style={{ flex: 1, paddingLeft: 20 }}>
                    <TextInput 
                    placeholder={props.placeholder} 
                    onBlur={props.onBlur} 
                    style={{ fontFamily: default_font }} 
                    value={props.value} 
                    keyboardType={props.type== 'number'? 'number-pad' :props.keyboardType}
                    onChangeText={props.type == 'number'? (value)=> convertNumber(value): (props.onChangeText ? props.onChangeText : null)}
                    />
                </View>
                {
                    props.twoCol ? <></> :
                        <View style={{ width: '20%', borderLeftWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: primary_color, borderTopEndRadius: 5, borderBottomRightRadius: 5 }}>
                            {
                                props.loading ? <Spinner color={white_color} size={'small'} />
                                    :
                                    <TouchableOpacity onPress={props.onPress}>
                                        <View style={{width: '100%'}}>
                                            <Text style={{ fontSize: label_font_size, textAlign: 'center', color: white_color }}>Get OTP</Text>
                                        </View>
                                    </TouchableOpacity>
                            }
                        </View>
                }
            </View>
            {props.children}
            <ValidateForm value={props.value} required={props.required} errormessage={error} />
        </View>
    )
}
//select 2 component
export const STComponent = (props) => {
    const [error, setError] = useState(props.errormessage);

    const selectData = async (data,list) =>{
        var preSelected = {}
        if(data.length>0){
            var id = list.find(x=>x.id == data[0]);
            if (id) {
                preSelected = id
                // props.onChangeSelect(id)
            }
        }else{
            preSelected = {id: '', name: ''}
            // props.onChangeSelect({id: '', name: ''})
        }
        props.onChangeSelect(preSelected)
    }

    return (
        <View style={{ marginBottom: 20 }}>
            {props.label?
            <Text
                style={{
                fontSize: xxS,
                marginVertical: 5,
                fontFamily: default_font,
                color: grey_color,
                }}>
                {props.label}
            </Text>:<></>}
            {/* <View > */}
                <ScrollView
                style={[{ backgroundColor:light_grey_color,width: '100%', borderRadius: 5, borderColor: grey_color, height: 50,
                // alignContent: 'center', 
                },props.style]}
                    showsVerticalScrollIndicator={false}
                >
                    <Select2
                        isSelectSingle={props.isSelectSingle}
                        style={{borderWidth: 0,height: props.height, paddingTop: props.paddingTop, fontSize: xxS, textAlign: 'center'}}
                        defaultFontName={default_font}
                        selectedTitleStyle={{color: grey_color},props.selectedTitleStyle}
                        colorTheme={primary_color}
                        popupTitle={props.popupTitle}
                        title={props.title}
                        listEmptyTitle={props.listEmptyTitle? props.listEmptyTitle: 'Nothing to Show'}
                        searchPlaceHolderText={props.searchPlaceHolderText ? props.searchPlaceHolderText : 'Select Item'}
                        data={props.preSelectedItem ? props.data.map(x => ({ ...x, checked: x[props.preSelectedItem.key] == props.preSelectedItem.value })) : props.data}
                        onSelect={props.onSelect?
                            props.onSelect: 
                            (selectdata)=>selectData(selectdata,props.data)     //only return for id and name
                        }
                        selectButtonText={'Select'}
                        cancelButtonText={'Cancel'}
                        onRemoveItem={props.onRemoveItem}
                    />
                </ScrollView>
            {/* </View> */}
            {props.children}
            <ValidateForm value={props.value} required={props.required} errormessage={error} />
        </View>
    )
}

//search form
export const SearchForm = (props) => {
    return (
        <View style={[{
            flexDirection: 'row',
            width: '100%',
            // marginTop: 20,
            paddingHorizontal: 10,
            alignSelf: 'center',
            justifyContent: 'center',
            marginTop: 10,
            backgroundColor: white_color,
            borderRadius: 50,
            elevation: 10,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowOffset: {
                width: 5,
                height: 10,
            }
        },props.style]}>
            <View style={{ width: '100%', flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 0, alignItems: 'center', height: 45 }}>
                    <Icon name={'search'} type={'Feather'} style={{ fontSize: standard_font_size, color: light_grey_color, textAlign: 'center' }} />
                    <TextInput style={{ width: '90%', alignSelf: 'flex-end' }} value={props.value} onChangeText={props.onChangeText}/>
                </View>
            </View>
            {/* <View style={{width: '20%',flexDirection: 'column', justifyContent: 'center', alignSelf: 'center', paddingHorizontal: 5}}>
                <TouchableOpacity onPress={props.onPress}>
                    <Icon name={'plus-circle'} type={'Feather'} style={{color: light_grey_color, fontSize : xL, fontWeight: 'normal'}} />
                </TouchableOpacity>
            </View> */}
        </View>
    )
}

// for package size list
export const SearchandAddForm = (props) => {
    return (
        <View style={{ flexDirection: 'row', paddingHorizontal: 10 }}>
            <View style={{ width: '100%', flexDirection: 'column' }}>
                <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: light_grey_color, paddingHorizontal: 10, paddingVertical: 0, alignItems: 'center', height: 40, borderRadius: 50 }}>
                    <Icon name={'search'} type={'Feather'} style={{ fontSize: standard_font_size, color: light_grey_color, textAlign: 'center' }} />
                    <TextInput style={{ width: '80%', alignSelf: 'flex-end' }} />
                </View>
            </View>
            {/* <View style={{width: '20%',flexDirection: 'column', justifyContent: 'center', alignSelf: 'center', paddingHorizontal: 5}}>
                <TouchableOpacity onPress={props.onPress}>
                    <Icon name={'plus-circle'} type={'Feather'} style={{color: light_grey_color, fontSize : xL, fontWeight: 'normal'}} />
                </TouchableOpacity>
            </View> */}
        </View>
    )
}

export const ValidateForm = (props) => {
    // const [errorm, seterrorm] = useState('')
    
    // useEffect(() => {
    //     if(props.errormessage){
    //         seterrorm(props.errormessage)
    //     }else{
    //         seterrorm('')
    //     }
        
    // }, [props])
    return (
        <View >
            {props.children}
            {props.required ? (props.value ?  <></> : <Text style={{ color: red_color, fontSize: xxxS, fontFamily: default_font }}>require *</Text>) : <></>}
            {
                props.value ? (props.errormessage ? <Text style={{ color: props.errorColor ? props.errorColor : red_color, fontSize: xxxS, fontFamily: default_font }}>{props.errormessage}</Text> : <></>) : <></>
            }
        </View>
    )
}

export const RNPicker = props =>{
    const valueChange = (value, index) => {
        props.onValueChange(value, index)
    }

    return(
        <View style={[styles.SelectStatePicker,props.style]}>
            <Picker
                selectedValue={props.selectedValue}
                // ref={pickerWork}
                style={[{ height: 50, width: '100%',fontFamily: default_font},props.Pickerstyle]}
                itemStyle={[{ fontSize: xxxS, fontFamily: default_font, fontWeight: 'normal' }, props.itemStyle]}
                onValueChange={(itemValue, itemIndex) =>valueChange(itemValue, itemIndex)}
            >
                {
                    props.data.map((x, i)=>(
                        <Picker.Item label={x.name} value={x.name} key={i} color={props.color? props.color: grey_color}/>
                    ))
                }
            </Picker>
            {
                props.required?
                    <ValidateForm value={props.selectedValue} required />
                :
                <></>
            }

        </View>
    )
}


//  // DatePicker Component
export const DatePickerForm = props =>{
    const FromRef = useRef(null)
    const handleChange = (date) =>{
        props.onDateChange(date)
    }
    return(
        <View style={[{ flex: 1, paddingRight: 5 },props.style]}>
            <TouchableOpacity onPress={() => {
                FromRef.current.onPressDate()
            }} >
                <OriginTextInput label={props.label} required={props.required? props.required: false} height={props.height? props.height: 43} editable={false} value={props.value} placeholder={"Select date"} width={props.width?props.width:'100%'} />
            </TouchableOpacity>
            <DatePicker
                mode={'date'}
                showIcon={false}
                style={{ width: 50 }}
                androidMode={props.androidMode}
                format={props.format}
                minDate={props.minDate}
                customStyles={props.customStyles}
                hideText={true}
                ref={FromRef}
                timeZoneOffsetInMinutes={5}
                onDateChange={(date)=>handleChange(date)}
            />
        </View>
    )
}

// text box with pin location 
export const PinLocationText = (props) =>{
    return(
        <>
        {
            props.label ?
                <Text style={{ fontSize: label_font_size, marginVertical: 5, fontFamily: default_font, color: grey_color }}>{props.label}</Text> : <></>
        }
        <View style={{ flexDirection: 'row', backgroundColor: light_grey_color, borderWidth: 1, width: '100%', borderRadius: 5, borderColor: light_grey_color, height: 45, marginBottom: 15 }}>
            <View style={{flex: 4}}>
                <TextInput 
                    placeholder={props.placeholder}
                    value={props.value}
                    // onBlur={() => onBlur()}
                    onChangeText={props.onChangeText}
                    style={{ fontFamily: default_font, fontSize : xxS, marginLeft: 20, width: '80%' }}
                    editable={true}
                />
            </View>
            <TouchableOpacity onPress={props.onPress} style={{flex:1}}>
                <View style={{width: '100%', height: '100%',backgroundColor: red_color, borderTopEndRadius:5, borderBottomEndRadius: 5, alignItems: 'center', justifyContent: 'center'}}>
                    <Icon name={'location-arrow'} type={'FontAwesome'} style={{fontSize: L,color: white_color, textAlign: 'center'}}/>
                </View>
            </TouchableOpacity>
        </View>
        </>
    )
}


export const RadioButton= (props)=> {
    const [value , setValue] = useState(0)

    const click=(val)=>{
        setValue(val)
        props.onPress(val)
    }
		return (
			<View  style={[styles.container,{}]}>
                {
                    props.RadioProps.map((radio,i)=>{
                        return(
                        <View key={i} style={{flexDirection: 'row'}}>
                            <TouchableOpacity
                                style={styles.radioCircle}
                                onPress={()=>click(radio.value)}>
                                    {value === radio.value && <View style={styles.selectedRb} />}
                            </TouchableOpacity>
                            <Text style={styles.radioText}>{radio.text}</Text>
                        </View>
                        )
                    })
                }
					
			</View>
		);
}