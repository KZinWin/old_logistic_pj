import { types } from "mobx-state-tree";
import AsyncStorage from "@react-native-community/async-storage";
import jwt_decode from "jwt-decode"
import { getData } from "../components/fetch";
import { API_URL } from "../components/common";


const busihr = types.model('busihr',{
    day: types.string,
    from: types.string,
    to: types.string
})

const UserStore = types.model({
    _id: types.string,
    avatar: types.model({
        Location: types.string,
        Key: types.string
    }),
    name: types.string,
    ph: types.string,
    email: types.string,
    strNo: types.string,
    ward: types.string,
    postcode: types.number,
    city: types.string,
    tsp: types.string,
    userType: types.string,
    busiLogo: types.model({
        Location: types.string,
        Key: types.string
    }),
    busiName: types.string,
    busiPh: types.string,
    busiEmail: types.string,
    busiRegNo: types.string,
    busiCat: types.string,
    busiSubCat: types.string,
    busiStrNo: types.string,
    busiWard: types.string,
    busiPost: types.number,
    busiCity: types.string,
    busiTsp: types.string,
    busiHr: types.maybeNull(types.array(busihr)),
    about: types.string,
    agreeTC: types.boolean,
    licFront: types.maybeNull(types.model({
        Location: types.string, 
        Key: types.string
    })),
    licBack: types.maybeNull(types.model({
        Location: types.string,
        Key: types.string
    })),
    nrcFront: types.maybeNull(types.model({
        Location: types.string,
        Key: types.string
    })),
    nrcBack: types.maybeNull(types.model({
        Location: types.string,
        Key: types.string
    })),
    regNo: types.maybeNull(types.string),
    platNo: types.maybeNull(types.string),
    type: types.maybeNull(types.string),
    year:  types.maybeNull(types.string),
    bank:  types.maybeNull(types.string),
    accNo:  types.maybeNull(types.string),
    iat: types.number,
})
.actions(self =>({
    async load(props){
        var token = await AsyncStorage.getItem('access_token')
        if(token){
            var response = await getData(`${API_URL}/api/v0.1/me`)
            if(response.ok){
                self.updateUserDetail(response.data)
            }
        }
    },
    updateUserDetail(updateDetail){
        self.UserStore = updateDetail
    }
}))
.create({
    _id: '',
    avatar: {
        Location: '',
        Key: ''
    },
    name: '',
    ph: '',
    email: '',
    strNo: '',
    ward: '',
    postcode: 0,
    city: '',
    tsp: '',
    userType: '',
    busiLogo:{
        Location: '',
        Key: ''
    },
    busiName: '',
    busiPh: '',
    busiEmail: '',
    busiRegNo: '',
    busiCat: '',
    busiSubCat: '',
    busiStrNo: '',
    busiWard: '',
    busiPost: 0,
    busiCity: '',
    busiTsp: '',
    busiHr: [],
    about: '',
    agreeTC: false,
    licFront: {Location: "", Key: ""},
    licBack: {Location: "", Key: ""},
    nrcFront: {Location: "", Key: ""},
    nrcBack: {Location: "", Key: ""},
    regNo: "",
    platNo: "",
    type: "",
    year: "",
    bank: "",
    accNo: "",
    iat: 0,
})

export default UserStore;