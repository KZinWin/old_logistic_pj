import React, { useState, useEffect, useRef } from 'react'
import MapView, { PROVIDER_GOOGLE, Marker, AnimatedRegion } from 'react-native-maps'
import { View, PermissionsAndroid, Platform, Alert, Dimensions } from 'react-native'
// import Geolocation from 'react-native-geolocation-service';
import Geolocation from '@react-native-community/geolocation';
import UserStore from '../../mobx/userStore';
import { API_URL } from '../../components/common';
import io from 'socket.io-client';
import AppStore from '../../mobx/AppStore';
const LiveTracking = (props) =>{
  const [ userToken, setUserToken ] = useState(AppStore.token)
  const [Region, setRegion] = useState({})
  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const mapRef = useRef(null)
  const [routeCoordinates, setrouteCoordinates] = useState({
                                                          latitude: 16.853726,
                                                          longitude: 96.182963,
                                                          latitudeDelta: 0.02,
                                                          longitudeDelta: 0.02
                                                        });
  const [LATITUDE_DELTA,setlatitudeDelta] = useState(0.02);
  const [LONGITUDE_DELTA, setLongitudeDelta] = useState(0.02)
  const markerRef = useRef([])
  const [courier_id, setcourierId] = useState(0)

    useEffect(() => {
      getLocation()
    }, [])

    useEffect(() => {
      setcourierId(props.navigation.getParam('courier_id'))
    }, [props])

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
        setInterval(() => {
          // if(routeCoordinates.latitude == 0 && routeCoordinates.longitude == 0){
            socket.emit("join",{"courierId": props.navigation.getParam("courier_id")});
          // }
        }, 1000);

          socket.on("locationUpdate", (data) => {
            // console.log(data)
            var currentRegion = {
              latitude: data.lat, 
              longitude: data.long,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            }
            setrouteCoordinates(currentRegion)
            mapRef.current.animateToRegion(currentRegion, 500);
          });

          socket.on("disconnect", () => {
            // console.log("socket disconnected");
          });

      }

      // const changeRegion = (region) =>{ 
      //   console.log(LATITUDE_DELTA , region.latitudeDelta , LONGITUDE_DELTA , region.longitudeDelta)
      //   if(LATITUDE_DELTA != region.latitudeDelta && LONGITUDE_DELTA != region.longitudeDelta){
      //     setLongitudeDelta(region.longitudeDelta), 
      //     setlatitudeDelta(region.latitudeDelta)
      //   }
      // }

    return(
        <View style={{flex:1}}>
            <MapView 
                provider={PROVIDER_GOOGLE}
                style={{width: '100%', height: '100%'}}
                region={routeCoordinates}
                ref={mapRef}
                // onRegionChange={(region) =>changeRegion(region)}
                // onRegionChangeComplete={(region) => changeRegion(region)}
                // showsUserLocation={true}
                // onMapReady={()=>onMapReady()}
                zoomEnabled = {true}
            >
              {/* { */}
                {/* // routeCoordinates.map((local,i)=>{ */}
                <MapView.Marker.Animated
                  ref = {markerRef}
                    flat={true}
                    coordinate={
                        routeCoordinates
                    }
                      
                  />
            </MapView>
        </View>
    )
}
export default LiveTracking;