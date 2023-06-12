import React, { useState, useEffect } from "react";
import { createSwitchNavigator, createAppContainer, NavigationActions } from "react-navigation";
import { Container, Content, Header as NBHeader, Body, Icon } from "native-base"
import Home from "../views/ServiceProvider/home";
import { HeaderScreen, HeaderBackScreen, HeaderTitleScreen, HeaderCallBackHome, TransparentHeader } from "./header";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator, DrawerNavigatorItems } from "react-navigation-drawer";
import { default_font, primary_color, grey_color, white_color, API_URL, yellow_color, red_color,green_color, reg_color } from "../components/common";
import { Text, View, TouchableOpacity, Image } from "react-native";
import io from 'socket.io-client';
import BackgroundGeolocation from "@mauron85/react-native-background-geolocation";
import Authloading from "../auth/authloading";
import { styles } from "../components/styles";
import { S, standard_font_size, xxxS } from "../components/font";
import QrScanner from "../components/qrScanner";
import UserStore from "../mobx/userStore";
import AppStore from "../mobx/AppStore";

import UserRegister from "../views/Auth/User_Register";
import Login from "../views/Auth/Login";
import ChooseUser from "../views/Auth/Choose_User";
import ChgPassword from "../views/Auth/Change_Password";
import ForgetPassword from "../views/Auth/Forget_Password";
import UserEdit from "../views/Auth/User_Edit";
import Logout from "../views/Auth/Logout";

import Dashboard from "../views/ServiceProvider/Dashboard";

import CourierList from "../views/ServiceProvider/Courier/Index";
import CourierRegister from "../views/ServiceProvider/Courier/Create";
import CourierEdit from "../views/ServiceProvider/Courier/Edit";
import CourierAssign from "../views/ServiceProvider/Courier/Courier_Assign";
import CourierAssignEdit from "../views/ServiceProvider/Courier/Courier_Assign_Edit";

import fleetlist from "../views/ServiceProvider/Fleet/Index";
import fleetRegister from "../views/ServiceProvider/Fleet/Create";
import fleetEdit from "../views/ServiceProvider/Fleet/Edit";
import Fpackage from "../views/ServiceProvider/Fleet/Fleet_Package_Assign";

import SenderList from "../views/ServiceProvider/Sender/Index";
import SenderRegister from "../views/ServiceProvider/Sender/Create";
import SenderEdit from "../views/ServiceProvider/Sender/Edit";

import PackageSize from "../views/ServiceProvider/PackageSize/Index";
import PackageEdit from "../views/ServiceProvider/PackageSize/Edit";

import PackageEntry from "../views/ServiceProvider/PackageEntry/Create"
import PackageList from "../views/ServiceProvider/PackageEntry/Index";
import PackageDetail from "../views/ServiceProvider/PackageEntry/Show";
import PackageEntryEdit from "../views/ServiceProvider/PackageEntry/Edit";
import PackageAssign from "../views/ServiceProvider/PackageEntry/Package_Assign";
import AssignPackageEdit from "../views/ServiceProvider/PackageEntry/Package_Assign_Edit";

import ServiceAreaRegister from "../views/ServiceProvider/ServiceArea/Create";
import ServiceAreaEdit from "../views/ServiceProvider/ServiceArea/Edit";
import SAlist from "../views/ServiceProvider/ServiceArea/Index";

import ExpenseList from "../views/ServiceProvider/Expense/Expense";
import ExpenseCreate from "../views/ServiceProvider/Expense/Create";
import ExpenseEdit from "../views/ServiceProvider/Expense/Edit";

import BankAccReg from "../views/Payment/Create";
import PaymentList from "../views/Payment/Index";
import BankAccEdit from "../views/Payment/Edit";

import packageListForDriver from "../views/Driver/PackageEntry/Index";
import packageDetailForDriver from "../views/Driver/PackageEntry/Show";

import PackageEntryForCustomer from "../views/Customer/PackageEntry/Create";
import PackageListForCustomer from "../views/Customer/PackageEntry/Index";
import PackageEntryEditForCustomer from "../views/Customer/PackageEntry/Edit";
import PackageEntryDetailForCustomer from "../views/Customer/PackageEntry/Show";

import PackageListForCourier from "../views/Courier/PackageEntry/Index";
import PackageEntryDetailForCourier from "../views/Courier/PackageEntry/Show";

import Demo from "../views/Demo";
import HelpPage from "../views/Help";
import ParcelDetail from "../views/ParcelDetail";
// map and livetracking
import LiveTracking from "../views/Customer/LIveTracking";
import MapTracking from "../views/ServiceProvider/Map";

import CustomChat from "../views/CustomChat/Chat";
import Messages from "../views/CustomChat/Message";
import ServiceProviderList from "../views/CustomChat/Service_Provider_List";
import Summary from "../views/ServiceProvider/PackageEntry/Summary";
import AsyncStorage from "@react-native-community/async-storage";
import { getData } from "../components/fetch";


const CustomerDrawerContentComponent = (props) => {
    const [userToken, setUsertoken] = useState(AppStore.token)
    const [counter, setcounter] = useState(1)
    const [messagecount, setmessagecount] = useState(0)
    const [messages, setmessages] = useState([])
    const [positions, setpositions] = useState([])


    return (
        userToken ? (
            <Container>
                <NBHeader style={{ height: 100, backgroundColor: white_color }}>
                    <Body>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ flex: 1 }}>
                                <Image source={{
                                    uri: `${API_URL}/api/v0.1/files?filename=${UserStore.UserStore.avatar.Key}&random=${Math.random()}`,
                                    headers: {
                                        Authorization: `Bearer ${userToken}`
                                    }
                                }}
                                    style={{ width: 50, height: 50, borderWidth: 0.5, borderRadius: 70, justifyContent: 'center', alignItems: 'center' }} />
                            </View>
                            <View style={{ flex: 2, flexDirection: 'column' }}>
                                <Text style={{ fontFamily: default_font, color: grey_color, fontSize: standard_font_size }}>{UserStore.UserStore.name.substring(0,30)}</Text>
                                {
                                    UserStore.UserStore.userType == 'NORMAL' ?
                                        <Text style={styles.smallText}>CUSTOMER</Text>
                                        :
                                        UserStore.UserStore.userType == 'BUSINESS' ?
                                            <Text style={{ fontFamily: default_font, color: grey_color, fontSize: xxxS }}>SERVICE PROVIDER</Text>
                                            :
                                            <Text style={{ fontFamily: default_font, color: grey_color, fontSize: xxxS }}>{UserStore.UserStore.userType}</Text>
                                }
                            </View>
                            {
                                UserStore.UserStore.userType == 'COURIER' ?
                                <>
                                </>
                                :
                                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                    <TouchableOpacity onPress={() => {
                                        props.navigation.navigate('UserEdit')
                                    }}>
                                        <Icon name={'edit-3'} type={'Feather'} style={{ fontFamily: default_font, color: grey_color, fontSize:  S }} />
                                    </TouchableOpacity>
                                </View> 
                            }
                        </View>
                    </Body>
                </NBHeader>
                <Content>
                    <DrawerNavigatorItems {...props} />
                </Content>
            </Container>
        ) : (
                <></>
            )
    )
};

const HomeStack = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            header: null,
        }
    },
    ChooseUser: {
        screen: ChooseUser,
        navigationOptions: {
            header: null,
        }
    },
});

const DashboardStack = createStackNavigator({
    Dashboard: {
        screen: Dashboard,
        navigationOptions: ({
            header: (({ navigation }) => <HeaderScreen headerText={"Dashboard"} navigation={navigation} />)
        })
    },
  
})

const UserEditStack = createStackNavigator({
    UserEdit: {
        screen: UserEdit,
        navigationOptions: ({
            header: (({ navigation }) => <HeaderScreen headerText={"User Edit"} navigation={navigation} />)
        })
    },
})

const SummaryStack = createStackNavigator({
    Summary:{
        screen: Summary,
        navigationOptions:{
            header: (({ navigation }) => <HeaderBackScreen headerText={"Summary"} navigation={navigation} />)
        }
    }
})
// AnonymousStack
const AnonymousStack = createStackNavigator({
    Home: {
        screen: HomeStack,
        navigationOptions: {
            header: null,
        }
    },
    Login: {
        screen: Login,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Login"} navigation={navigation} />)
        }
    },
    Demo: {
        screen: Demo,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Demo Video"} navigation={navigation} />)
        }
    },
    UserRegister: {
        screen: UserRegister,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"User Register"} navigation={navigation} />)
        }
    },
    Help: {
        screen: HelpPage,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Help"} navigation={navigation} />)
        }
    },
    ForgetPassword: {
        screen: ForgetPassword,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Forget Password"} navigation={navigation} />)
        }
    }
});

const ChangePasswordStack = createStackNavigator({
    ChangePassword: {
        screen: ChgPassword,
        navigationOptions: {
            header: (({ navigation }) => <HeaderScreen headerText={"Change Password"} navigation={navigation} />)
        }
    }
})

const CourierListStack = createStackNavigator({
    CourierList: {
        screen: CourierList,
        navigationOptions: {
            header: (({ navigation }) => <HeaderScreen headerText={"Couriers"} navigation={navigation} onPress={() => navigation.navigate('CourierRegister')} />)
        }
    },
    CourierRegister: {
        screen: CourierRegister,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Courier Register"} navigation={navigation} />)
        }
    },
    CourierEdit: {
        screen: CourierEdit,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Courier Edit"} navigation={navigation} />)
        }
    },
    CourierAssign: {
        screen: CourierAssign,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Courier Assign"} navigation={navigation} />)
        }
    },
    CourierAssignEdit: {
        screen: CourierAssignEdit,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Courier Assign Edit"} navigation={navigation} />)
        }
    }
})

const FleetListStack = createStackNavigator({
    FleetList: {
        screen: fleetlist,
        navigationOptions: {
            header: (({ navigation }) => <HeaderScreen headerText={"Fleet List"} navigation={navigation} onPress={() => navigation.navigate("FleetRegister")} />)
        }
    },
    FleetRegister: {
        screen: fleetRegister,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Fleet Register"} navigation={navigation} />)
        }
    },
    FleetEdit: {
        screen: fleetEdit,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Fleet Edit"} navigation={navigation} />)
        }
    },
    FleetPackage: {
        screen: Fpackage,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Fleet's Package List"} navigation={navigation} />)
        }
    }
})

const SenderListStack = createStackNavigator({
    SenderList: {
        screen: SenderList,
        navigationOptions: {
            header: (({ navigation }) => <HeaderScreen headerText={"Sender List"} navigation={navigation} onPress={() => navigation.navigate("SenderRegister")} />)
        }
    },
    SenderRegister: {
        screen: SenderRegister,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Sender Register"} navigation={navigation} />)
        }
    },
    SenderEdit: {
        screen: SenderEdit,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Sender Edit"} navigation={navigation} />)
        }
    }

})

const ExpenseListStack = createStackNavigator({
    ExpenseList: {
        screen: ExpenseList,
        navigationOptions: {
            header: (({ navigation }) => <HeaderScreen headerText={"Expense List"} navigation={navigation} />)
        }
    },
    ExpenseCreate: {
        screen: ExpenseCreate,
        navigationOptions:{
            header: (({navigation}) => <HeaderScreen headerText={"Create Expense"} navigation={navigation} />)
        }
    },
    ExpenseEdit: {
        screen: ExpenseEdit,
        navigationOptions:{
            header: (({navigation}) => <HeaderBackScreen headerText={"Edit Expense"} navigation={navigation} />)
        }
    },
    // ExpenseDetail: {
    //     screen: ExpenseDetail,
    //     navigationOptions: {
    //         header: (({ navigation }) => <HeaderBackScreen headerText={"Expense Detail"} navigation={navigation} />)
    //     }
    // }
})

const PaymentListStack = createStackNavigator({
    PaymentList: {
        screen: PaymentList,
        navigationOptions: {
            header: (({ navigation }) => <HeaderScreen headerText={"Payment List"} navigation={navigation} onPress={() => navigation.navigate('BankRegister')} />)
        }
    },
    BankRegister: {
        screen: BankAccReg,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Bank Account Register"} navigation={navigation} />)
        }
    },
    BankAccEdit: {
        screen: BankAccEdit,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Bank Account Edit"} navigation={navigation} />)
        }
    }
})

const PackageEntryForCourierStack = createStackNavigator({
    PackageListForCourier: {
        screen: PackageListForCourier,
        navigationOptions: {
            header: (({ navigation }) => <HeaderScreen headerText={"Package List"} navigation={navigation} onPress={() => navigation.navigate('PackageEntryForCourier')}
            //  qrbar type="courier"
             />)
        }
    },
    PackageEntryDetailForCourier: {
        screen: PackageEntryDetailForCourier,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Package Entry"} navigation={navigation} />)
        }
    },
})

const PackageEntryForCustomerStack = createStackNavigator({
    PackageListForCustomer: {
        screen: PackageListForCustomer,
        navigationOptions: {
            header: (({ navigation }) => <HeaderScreen headerText={"Package List"} navigation={navigation} onPress={() => navigation.navigate('PackageEntryForCustomer')}/>)
        }
    },
    PackageEntryForCustomer: {
        screen: PackageEntryForCustomer,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Package Entry"} navigation={navigation} />)
        }
    },
    PackageEntryDetailForCustomer: {
        screen: PackageEntryDetailForCustomer,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={" PackageEntry Detail"} navigation={navigation} />)
        }
    },
    PackageEntryEditForCustomer: {
        screen: PackageEntryEditForCustomer,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Package Entry Edit"} navigation={navigation} />)
        }
    },
    LiveTracking: {
        screen: LiveTracking,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={""} navigation={navigation} />)
        }
    },
    summary: {
        screen: SummaryStack,
        navigationOptions: {
            header: null
        }
    }
})

const PackageEntryForDriverStack = createStackNavigator({
    PackageListForDriver: {
        screen: packageListForDriver,
        navigationOptions: {
            header: (({ navigation }) => <HeaderScreen headerText={"Package Entry LIST"} navigation={navigation} onPress={() => navigation.navigate('PackageEntryListForDriver')} 
            // qrbar type="driver"
            />)
        }
    },
    PackageDetailForDriver: {
        screen: packageDetailForDriver,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Package Entry Detail"} navigation={navigation} />)
        }
    }
    
})

const PackageEntryStack = createStackNavigator({
    packageList: {
        screen: PackageList,
        navigationOptions: {
            header: (({ navigation }) => <HeaderScreen headerText={"Package Entry List"} navigation={navigation} onPress={() => navigation.navigate('PackageEntry')} qrbar type="provider"/>)
        }
    },
    PackageEntry: {
        screen: PackageEntry,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Package Entry"} navigation={navigation} />)
        }
    },
    PackageAssign: {
        screen: PackageAssign,
        navigationOptions: {
            header: (({ navigation }) => <HeaderTitleScreen headerText={"Assign Package(s)"} navigation={navigation} />)
        }
    },
    PackageDetail: {
        screen: PackageDetail,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Package Entry Detail"} navigation={navigation} />)
        }
    },
    PackageEntryEdit: {
        screen: PackageEntryEdit,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Package Entry Edit"} navigation={navigation} />)
        }
    },
    AssignPackageEdit: {
        screen: AssignPackageEdit,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Assign Edit"} navigation={navigation} />)
        }
    },
    Qrscanner:{
        screen: QrScanner,
        navigationOptions:{
            header: (({ navigation }) => <HeaderBackScreen headerText={""} navigation={navigation} />)
        }
    },
    summary: {
        screen: SummaryStack,
        navigationOptions: {
            header: null
        }
    }
})

const Pricinginformation = createStackNavigator({
    PackageSize: {
        screen: PackageSize,
        navigationOptions: {
            header: (({ navigation }) => <HeaderScreen headerText={"Package Size List"} navigation={navigation} onPress={() => navigation.push('PackageSize')} />)
        }
    },
    PackageSizeEdit: {
        screen: PackageEdit,
        navigationOptions: {
            header: (({navigation}) => <HeaderScreen headerText={"Package Size Edit"} navigation={navigation} />) 
        }
    }
})

const ServiceAreaRegisterStack = createStackNavigator({
    SAlist: {
        screen: SAlist,
        navigationOptions: {
            header: (({ navigation }) => <HeaderScreen headerText={"Service Area List"} navigation={navigation} onPress={() => navigation.navigate('ServiceAreaRegister')} />)
        }
    },
    ServiceAreaRegister: {
        screen: ServiceAreaRegister,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Service Area Register"} navigation={navigation} />)
        }
    },
    ServiceAreaEdit: {
        screen: ServiceAreaEdit,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={"Service Area Edit"} navigation={navigation} />)
        }
    }
})

const MapScreenStack = createStackNavigator({
    // MapScreen: {
    //     screen: Mapscreen,
    //     navigationOptions:{
    //         header: (({ navigation }) => <HeaderBackScreen headerText={""} navigation={navigation} />)
    //     }
    // }
    MapTracking: {
        screen: MapTracking,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={""} navigation={navigation} />)
        }
    },
})
// custom chat
const CustomChatStack = createStackNavigator({
    Message: {
        screen: Messages,
        navigationOptions:{
            header: (({ navigation }) => <HeaderBackScreen headerText={"Messages"} navigation={navigation} />)
        }
    },
    CustomChat:{
        screen: CustomChat,
        navigationOptions:{
            header: (({navigation}) => <HeaderBackScreen headerText={"Chat"} navigation={navigation} />)
        }
    },
    ServiceProviderList: {
        screen: ServiceProviderList,
        navigationOptions: {
            header: (({ navigation }) => <HeaderBackScreen headerText={""} navigation={navigation} />)
        }
    }
})
//service provider stack
const ServiceProviderStack = createDrawerNavigator(
    {
        Dashboard: {
            screen: DashboardStack,
            navigationOptions: {
                title: 'Dashboard',
                // drawerLabel: () => null,
                drawerIcon: ({ tintColor }) => (
                    <Icon name={'dashboard'} type={'MaterialIcons'} style={{ fontFamily: default_font, color: grey_color, fontSize:  S }} />
                )
            }
        },
        PackageEntry: {
            screen: PackageEntryStack,
            navigationOptions: {
                title: 'Package Entry List',
                drawerIcon: ({ tintColor }) => (
                    <Icon name={'package'} type={'Octicons'} style={{ fontFamily: default_font, color: yellow_color, fontSize:  S }} />
                )
            }
        },
        UserEdit : {
            screen :UserEditStack,
            navigationOptions: {
                drawerLabel: () => null,
            }
        },
        CourierList: {
            screen: CourierListStack,
            navigationOptions: {
                title: 'Courier List',
                drawerIcon: ({ tintColor }) => (
                    <Icon name={'directions-bike'} type={'MaterialIcons'} style={{ fontFamily: default_font, color: green_color, fontSize:  S }} />
                )
            }
        },
        FleetList: {
            screen: FleetListStack,
            navigationOptions: {
                title: 'Fleet List',
                drawerIcon: ({ tintColor }) => (
                    <Icon name={'train-car'} type={'MaterialCommunityIcons'} style={{ fontFamily: default_font, color: red_color, fontSize:  S }} />
                )
            }
        },
        SenderList: {
            screen: SenderListStack,
            navigationOptions: {
                title: 'Sender List',
                drawerIcon: ({ tintColor }) => (
                    <Icon name={'person-outline'} type={'MaterialIcons'} style={{ fontFamily: default_font, color: primary_color, fontSize:  S }} />
                )
            }
        },
        // ParcelDetail: {
        //     screen: ParcelDetailStack,
        //     navigationOptions: {
        //         title: 'Parcel Detail'
        //     }
        // },
        Pricinginformation: {
            screen: Pricinginformation,
            navigationOptions: {
                title: 'Package Size List',
                drawerIcon: ({ tintColor }) => (
                    <Icon name={'package'} type={'Feather'} style={{ fontFamily: default_font, color: yellow_color, fontSize:  S }} />
                )
            }
        },
        
        ServiceAreaRegister: {
            screen: ServiceAreaRegisterStack,
            navigationOptions: {
                title: 'Service Area List',
                drawerIcon: ({ tintColor }) => (
                    <Icon name={'location-city'} type={'MaterialIcons'} style={{ fontFamily: default_font, color: reg_color, fontSize:  S }} />
                )
            }
        },
        ExpenseList: {
            screen: ExpenseListStack,
            navigationOptions: {
                title: 'Expense List',
                drawerIcon: ({ tintColor }) => (
                    <Icon name={'attach-money'} type={'MaterialIcons'} style={{ fontFamily: default_font, color: yellow_color, fontSize:  S }} />
                )
            }
        },
        // PackageListForCourier: {
        //     screen: PackageListForCourierStack,
        //     navigationOptions: {
        //         title: 'PackageListForCourier'
        //     }
        // },
        Map: {
            screen: MapScreenStack,
            navigationOptions: {
                title: 'Map',
                drawerIcon: ({tintColor}) => (
                    <Icon name={'map'} type={"Entypo"} style={{ fontFamily: default_font, color: grey_color, fontSize: S}} />
                )
            }
        },
        CustomChat: {
            screen: CustomChatStack,
            navigationOptions: {
                title: 'Message',
                drawerIcon: ({tintColor}) =>(
                    <Icon name={'message1'} type={"AntDesign"} style={{ fontFamily: default_font, color: green_color, fontSize: S}} />
                )
            }
        },
        ChangePassword: {
            screen: ChangePasswordStack,
            navigationOptions: {
                title: 'Change Password',
                drawerIcon: ({ tintColor }) => (
                    <Icon name={'key'} type={'MaterialCommunityIcons'} style={{ fontFamily: default_font, color: red_color, fontSize:  S }} />
                )
            }
        },
        Logout: {
            screen: Logout,
            navigationOptions: {
                title: 'Logout',
                drawerIcon: ({ tintColor }) => (
                    <Icon name={'logout'} type={'MaterialCommunityIcons'} style={{ fontFamily: default_font, color: grey_color, fontSize:  S }} />
                )
            }
        }
    },
    {
        initalRouteName: 'Dashboard',
        contentComponent: CustomerDrawerContentComponent,
        drawerOpenRoute: 'DrawerOpen',
        drawerCloseRoute: 'DrawerClose',
        drawerToggleRoute: 'DrawerToggle',
        drawerPosition: 'left',
        contentOptions: {
            labelStyle: {
                fontSize: standard_font_size,
                fontFamily: default_font,
                color: grey_color,
                fontWeight: "normal",
                fontStyle: 'normal'
            },
            style: {
                marginHorizontal: 20
            }
        }
    }
);
//Courier Stack
const CourierStack = createDrawerNavigator(
    {
    //    Dashboard: {
    //         screen: LiveTracking,
    //         navigationOptions: {
    //             title: 'Dashboard',
    //             drawerLabel: () => null,
    //             // drawerIcon: ({ tintColor }) => (
    //             //     <Icon name={'dashboard'} type={'MaterialIcons'} style={{ fontFamily: default_font, color: grey_color, fontSize:  S }} />
    //             // )
    //         }
    //     },
        PackageEntry: {
            screen: PackageEntryForCourierStack,
            navigationOptions: {
                title: 'Package Entry List',
                drawerIcon: ({ tintColor }) => (
                    <Icon name={'package'} type={'Octicons'} style={{ fontFamily: default_font, color: grey_color, fontSize:  S }} />
                )
            }
        },
        // UserEdit : {
        //     screen :UserEditStack,
        //     navigationOptions: {
        //         drawerLabel: () => null,
        //     }
        // },
        ChangePassword: {
            screen: ChangePasswordStack,
            navigationOptions: {
                title: 'Change Password',
                drawerIcon: ({ tintColor }) => (
                    <Icon name={'key'} type={'MaterialCommunityIcons'} style={{ fontFamily: default_font, color: grey_color, fontSize:  S }} />
                )
            }
        },
        Logout: {
            screen: Logout,
            navigationOptions: {
                title: 'Logout',
                drawerIcon: ({ tintColor }) => (
                    <Icon name={'logout'} type={'MaterialCommunityIcons'} style={{ fontFamily: default_font, color: grey_color, fontSize:  S }} />
                )
            }
        }
    },
    {
        initalRouteName: 'PackageEntry',
        contentComponent: CustomerDrawerContentComponent,
        drawerOpenRoute: 'DrawerOpen',
        drawerCloseRoute: 'DrawerClose',
        drawerToggleRoute: 'DrawerToggle',
        drawerPosition: 'left',
        contentOptions: {
            labelStyle: {
                fontSize: standard_font_size,
                fontFamily: default_font,
                color: grey_color,
                fontWeight: "normal",
                fontStyle: 'normal'
            },
            style: {
                marginHorizontal: 20
            }
        }
    }
);
//Customer Stack
const CustomerStack = createDrawerNavigator(
    {
        PackageEntryForCustomer: {
            screen: PackageEntryForCustomerStack,
            navigationOptions: {
                title: 'Package Entry List',
                drawerIcon: ({ tintColor }) => (
                    <Icon name={'package'} type={'Octicons'} style={{ fontFamily: default_font, color: grey_color, fontSize:  S }} />
                )
            }
        },
        UserEdit : {
            screen :UserEditStack,
            navigationOptions: {
                drawerLabel: () => null,
            }
        },
        PaymentList: {
            screen: PaymentListStack,
            navigationOptions: {
                title: 'Payment Account List',
                drawerIcon: ({ tintColor }) => (
                    <Icon name={'credit-card'} type={'Octicons'} style={{ fontFamily: default_font, color: grey_color, fontSize:  S }} />
                )
            }
        },
        CustomChat: {
            screen: CustomChatStack,
            navigationOptions: {
                title: 'Message',
                drawerIcon: ({tintColor}) =>(
                    <Icon name={'message1'} type={"AntDesign"} style={{ fontFamily: default_font, color: grey_color, fontSize: S }} />
                )
            }
        },
        ChangePassword: {
            screen: ChangePasswordStack,
            navigationOptions: {
                title: 'Change Password',
                drawerIcon: ({ tintColor }) => (
                    <Icon name={'key'} type={'MaterialCommunityIcons'} style={{ fontFamily: default_font, color: grey_color, fontSize:  S }} />
                )
            }
        },
        Logout: {
            screen: Logout,
            navigationOptions: {
                title: 'Logout',
                drawerIcon: ({ tintColor }) => (
                    <Icon name={'logout'} type={'MaterialCommunityIcons'} style={{ fontFamily: default_font, color: grey_color, fontSize:  S }} />
                )
            }
        }
    },
    {
        initalRouteName: 'PackageEntryForCustomer',
        contentComponent: CustomerDrawerContentComponent,
        drawerOpenRoute: 'DrawerOpen',
        drawerCloseRoute: 'DrawerClose',
        drawerToggleRoute: 'DrawerToggle',
        drawerPosition: 'left',
        contentOptions: {
            labelStyle: {
                fontSize: standard_font_size,
                fontFamily: default_font,
                color: grey_color,
                fontWeight: "normal",
                fontStyle: 'normal'
            },
            style: {
                marginHorizontal: 20
            }
        }
    }
);
//Driver Stack
const DriverStack = createDrawerNavigator(
    {
       // Dashboard: {
        //     screen: DashboardStack,
        //     navigationOptions: {
        //         title: 'Dashboard',
        //         drawerLabel: () => null,
        //         // drawerIcon: ({ tintColor }) => (
        //         //     <Icon name={'dashboard'} type={'MaterialIcons'} style={{ fontFamily: default_font, color: grey_color, fontSize:  S }} />
        //         // )
        //     }
        // },
        PackageEntryForDriver: {
            screen: PackageEntryForDriverStack,
            navigationOptions: {
                title: 'Package Entry List',
                drawerIcon: ({ tintColor }) => (
                    <Icon name={'package'} type={'Octicons'} style={{ fontFamily: default_font, color: grey_color, fontSize:  S }} />
                )
            }
        },
        UserEdit : {
            screen :UserEditStack,
            navigationOptions: {
                drawerLabel: () => null,
            }
        },
        PaymentList: {
            screen: PaymentListStack,
            navigationOptions: {
                title: 'Payment Account List',
                drawerIcon: ({ tintColor }) => (
                    <Icon name={'credit-card'} type={'Octicons'} style={{ fontFamily: default_font, color: grey_color, fontSize:  S }} />
                )
            }
        },
        ChangePassword: {
            screen: ChangePasswordStack,
            navigationOptions: {
                title: 'Change Password',
                drawerIcon: ({ tintColor }) => (
                    <Icon name={'key'} type={'MaterialCommunityIcons'} style={{ fontFamily: default_font, color: grey_color, fontSize:  S }} />
                )
            }
        },
        Logout: {
            screen: Logout,
            navigationOptions: {
                title: 'Logout',
                drawerIcon: ({ tintColor }) => (
                    <Icon name={'logout'} type={'MaterialCommunityIcons'} style={{ fontFamily: default_font, color: grey_color, fontSize:  S }} />
                )
            }
        }
    },
    {
        initalRouteName: 'PackageEntryForDriver',
        contentComponent: CustomerDrawerContentComponent,
        drawerOpenRoute: 'DrawerOpen',
        drawerCloseRoute: 'DrawerClose',
        drawerToggleRoute: 'DrawerToggle',
        drawerPosition: 'left',
        contentOptions: {
            labelStyle: {
                fontSize: standard_font_size,
                fontFamily: default_font,
                color: grey_color,
                fontWeight: "normal",
                fontStyle: 'normal'
            },
            style: {
                marginHorizontal: 20
            }
        }
    }
);

const Root = createSwitchNavigator(
    {
        AuthLoading: {
            screen: Authloading
        },
        Anonymous: {
            screen: AnonymousStack,
            navigationOptions: {
                header: null,
            }
        },
        ServiceProvider: {
            screen: ServiceProviderStack,
            navigationOptions: {
                header: null,
            },
        },
        Courier: {
            screen: CourierStack,
            navigationOptions: {
                header: null
            }
        },
        Customer: {
            screen: CustomerStack,
            navigationOptions: {
                header: null
            }
        },
        Driver: {
            screen: DriverStack,
            navigationOptions: {
                header: null
            }
        }
    },
    {
        header: null,
    }
);

export const AppContainer = createAppContainer(Root);



