import React, { useState, useEffect } from 'react'
import firebase from 'react-native-firebase';

export const useVerifyCode = (phone, count) => {
  // console.log(phone,count)
  const [phoneAuthSnapshot, setphoneAuthSnapshot] = useState(undefined)
  useEffect(() => {
    const verifyCode = async () => {
      const phoneNumber = '+959' + phone;
      if (phone) {
        await firebase.auth().verifyPhoneNumber(phoneNumber)
          .on('state_changed', async (snapshot) => {
            // console.log(snapshot,'gg')
            switch (snapshot.state) {
              case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
                await setphoneAuthSnapshot(snapshot);
                break;
              // return phoneAuthSnapshot;
              case firebase.auth.PhoneAuthState.ERROR: // or 'error'
                await setphoneAuthSnapshot(snapshot);
                break;
              // return phoneAuthSnapshot;
            }
            // return phoneAuthSnapshot;
          },
            (error) => {
              // optionalErrorCb would be same logic as the ERROR case above,  if you've already handed
              // the ERROR case in the above observer then there's no need to handle it here
              alert(JSON.stringify(error))
              console.log(error);
              // verificationId is attached to error if required
              console.log(error.verificationId);
            },
            (phoneAuthSnapshot) => {
              console.log('phoneAuthSnapshot', phoneAuthSnapshot);
            }
          )
      }
    }
    verifyCode();
  }, [count]);
  return phoneAuthSnapshot
}

export const useConfirmCode = (verificationId, codeInput) => {
  const [confirmStatus, setConfirmStatus] = useState('')
  const [user, setUser] = useState({})
  const [message, setMessage] = useState('')
  useEffect(() => {
    const confirmCode = async () => {
      if (verificationId && codeInput) {
        const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, codeInput);
        await firebase.auth().signInWithCredential(credential)
          .then(async (user) => {
            setConfirmStatus('success')
            setMessage('Code Confirmed!')
            setUser(user)
          })
          .catch(error => {
            setConfirmStatus('fail')
            setMessage(`Code Confirm Error: ${error.message}`)
            setUser(undefined)
          });
      }
    }
    confirmCode();
  }, [verificationId, codeInput]);
  return { confirmStatus, message, user };
}