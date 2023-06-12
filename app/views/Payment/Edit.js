import React, { useState ,useEffect } from "React";
import { View, ScrollView, Text, TouchableOpacity } from "react-native";
import { OriginTextInput, RNPicker, STComponent } from "../../components/form";
import { Picker, Icon, CheckBox } from "native-base";
import { light_grey_color, primary_color, bg_color, default_font, grey_color, API_URL } from "../../components/common";
import { HomePageBtn } from "../../components/button";
import { postData, getData,putData } from "../../components/fetch";
import bankAccStore from "../../mobx/BankAccStore";
import bankStore from "../../mobx/banks";
import {styles} from "../../components/styles";
import { toJS } from 'mobx'
import { acc_num_label, select_bank_label, update_label } from "../../components/labels and messges";

const BankAccEdit = (props) => {
    const [banklist, setbanklist] = useState([])
    const [ BAcc, setBAcc] = useState({
        bank:'',
        accNo: 0
    })

    useEffect(()=>{
        async function callcitymobx(){
            // console.log("bankid",props.navigation.getParam('Id'))
            var response = await getData(`${API_URL}/api/v0.1/bank-accounts/${props.navigation.getParam('Id')}`)
            // console.log(response)
            if(response.ok){
                setBAcc(response.data)
            }else{
                console.log(response.data)
            }
            setbanklist(toJS(bankStore.banks))
        }
        callcitymobx()
    },[])

    const Edit = () =>{
        const model = {
            bank: BAcc.bank,
            accNo: parseInt(BAcc.accNo)
        };
        putData(`${API_URL}/api/v0.1/bank-accounts/${props.navigation.getParam('Id')}`,model)
        .then(response => {
            if(response.ok){
                bankAccStore.load();
                props.navigation.navigate('PaymentList')
            }
        })
        .catch(error => { console.log(error)})
    }

    const changeValue = (key, value) =>{
        setBAcc({
            ...BAcc , 
            [key]: value
        })
    }

    // bank customize number box without use parseInt
    const bankCustomizeNumberBox = async(text) => {
        var value = text.replace( /^\D+/g, '')
        setBAcc({ ...BAcc , accNo: value})
    }

    return (
        <View style={{flexDirection: 'column', justifyContent: 'center', padding: 20}}>
            <ScrollView>
                <View>
                    <Text style={styles.FleetLabel}>{select_bank_label}</Text>
                    <STComponent
                        isSelectSingle={true}
                        popupTitle={select_bank_label}
                        title={BAcc.bank? BAcc.bank: select_bank_label}
                        required 
                        value={BAcc.bank}
                        preSelectedItem={{ key: 'name', value: BAcc.bank }}
                        data={banklist}
                        searchPlaceHolderText={select_bank_label}
                        onChangeSelect={data => {
                            changeValue('bank', data.name)
                        }}
                    />
                    <OriginTextInput label={acc_num_label} keyboardType={'number-pad'} edit={true} value={BAcc.accNo} onChangeText={(text)=>bankCustomizeNumberBox(text)} /> 
                </View>
               
                <View style={{flexDirection: 'row',justifyContent:'center', marginVertical: 20}}>
                    <HomePageBtn onPress={()=>Edit()}>{update_label}</HomePageBtn>
                </View>
            </ScrollView>
        </View>
    )
}

export default BankAccEdit;