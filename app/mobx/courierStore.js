import { types } from "mobx-state-tree";
import { getData } from "../components/fetch";
import { API_URL } from "../components/common";
import { toJS } from "mobx";

const delivery = types.model('delivery', {
    id: types.string,
    avatar: types.model({
        Location: types.string,
        Key: types.string
    }),
    name: types.string,
    ph: types.string,
    strNo: types.string,
    ward: types.string,
    postcode: types.string,
    city: types.string,
    tsp: types.string,
    agreeTC: types.boolean,
    userType: types.string,
    userId: types.maybeNull(types.string)
})

const courierStore = types.model({
    deliveries: types.array(delivery)
})
    .actions(self => ({
        async load() {
            var response = await getData(`${API_URL}/api/v0.1/deliveries`)
            if (response.ok) {
                var result = response.data.data
                arrObj = []
                result.map((res, i) => {
                    arrObj.push({
                        id: res._id,
                        avatar: res.avatar,
                        name: res.name,
                        ph: res.ph,
                        strNo: res.strNo,
                        ward: res.ward,
                        postcode: `${res.postcode}`,
                        city: res.city,
                        tsp: res.tsp,
                        agreeTC: res.agreeTC,
                        userType: res.userType,
                        userId: res.userId == undefined ? null : res.userId
                    })
                })
            }
            self.uploadCourierList(arrObj)
        },
        uploadCourierList(updateDeliList) {
            self.deliveries = updateDeliList
        },
    }))
    .create({
        deliveries: []
    })

export default courierStore;