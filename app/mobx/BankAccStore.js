import { types } from "mobx-state-tree";
import { getData } from "../components/fetch";
import { API_URL } from "../components/common";
import { observable } from "mobx";

const bankAcc = types.model('bankAcc',{
    _id : types.string,
    bank : types.string ,
    accNo : types.string,
    userId: types.string
})

const bankAccStore = types.model({
    bankAccounts : types.array(bankAcc)
})
.actions(self => ({
    load(){
        getData(`${API_URL}/api/v0.1/bank-accounts`)
        .then(response => {
            self.updatebankAccont(response.data.data)
        })
        .catch(error => {console.log(error)})
    },
    updatebankAccont(updatebankAcc){
        self.bankAccounts = updatebankAcc
    }
}))
.create({
    bankAccounts : []
})

export default observable(bankAccStore);