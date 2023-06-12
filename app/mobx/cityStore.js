import { types } from "mobx-state-tree";
import { getData } from "../components/fetch";
import { API_URL } from "../components/common";
import { observable } from "mobx";

const city = types.model('city',{
    id :types.string,
    name: types.string,
})

const CityStore = types.model({
    cities : types.array(city)
})
.actions(self=>({
    async load(){
        var response = await getData(`${API_URL}/api/v0.1/cities/all`)
        if(response.ok){
            var cities = response.data.map((x , i)=> {
                return ({id: x._id , name: x.name})
            })
            self.updateCity(cities)
            
        }else{
            console.log(response)
        }
      
            
    },
    updateCity(updatecity){
        self.cities = updatecity
    }
}))
.create({
    cities:[]
})

export default observable(CityStore);