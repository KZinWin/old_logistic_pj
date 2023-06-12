import React, { useState, useEffect } from 'react';
import CityStore from '../../../mobx/cityStore';
import {View, Picker, Text, ScrollView, Modal} from 'react-native';
import {STComponent, OriginTextInput, RNPicker} from '../../../components/form';
import {HomePageBtn} from '../../../components/button';
import {toJS, ObservableMap} from 'mobx';
import {postData, getData, putData, deleteData} from '../../../components/fetch';
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
  green_color,
} from '../../../components/common';
import { Toast } from 'native-base';
import { succUpdate, succDelete, Tsp_label, price, Price_label, validErrormessage, post_code_label, price_label, delete_label, update_label } from '../../../components/labels and messges';
import { xxS } from '../../../components/font';
import { State_label } from "../../../components/labels and messges";
import useValidAPiCall from '../../../components/validCallApi';

const ServiceAreaEdit = props => {
  const [id, setId] = useState(props.navigation.getParam('Id'))
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
      // console.log("serviceid",props.navigation.getParam('Id'))

      var response = await getData(
        `${API_URL}/api/v0.1/service-areas/${id}`,
      );
      if (response.ok) {
        if(response.data.pickUp && response.data.deli){
          setpickUp(response.data.pickUp)
          setdeli(response.data.deli)
        }else{
          delete response.data["packageSizes"]
          setdeli(response.data)
        }
        setPrice(response.data.price)
      } 
      await CityStore.load();
      setcities(toJS(CityStore.cities));
    }
    loadcity();
  }, []);

  useEffect(() => {
    if (pickUp.city) {
      var cityId = CityStore.cities.find(x => x.name == pickUp.city);
      changeTwsp('pickUp',cityId.id);
    }
  }, [pickUp.city]);

  
  useEffect(() => {
    if (deli.city) {
      var cityId = CityStore.cities.find(x => x.name == deli.city);
      changeTwsp('deli',cityId.id);
    }
  }, [deli.city]);

  const changeTwsp = async (type,index) => {
    var response = await getData(`${API_URL}/api/v0.1/cities/${index}/townships`);
    var townships = [];
    response.data.map((township, i) => {
      townships.push({
        id: township._id,
        name: township.name,
        cityId: township.cityId,
      });
    });
    type == 'pickUp'? setpickUpTwsp(townships) : setdeliTwsp(townships)
  };

  const changeValue = (type,key, value) => {
    type == 'pickUp'? 
      setpickUp({
        ...pickUp,
        [key]: value,
      })
      : setdeli({...deli, [key]: value})
  };
  
  const deleteAction = () =>{
    deleteData(`${API_URL}/api/v0.1/service-areas/${id}` )
    .then(response=>{
        if(response.ok){
            Toast.show({
                text: succDelete,
                textStyle: {color: green_color,fontFamily: default_font},
                duration: 3000
              })
              props.navigation.navigate('SAlist')
        }
    })
}

  const Edit = async () => {
    setinit(init+1)
    payload = Object.assign({},{pickUp: pickUp},{deli: deli},{price: price == ''? 0: price})
    if(isValid){
      var response = await putData(`${API_URL}/api/v0.1/service-areas/${id}`,payload);
      if (response.ok) {
        Toast.show({
          text: succUpdate,
          textStyle: { color: green_color, fontFamily: default_font },
          duration: 1000
        });
        props.navigation.navigate('SAlist')
      } else {
        Toast.show({
          text: response.err,
          textStyle: { color: red_color, fontFamily: default_font },
          duration: 3000,
          // onClose: () => props.navigation.navigate('SAlist'),
        });
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
              setpickUp({
                ...pickUp,
                city: data.name,
                tsp: ''
              })
              changeTwsp('pickUp',data.id);
              if(data.name == '') {
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
              setdeli({
                ...deli,
                city: data.name,
                tsp: ''
              })
              changeTwsp('deli',data.id);
              if(data.name == '') {
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
          onChangeText={text => setPrice(text)}
        />
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 20,
        }}>
        <HomePageBtn width={'45%'} btnBg={red_color} onPress={()=>deleteAction()}>{delete_label}</HomePageBtn>
        <HomePageBtn width={'45%'} onPress={() => Edit()}>{update_label}</HomePageBtn>
      </View>
    </ScrollView>
  );
};

export default ServiceAreaEdit;
