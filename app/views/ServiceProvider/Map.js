import React, { useState, useEffect, useRef } from 'react'
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps'
import { View, PermissionsAndroid, Platform, Alert, Image, Switch, Text, TouchableHighlight } from 'react-native'
// import Geolocation from 'react-native-geolocation-service';
import Geolocation from '@react-native-community/geolocation';
import UserStore from '../../mobx/userStore';
import { API_URL, default_font, green_color, grey_color, light_grey_color, primary_color, white_color } from '../../components/common';
import io from 'socket.io-client';
import AppStore from '../../mobx/AppStore';
import { DatePickerForm, RadioButton, STComponent } from '../../components/form';
import { getDateForInput } from '../../components/date';
import { getData } from '../../components/fetch';
import ModalWrapper from 'react-native-modal-wrapper';
import { standard_font_size } from '../../components/font';
import { styles } from '../../components/styles';
import { deli_address_label, nrc_label, package_information_label, receiver_email_label, receiver_label, sender_label } from '../../components/labels and messges';

const MapTracking = (props) =>{
  const [ userToken, setUserToken ] = useState(AppStore.token)
  const [DeliveryIds, setDeliveryIds] = useState([])
  const [locations ,setlocations] = useState([{latitude: 0, longitude: 0}])
  const [delicoordinate, setdelicoordinate] = useState({latitude: 0, longitude: 0})
    const mapRef = useRef(null)
    const [routeCoordinates, setrouteCoordinates] = useState({
      latitude: 16.853726,
      longitude: 96.182963,
      latitudeDelta: 5,
      longitudeDelta: 5
    });
    const [selectdate, setselectdate] = useState(getDateForInput(new Date()))
    const [packagechoice, setpackagechoice] = useState([])
    const [packages, setpackages] = useState([])
    const [page, setPage] = useState(0)
    const [ chg, setchg ] = useState(false)
    const [deliselected, setdeliselected] = useState({})
    const radioProps =[{text: "Pick Up",value:0},{ text: "Receivable",value: 1}]
    const [pinColor, setPincolor] = useState(primary_color)
    const [pagniatepacks,setpaginatepacks] = useState([])
    const [modalVisible, setModalVisible] = useState(false)
    const [modalObject, setModalObject] = useState({})

    useEffect(() => {
      getLocation()
    }, [])

    useEffect(()=>{
      setlocations([])
      if(packagechoice.length !=0 ){
        getPackageDetails()         
      }
    },[packagechoice])

    
  const getPackageDetails = async(next) =>{
    var querytsp = ''
    var date = ''
    page == 0 ?( querytsp = 'pickUpTsp' , date = 'pickUpDate'):( querytsp = 'receiverTsp' , date = 'deliDate')
    var recLocation = []
    // console.log(packagechoice,'pg')
    packagechoice.map(async(data)=>{
      var res = await getData(`${API_URL}/api/v0.1/package-entries/all?${date}=${selectdate}&${querytsp}=${data}`)
        if(res.ok){
          // console.log(res)
          res.data.map(async(x)=>{
            if(page == 0){
              if(x.pickUpInfo && x.pickUpInfo.lat){
                recLocation.push({id: x._id,latitude: x.pickUpInfo.lat, longitude: x.pickUpInfo.long})
              }
            }else{
              if(x.receiverInfo && x.receiverInfo.lat){
                recLocation.push({id: x._id,latitude: x.receiverInfo.lat, longitude: x.receiverInfo.long})
              }
            }
          })
          await setlocations(JSON.parse(JSON.stringify(recLocation)))
        }
      })
      // await setlocations(JSON.parse(JSON.stringify(recLocation)))
  }
 

    useEffect(() => {
        setlocations([])
        getPackages()
        getdriver()
    }, [selectdate])

    useEffect(() => {
        getLocation()
    }, [DeliveryIds])

    useEffect(()=>{
      getPackages()
      setPincolor(page == 0 ? primary_color: green_color)
      setlocations([])
    },[page])

    // get Package by page
    const getPackages = () =>{
      var Packs =[]
      page == 0 ?
        getData(`${API_URL}/api/v0.1/package-entries/pickup/townships?pickUpDate=${selectdate}`)
        .then(res=>{

            res.data.map(x => {
              Packs.push({id: x,name: x})
            })
            setpackages(Packs)
        })
        :
        getData(`${API_URL}/api/v0.1/package-entries/receiver/townships?deliDate=${selectdate}`)
        .then(response => {
          response.data.map((data,i)=>{
            Packs.push({id: data, name: data})
          })
          setpackages(Packs)
        })

    }

    // get courier/driver current location
    const getLocation = () =>{
     
      const socket = io( API_URL+"/location", {
        "transports": ["polling","websocket"],
        "query": {
          "token": userToken
        }
      });

        socket.on("connect", (data) => {
          // console.log("socket connected");
        });
          if(DeliveryIds.length >0){
              DeliveryIds.map(deli=>{
                socket.emit("join",{"courierId": deli.id});
              })
              socket.on("locationUpdate", (data) => {
                var currentRegion = {
                  latitude: data.lat, 
                  longitude: data.long,
                  latitudeDelta: 5,
                  longitudeDelta: 5
                }
                setrouteCoordinates(currentRegion)
                var locations = DeliveryIds
                var courier = locations.findIndex(x=> x.id == data._id)
                if(courier !=-1){
                  locations[courier].coordinates={latitude: data.lat, longitude: data.long}
                }  
                setDeliveryIds(locations)
                mapRef.current.animateToRegion(currentRegion, 500);
              });
          }

          socket.on("disconnect", () => {
            // console.log("socket disconnected");
          });

      }

    // get today assigned courier/driver 
    const getdriver = (data) =>{
        getData(`${API_URL}/api/v0.1/deliveries?date=${selectdate}&&status=assigned`)
        .then(result=>{
          var ids = []
          result.data.data.map(res =>{
            ids.push({id: res._id,coordinates: {latitude: 0, longitude: 0}})
          })
          setDeliveryIds(ids)
        })
    }

    const pdetail = (id) =>{
      getData(`${API_URL}/api/v0.1/package-entries/${id}`)
      .then(response => {
          if (response.ok){
            setModalObject(response.data)
          }
      })
      setModalVisible(true)
    }

    return(
      <>
        <View style={{flex:1, padding: 5, paddingBottom: 0}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
              {/* <View style={{flex: 1, alignItems: 'center'}}> */}
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <RadioButton RadioProps={radioProps} onPress={(val)=>setPage(val)}/>
                </View>

            </View>
            <View style={{flex:1,flexDirection: 'row', height: 45,padding : 5}}>
                <DatePickerForm 
                    height={50}
                    value={selectdate}
                    onDateChange={(date) => {
                    setselectdate(date)
                    }}
                />
                <View style={{ flex: 1,paddingRight: 5}}>
                    <STComponent
                        isSelectSingle={false}
                        popupTitle={"Package(s)"}
                        title={"Package(s)"}
                        paddingTop = {0}
                        style={{height: 50}}
                        height={60}
                        verticalScroll={true}
                        value={packagechoice}
                        data={packages}
                        searchPlaceHolderText={"Package(s)"}
                        onSelect={(data)=>{
                          setpackagechoice(data)
                        }}
                        onRemoveItem={(data)=>{
                          setpackagechoice(data)
                        }}
                    />

                </View>
            </View>
        </View>
            
            
            <MapView 
                provider={PROVIDER_GOOGLE}
                style={{width: '100%', height: '80%', marginBottom: 0 }}
                region={routeCoordinates}
                ref={mapRef}
                // showsUserLocation={true}
                zoomEnabled = {true}
            >
              {
                locations.map((point,i)=>{
                
                  return(
                      <MapView.Marker
                        key={i}
                        coordinate={{
                          latitude: parseFloat(point.latitude),
                          longitude: parseFloat(point.longitude)
                        }}
                        onPress={()=>pdetail(point.id)}
                        pinColor={pinColor}
                      />
                  )
                  
                })
              }
              {
                DeliveryIds.map((deliMarker,index)=>{
                    return(
                      <MapView.Marker.Animated
                        key={index}
                        // ref={ref => (deliRefs.current[i] = ref)}
                        title={deliMarker.id}
                        coordinate={deliMarker.coordinates}
                        
                        />
                    )
                })
              }
              </MapView>
              <ModalWrapper
                    containerStyle={{ flexDirection: 'row', alignItems: 'center', justifyContent:'center', marginHorizontal: 10,}}
                    onRequestClose={()=>setModalVisible(false)}
                    style={{ flex: 1}}
                    visible={modalVisible}
                    backdropColor={'rgba(225,225,225,0.5)'}
                    overlayStyle={light_grey_color}>
                      {
                        modalObject ?
                        <View style={{padding: 10, borderBottomWidth: 0.5, borderRadius:10, borderBottomColor: primary_color }}>
                          <Text style={{color: grey_color, fontWeight: 'bold', textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, textDecorationLine: "underline"}}>
                              {package_information_label}
                          </Text>
                          <View style={styles.flexWrap}>
                              <View style={{width: '40%'}}>
                                  <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                                      {sender_label}
                                  </Text>
                              </View>
                              <View style={{width: '60%'}}>
                                  <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                                      { modalObject.senderInfo? modalObject.senderInfo.name: '-'}
                                  </Text>
                              </View>
                          </View>
                          <View style={styles.flexWrap}>
                              <View style={{width: '40%'}}>
                                  <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                                      {modalObject.pickUpInfo? 'Pick UP Address' : 'Sender Address'}
                                  </Text>
                              </View>
                              <View style={{width: '60%'}}>
                                  <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                                      {modalObject && modalObject.pickUpInfo ? modalObject.pickUpInfo.strNo : modalObject.senderInfo? modalObject.senderInfo.strNo : '-' },
                                      {modalObject && modalObject.pickUpInfo ? modalObject.pickUpInfo.ward: modalObject.senderInfo? modalObject.senderInfo.ward  : '-'},
                                      {modalObject && modalObject.pickUpInfo ? modalObject.pickUpInfo.city: modalObject.senderInfo? modalObject.senderInfo.city  : '-'},
                                      {modalObject && modalObject.pickUpInfo ? modalObject.pickUpInfo.tsp: modalObject.senderInfo? modalObject.senderInfo.tsp  : '-'}
                                  </Text>
                              </View>
                          </View>
                          <View style={styles.flexWrap}>
                              <View style={{width: '40%'}}>
                                  <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                                      {deli_address_label}
                                  </Text>
                              </View>
                              <View style={{width: '60%'}}>
                                  <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                                      {modalObject.receiverInfo? modalObject.receiverInfo.strNo : '-'},
                                      {modalObject.receiverInfo? modalObject.receiverInfo.ward : '-'},
                                      {modalObject.receiverInfo? modalObject.receiverInfo.city : '-'},
                                      {modalObject.receiverInfo? modalObject.receiverInfo.tsp : '-'}
                                  </Text>
                              </View>
                          </View>
                          <View style={styles.flexWrap}>
                              <View style={{width: '40%'}}>
                                  <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                                      {receiver_label}
                                  </Text>
                              </View>
                              <View style={{width: '60%'}}>
                                  <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                                    {modalObject.receiverInfo? modalObject.receiverInfo.name : '-'}
                                  </Text>
                              </View>
                          </View>
                          <View style={styles.flexWrap}>
                              <View style={{width: '40%'}}>
                                  <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                                      {receiver_email_label}
                                  </Text>
                              </View>
                              <View style={{width: '60%'}}>
                                  <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                                    {modalObject.receiverInfo? modalObject.receiverInfo.email : '-'}
                                  </Text>
                              </View>
                          </View>
                          <View style={styles.flexWrap}>
                              <View style={{width: '40%'}}>
                                  <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                                      {nrc_label}
                                  </Text>
                              </View>
                              <View style={{width: '60%'}}>
                                  <Text style={{color: grey_color, textAlign: 'left', fontFamily: default_font, fontSize: standard_font_size, paddingVertical: 10}}>
                                    {modalObject.receiverInfo? modalObject.receiverInfo.identification : '-'}
                                  </Text>
                              </View>
                          </View>
                      </View>
                        :
                        <></>
                      }

              </ModalWrapper>
      </>
    )
}
export default MapTracking;