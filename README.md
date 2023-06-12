# debug build 

## runing on android device

``` enable over usb debugging ```

Settings -> Developer Option ON 
Settings -> Developer Option -> USB debugging ON

``` Checking device is connected to ADB ```

 ` your path/sdk ` and run command
 ` adb devices `  // must only one device has to be connected to adb

 ``` Run App ```

under your project folder type this following command to run app 
 ` react-native run android ` or ` npm run android `

 ## runing on emulator 

``` start emulator ```

 go to your ` path/sdk/emulator ` and run command line for the list of avd 

 step 1 -> `emulator -list-avds`
 step 2 -> `emulator -avd <avd_name>`

 ``` Run App ```

 Run app on emulator as run on android device 


 ## running on ios device

 ``` ```

 # production build 

 ``apk release ``
 cd andriod && ./gradlew assembleRelease

 ``aab release ``
 cd android && ./gradlew bundleRelease
