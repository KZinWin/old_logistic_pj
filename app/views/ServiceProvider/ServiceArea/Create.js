import React, {useState, useEffect} from 'react';
import CityStore from '../../../mobx/cityStore';
import {View, Text, Picker, ScrollView} from 'react-native';
import {STComponent, OriginTextInput, RNPicker} from '../../../components/form';
import {styles} from "../../../components/styles";

import {
  type_three_color,
  grey_color,
  default_font,
  light_grey_color,
  API_URL,
  primary_color,
  red_color,
  white_color,
  green_color
} from '../../../components/common';
import {HomePageBtn} from '../../../components/button';
import {toJS} from 'mobx';
import {postData, getData} from '../../../components/fetch';
import { Toast } from 'native-base';
import useValidAPiCall from '../../../components/validCallApi';
import { validErrormessage, succRegister, Tsp_label, Price_label, post_code_label, price_label, register_label } from '../../../components/labels and messges';
import { xxS } from '../../../components/font';
import { State_label } from "../../../components/labels and messges";

const ServiceAreaRegister = props => {
  const [cities, setcities] = useState([]);
  const [pickUpTwsp, setpickUpTwsp] = useState([]);
  const [deliTwsps, setdeliTwsp] = useState([]);
  const [pickUp, setpickUp] = useState({
      city: '',
      tsp: '',
      post: '',
    });
  const [deli, setdeli] = useState({
      city: '',
      tsp: '',
      post: '',
  })
  const [price, setPrice] = useState('')
  const [init, setinit] = useState(0)
  const isValid = useValidAPiCall(Object.assign({},pickUp,deli),init)

  useEffect(() => {
    async function loadcity() {
      await CityStore.load();

      setcities(toJS(CityStore.cities));
    }
    loadcity();
  }, []);

  const changeTwsp = async (type,index) => {
    var response = await getData(
      `${API_URL}/api/v0.1/cities/${index}/townships`,
    );
    var townships = [];
    response.data.map((township, i) => {
      townships.push({
        id: township._id,
        name: township.name,
        cityId: township.cityId,
      });
    });
    type == 'pickUp'?
    setpickUpTwsp(townships): setdeliTwsp(townships)
  };

  const changeValue = (type,key, value) => {
    type == 'pickUp'? 
      setpickUp({
        ...pickUp,
        [key]: value,
      })
      : setdeli({...deli, [key]: value})
  };

  const reset_all = () =>{
    setPrice('')
    setpickUp({tsp: '', city: '',post: ''})
    setdeli({tsp: '', city: '',post: ''})
  }

  const Register = async () => {
    setinit(init +1)
    payload = Object.assign({},{pickUp: pickUp},{deli: deli},{price: price == ''? 0 : price})
    if(isValid){
        var response = await postData(`${API_URL}/api/v0.1/service-areas`, payload);
        if (response.ok) {
          Toast.show({
            text: succRegister,
            textStyle: {color: green_color, fontFamily: default_font},
            duration: 1000
          })
          props.navigation.navigate('SAlist');
        } else {
          Toast.show({
            text: response.err,
            textStyle: {color: red_color, fontFamily: default_font},
            onClose: () => reset_all()
          })
        }
    }else{
      Toast.show({
        text: validErrormessage,
        textStyle: {color: red_color, fontFamily: default_font},
        duration: 1000
      })
    }
  };

  return (
    <ScrollView style={{flex: 1, flexDirection: 'column', padding: 20}}>
      {/* pick up */}
     <Text style={styles.PackageLabel}>PickUp </Text>

      <STComponent
        isSelectSingle={true}
        popupTitle={State_label}
        title={pickUp.city? pickUp.city:State_label}
        label={State_label}
        required 
        value={pickUp.city}
        preSelectedItem={{ key: 'name', value: pickUp.city }}
        data={cities}
        searchPlaceHolderText={State_label}
        onChangeSelect={data => { 
          if(data.name != '') {
            setpickUp({
              ...pickUp,
              city: data.name,
              tsp: ''
            })
            changeTwsp('pickUp',data.id);
          }else{
              setpickUpTwsp([])
          }
        }}
      />


      <View
        style={{
          flex: 1,
          alignSelf: 'stretch',
          flexDirection: 'row',
          paddingTop: 0,
        }}>
        <View style={{flex: 1, marginHorizontal: 5}}>
          <STComponent
            // disabled
            label={Tsp_label}
            required 
            style={{height: 49}}
            value= {pickUp.tsp} 
            isSelectSingle={true}
            popupTitle={Tsp_label}
            preSelectedItem={{ key: 'name', value: pickUp.tsp }}
            title={pickUp.tsp ? pickUp.tsp : Tsp_label}
            data={pickUpTwsp}
            searchPlaceHolderText={Tsp_label}
            onChangeSelect={data => {
                  changeValue('pickUp','tsp', data.name);
            }}
          />
        </View>
          
          <View style={{flex: 1, marginHorizontal: 5}}>
              <OriginTextInput
                required 
                height={50}
                value = {`${pickUp.post}`}
                label={post_code_label}
                type={'number'}
                placeholder={post_code_label}
                width={'100%'}
                onChangeText={number => changeValue('pickUp','post', number)}
              />
          </View>
      </View>

      {/* deli  */}
      <Text style={styles.PackageLabel}>Delivery  </Text>

      <STComponent
        isSelectSingle={true}
        popupTitle={State_label}
        title={deli.city? deli.city:State_label}
        label={State_label}
        required 
        value={deli.city}
        preSelectedItem={{ key: 'name', value: deli.city }}
        data={cities}
        searchPlaceHolderText={State_label}
        onChangeSelect={data => {
            if(data.name != '') {
              setdeli({
                ...deli,
                city: data.name,
                tsp: ''
              })
              changeTwsp('deli',data.id)
            }else{
              setdeliTwsp([])
          }
        }}
      />

      <View
        style={{
          flex: 1,
          alignSelf: 'stretch',
          flexDirection: 'row',
          paddingTop: 0,
        }}>
        <View style={{flex: 1, marginHorizontal: 5}}>
          <STComponent
            // disabled
            label={Tsp_label}
            required 
            value= {deli.tsp} 
            style={{height: 49}}
            isSelectSingle={true}
            popupTitle={Tsp_label}
            preSelectedItem={{ key: 'name', value: deli.tsp }}
            title={deli.tsp ? deli.tsp : Tsp_label}
            data={deliTwsps}
            searchPlaceHolderText={Tsp_label}
            onChangeSelect={data => {
                  changeValue('deli','tsp', data.name);
            }}
          />
        </View>
          
          <View style={{flex: 1, marginHorizontal: 5}}>
              <OriginTextInput
                required 
                height={50}
                value = {`${deli.post}`}
                label={post_code_label}
                type={'number'}
                placeholder={post_code_label}
                width={'100%'}
                onChangeText={number => changeValue('deli','post',number)}
              />
          </View>
      </View>

      <OriginTextInput
        value={`${price}`}
        height={50}
        label={price_label}
        type={'number'}
        placeholder={price_label}
        width={'100%'}
        onChangeText={text =>setPrice(text)}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginVertical: 20,
        }}>
        <HomePageBtn onPress={() => Register()}>{register_label}</HomePageBtn>
      </View>
    </ScrollView>
  );
};

export default ServiceAreaRegister;
