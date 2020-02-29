import * as React from 'react';
import Constants from 'expo-constants';
// import * as firebase from 'firebase';
// import firebase from 'firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';

class Firebase {
  constructor(config = {}) {
    firebase.initializeApp(config);
    // Timestapm型を扱えるようにする
    // firebase.firestore().settings({timestampsInSnapshots:true});
    const db = firebase.firestore();
    // Userコレクションへの参照
    this.user = db.collection('user');
  }

  init = async () =>
    new Promise((resolve) =>
      // ログイン状態を監視
      firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) {
          console.log('no user');
          await firebase
            .auth()
            .signInAnonymously()
            .catch((error) => {
              console.error(error);
            });

          // 現在のログインユーザ
          this.uid = (firebase.auth().currentUser || {}).uid;

          // ログインユーザをDBに保存
          this.user
            .doc(`${this.uid}`)
            .set({
              name: Constants.deviceName,
            })
            .then(() => {
              console.log('set ok ' + Constants.deviceName);
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          console.log('user exists ' + user.uid);
          this.uid = user.uid;
        }
        resolve(this.uid);
      })
    );
}

const fire = new Firebase(Constants.manifest.extra.firebase);
export default fire;
