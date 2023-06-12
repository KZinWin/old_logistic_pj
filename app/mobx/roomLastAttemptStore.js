import { types } from "mobx-state-tree";
import { getData } from "../components/fetch";
import { API_URL } from "../components/common";
import { observable } from "mobx";

const lastAttempt = types.model('city',{
    id :types.string,
    time: types.Date,
})

const lastAttemptStore = types.model({
    roomslastattempts : types.array(lastAttempt)
})
.actions(self=>({
    async load(){
        var response = await getData(`${API_URL}/api/v0.1/rooms`)
            var attempts = []
            if(response.ok){
                if(self.roomslastattempts.length == 0){
                    response.data.map(res => {
                        attempts.push({id: res._id , time: new Date(res.updatedAt)})
                    })
                    this.updateLastAttempts(attempts)
                }
            }
            
    },
    updateLastAttempts(updateobject){
        // console.log(updateobject,'list')
        self.roomslastattempts = updateobject
    },
    updateeachAttempt(updateattempt){
        // console.log(updateattempt, 'update attempt')
        var newAttempts = self.roomslastattempts 
        var index = newAttempts.findIndex(x=>x.id == updateattempt.id)
        if(index){
            newAttempts[index] = updateattempt
            // console.log(newAttempts.toJS())
        }else{
            newAttempts.push(updateattempt)
        }
        this.updateLastAttempts(newAttempts.toJS())
    }
}))
.create({
    roomslastattempts:[]
})


export default observable(lastAttemptStore);