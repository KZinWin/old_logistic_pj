import { types } from "mobx-state-tree";
import { observable } from "mobx";
import AsyncStorage from "@react-native-community/async-storage";
// import { observer } from "mobx-react";

const AppStore = types.model({
  token: types.string
})
  .actions(self => ({
    async load() {
      var token = await AsyncStorage.getItem('access_token')
      self.updateData('token', token)
    },
    updateData(key, value) {
      self[key] = value;
    }
  }))
  .create({
    token: ''
  })

export default observable(AppStore);