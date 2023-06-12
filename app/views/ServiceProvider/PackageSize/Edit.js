import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { SmallHighTextInput } from '../../../components/form';
import { HomePageBtn } from '../../../components/button';
import { getData, putData, deleteData } from '../../../components/fetch';
import { API_URL, red_color, grey_color, default_font, green_color } from '../../../components/common';
import { xS, xxS } from '../../../components/font';
import { succDelete, succUpdate, genError, weight_label, width_label, height_label, price_label, laborFee_label, insurance_label, update_label, delete_label } from '../../../components/labels and messges';
import { Toast } from 'native-base';
import { styles } from '../../../components/styles';

const PackageEdit =(props) =>{
    const [id, setid] = useState(props.navigation.getParam('id'))
    const [packageSize, setPackageSize] = useState({
        weight: '',
        height: '',
        price: '',
        width: '',
        laborFee : '',
        insurance: ''
    })

    useEffect(() => {
        getData(`${API_URL}/api/v0.1/package-sizes/${id}`)
        .then(response=>{
            setPackageSize(response.data)
        })
    }, [])

    const onValueChange = (key,value)=>{
        setPackageSize({
            ...packageSize,
            [key]: value
        })
    }

    const Update = () =>{
        if(packageSize.laborFee == '' ){
            packageSize.laborFee = 0 
        }
        if(packageSize.insurance == '' ){
            packageSize.insurance = 0
        }
        if(packageSize.price == ''){
            packageSize.price = 0
        }
        putData(`${API_URL}/api/v0.1/package-sizes/${id}`,packageSize)
        .then(response=>{
            if(response.ok){
                Toast.show({
                    text: succUpdate,
                    textStyle: {color: green_color, fontFamily: default_font},
                    duration: 1000
                })
                props.navigation.navigate('PackageSize')
            }
        })
    }   

    const del = async () =>{
        var response = await deleteData(`${API_URL}/api/v0.1/package-sizes/${id}`)
        if(response.ok){
            Toast.show({
                text: succDelete,
                textStyle: {color: green_color, fontFamily: default_font},
                duration: 1000
            })
            props.navigation.navigate('PackageSize')
        }else{
            Toast.show({
                text: response.err ? response.err : genError,
                textStyle: {color: red_color, fontFamily: default_font},
                duration: 1000
            })
        }
    }
    
    return(
        <View style={{ justifyContent: 'space-between',padding: 20}} >
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1.2, height: 40}}>
                    <Text style={styles.packageSizeLable}>{weight_label}</Text>
                </View>
                <View style={{flex: 1, height: 40}}>
                    <Text style={styles.packageSizeLable}>{width_label}</Text>
                </View>
                <View style={{flex: 1, height: 40}}>
                    <Text style={styles.packageSizeLable}>{height_label}</Text>
                </View>
                <View style={{flex: 1, height: 40}}>
                    <Text style={styles.packageSizeLable}>{price_label}</Text>
                </View>
            </View>
            <View style={{flexDirection: 'row'}}>
                <View style={{flex:1}}>
                    <SmallHighTextInput width={'90%'} type={'number'} value={`${packageSize.weight}`} onChangeText={(text)=>onValueChange('weight',text)}/>
                </View>
                <View style={{flex:1}}>
                    <SmallHighTextInput width={'90%'} type={'number'} value={`${packageSize.width}`} onChangeText={(text)=>onValueChange('width',text)}/>
                </View>
                <View style={{flex:1}}>
                    <SmallHighTextInput width={'90%'} type={'number'} value={`${packageSize.height}`} onChangeText={(text)=>onValueChange('height',text)}/>
                </View>
                <View style={{flex:1}}>
                    <SmallHighTextInput width={'90%'} type={'number'} value={`${packageSize.price}`} onChangeText={(text)=>onValueChange('price',text)}/>
                </View>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1, height: 40, alignItems: 'center'}}>
                    <Text style={styles.packageSizeLable}>{laborFee_label}</Text>
                </View>
                <View style={{flex: 1, height: 40, alignItems: 'center'}}>
                    <Text style={styles.packageSizeLable}>{insurance_label}</Text>
                </View>
            </View>
            <View style={{flexDirection: 'row'}}>
                <View style={{flex:1}}>
                    <SmallHighTextInput width={'90%'} type={'number'} value={`${packageSize.laborFee}`} onChangeText={(text)=>onValueChange('laborFee',text)}/>
                </View>
                <View style={{flex:1}}>
                    <SmallHighTextInput width={'90%'} type={'number'} value={`${packageSize.insurance}`} onChangeText={(text)=>onValueChange('insurance',text)}/>
                </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginVertical: 20 }}>
                <HomePageBtn width={'45%'} onPress={() => Update()}>{update_label}</HomePageBtn>
                <HomePageBtn width={'45%'} btnBg={red_color} onPress={() => del()}>{delete_label}</HomePageBtn>
            </View>
        </View>
    )
}

export default PackageEdit;