const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const app = admin.initializeApp();

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '128MB',
};

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});

// いいねをしたらpush（Firestoreでlikedが作成されたら）
exports.pushSendByLike = functions
  .runWith(runtimeOpts)
  .firestore.document('user/{fromUID}/liked/{likedPost}')
  .onCreate(async (snap, context) => {
    const likedPost = context.params.likedPost;
    const data = snap.data();

    const post = await app
      .firestore()
      .collection('post')
      .doc(likedPost)
      .get()
      .then((res) => res.data());
    const user = await post.user.get().then((res) => res.data());

    const { deviceToken = null, locale = 'ja_jp' } = user;
    if (!deviceToken) {
      console.log("user don't have deviceToken");
      return true;
    }
    console.log(deviceToken);

    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      body: JSON.stringify({
        to: deviceToken,
        badge: 1,
        title: locale === 'ja_jp' ? '新しい通知' : 'New notification',
        body: locale === 'ja_jp' ? 'いいねされました' : 'Your post liked',
        data: {
          screen: 'NotificationTab',
        },
        headers: {
          'content-type': 'application/json',
        },
      }),
    }).then((res) => res.json());

    console.log(response);

    if (response.errors) {
      console.error('push faild');
    } else {
      console.log('push successed');
    }
  });
