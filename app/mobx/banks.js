import { types } from "mobx-state-tree";
import { getData } from "../components/fetch";
import { API_URL } from "../components/common";
import { observable } from "mobx";
// import { observer } from "mobx-react";

const bank = types.model('bank',{
    id: types.string,
    name : types.string,
    logo: types.model({
        Location: types.string,
        Key: types.string
    })
})

const bankStore =types.model({
    banks: types.array(bank)
})
.actions(self => ({
    load(){
        getData(`${API_URL}/api/v0.1/banks/all`)
        .then(response =>{
            self.updatebanklist(response.data)
        })
        .catch(error => console.log(error))
    },
    updatebanklist(updatelist){
        var arrobjs =[]
        updatelist.map((listobj, i)=>(
            
        arrobjs.push({id: listobj._id, name: listobj.name, logo: listobj.logo})
        ))
        self.banks = arrobjs
    }
}))
.create({
    banks: []
})

export default observable(bankStore);