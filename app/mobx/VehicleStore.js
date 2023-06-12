import { types } from "mobx-state-tree";
import { getData } from "../components/fetch";
import { API_URL } from "../components/common";

const vtype = types.model('vtype',{
    id: types.string,
    name :types.string
})

const VehicleStore = types.model({
    Vtypes : types.array(vtype)
})
.actions(self=>({
    async load(){
        var response = await getData(`${API_URL}/api/v0.1/vehicle-types/all`)
        if(response.ok){
            
            var datalist = response.data.map((x,i)=>{
                return {id: x._id, name: x.name}
            })
            self.updateVtype(datalist)
        }else{
            console.log(response)
        }
    },
    updateVtype(updateVtype){
        self.Vtypes = updateVtype
    }
}))
.create({
    vtypes: []
})

export default VehicleStore;