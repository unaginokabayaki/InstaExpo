import * as Random from 'expo-random';
import Constants from 'expo-constants';
// import * as firebase from 'firebase';
// import firebase from 'firebase';
import * as firebase from 'firebase';
import 'firebase/firestore';

// Firebaseのバージョンに注意
class Firebase {
  constructor(config = {}) {
    firebase.initializeApp(config);
    // Timestapm型を扱えるようにする
    // firebase.firestore().settings({timestampsInSnapshots:true});
    const db = firebase.firestore();
    // コレクションへの参照
    this.user = db.collection('user');
    this.post = db.collection('post');
    this.tag = db.collection('tag');
    this.notification = db.collection('notification');
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

  getUser = async (uid = null) => {
    // uidがない場合、匿名ユーザのuidを使う
    const userId = !uid ? this.uid : uid;

    try {
      const user = await this.user
        .doc(userId)
        .get()
        .then((res) => res.data())
        .catch((err) => console.log(err));

      return {
        uid: userId,
        name: user.name,
        img: user.img,
      };
    } catch ({ message }) {
      console.error(message);
      return { error: message };
    }
  };

  uploadFileSync = async (uri) => {
    const ext = uri.split('.').slice(-1)[0];
    const randomBytes = await Random.getRandomBytesAsync(8);
    const path = `file/${this.uid}/${randomBytes.join('-')}.${ext}`;
    console.log(`dest: ${path}`);

    return new Promise(async (resolve, reject) => {
      const blob = await fetch(uri).then((response) => response.blob());

      const ref = firebase
        .storage()
        .ref()
        .child(path);
      const uploadTask = ref.put(blob);

      const unsbscribe = uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        // next
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log('Upload is running');
              break;
            default:
              break;
          }
        },
        // error
        (err) => {
          console.log(err);
          unsbscribe();
          reject(err);
        },
        // complete
        async () => {
          unsbscribe();
          const url = await uploadTask.snapshot.ref.getDownloadURL();
          // const url = await ref.getDownloadURL();/
          resolve(url);
        }
      );
    });
  };

  changeUserImg = async (file = '') => {
    try {
      const remoteUri = await this.uploadFileSync(file.uri);
      console.log(remoteUri);

      this.user.doc(`${this.uid}`).update({
        img: remoteUri,
      });

      return remoteUri;
    } catch (e) {
      console.error(e.message);
      return { error: e.message };
    }
  };

  createPost = async (text = '', file = '', type = 'photo') => {
    try {
      const remoteUri = await this.uploadFileSync(file.uri);
      // tagを検出
      const tags = text.match(
        // /#[一-龠_ぁ-ん_ァ-ヴーａ-ｚＡ-Ｚa-zA-Z0-9]+/gi
        // /[#]{0,2}?(w*[一-龠_ぁ-ん_ァ-ヴーａ-ｚＡ-Ｚa-zA-Z0-9]+|[a-zA-Z0-9_]+|[a-zA-Z0-9_]w*)/gi
        // /#(w*[一-龠_ぁ-ん_ァ-ヴーａ-ｚＡ-Ｚa-zA-Z0-9]+|[a-zA-Z0-9_]+|[a-zA-Z0-9_]w*)/gi
        /#[一-龠_ぁ-ん_ァ-ヴーａ-ｚＡ-Ｚa-zA-Z0-9]+/gi
      );

      await this.post.add({
        text,
        type,
        fileWidth: type === 'photo' ? file.width : null,
        fileHeight: type === 'photo' ? file.height : null,
        fileUri: remoteUri,
        user: this.user.doc(`${this.uid}`),
        tag: tags
          ? tags.reduce((acc, cur) => {
              // #を除外したtagをkeyにdateをセット
              acc[cur.replace(/#/, '')] = Date.now();
              return acc;
            }, {})
          : null,
        timestamp: Date.now(),
      });

      if (tags) {
        await Promise.all(
          tags.map((tag) => {
            // #を除外
            const t = tag.replace(/^#/, '');
            return this.tag.doc(t).set({
              name: t,
            });
          })
        );
      }

      return true;
    } catch (e) {
      console.error(e.message);
      return { error: e.message };
    }
  };

  getPost = async (pid = '0') => {
    try {
      const post = await this.post.doc(pid).get();
      const user = await post.user.get().then((res) => res.data());

      user.uid = post.user.id;
      delete post.user;

      const liked = await this.user
        .doc(`${this.uid}`)
        .collection('liked')
        .doc(`${pid}`)
        .get()
        .then((userlikeddoc) => userlikeddoc.exists);

      return {
        pid,
        ...post,
        liked,
        user,
      };
    } catch (e) {
      console.error(e.message);
      return { error: e.message };
    }
  };

  getPosts = async (cursor = null, num = 5) => {
    try {
      let ref = await this.post.orderBy('timestamp', 'desc').limit(num);

      // カーソルがある場合は次のデータから始める
      if (cursor) {
        ref = ref.startAfter(cursor);
      }

      const snapshots = await ref.get();
      const data = [];

      // 全部データ読むまで待つ
      await Promise.all(
        snapshots.docs.map(async (doc) => {
          if (doc.exists) {
            const post = doc.data() || {};
            const user = await post.user.get().then((res) => res.data());
            // console.log(post.user.id);
            // console.log(user);

            user.uid = post.user.id;
            delete post.user;

            // console.log(post);
            // console.log(user);
            const liked = await this.user
              .doc(`${this.uid}`)
              .collection('liked')
              .doc(`${doc.id}`)
              .get()
              .then((userlikeddoc) => userlikeddoc.exists);

            data.push({
              // key: doc.id,
              pid: doc.id,
              ...post,
              liked,
              user,
            });
          }
        })
      );

      // 最後のデータを保存して後で使う
      const datalen = snapshots.docs.length;
      const lastVisible = datalen > 0 ? snapshots.docs[datalen - 1] : null;

      // データと最後尾を返す
      return { data, cursor: lastVisible };
    } catch (e) {
      console.error(e.message);
      return { error: e.message };
    }
  };

  getThumbnails = async (
    { uid = null, tag = null },
    cursor = null,
    num = 6
  ) => {
    console.log({ uid, tag });

    try {
      let ref;
      if (uid) {
        // 自分が投稿したデータを取得
        ref = this.post
          .where('user', '==', this.user.doc(uid))
          .orderBy('timestamp', 'desc')
          .limit(num);
      } else if (tag) {
        // tag.xxx を持っているデータを取得
        const tagname = `tag.${tag.replace(/#/, '')}`;
        ref = this.post
          .where(tagname, '>', 0)
          .orderBy(tagname, 'desc')
          .limit(num);
      } else {
        return { data: null, cursor: null };
      }

      if (cursor) {
        ref = ref.startAfter(cursor);
      }

      const snapshots = await ref.get();
      const data = [];

      await Promise.all(
        snapshots.docs.map(async (doc) => {
          if (doc.exists) {
            const post = doc.data() || {};

            data.push({
              // key: doc.id,
              pid: doc.id,
              thumbnail: post.fileUri,
              type: post.type,
            });
          }
        })
      );

      const datalen = snapshots.docs.length;
      const lastVisible = datalen > 0 ? snapshots.docs[datalen - 1] : null;

      return { data, cursor: lastVisible };
    } catch (e) {
      console.error(e.message);
      return { error: e.message };
    }
  };

  getTags = async (keyword = null) => {
    const strlength = keyword.length;
    const strFrontCode = keyword.slice(0, strlength - 1);
    const strEndCode = keyword.slice(strlength - 1, strlength);

    // 文字列の前方一致検索のため、最後の文字列は次の文字コードまでを範囲にする
    // aaaaa < aaab の検索で aaaaaの前方一致検索ができる
    const startCode = keyword;
    const endCode =
      strFrontCode + String.fromCharCode(strEndCode.charCodeAt(0) + 1);
    console.log(`${startCode} ~ ${endCode}`);

    const shapshot = await this.tag
      .where('name', '>=', startCode)
      .where('name', '<', endCode)
      .get();

    return shapshot.docs.map((doc) => ({ name: doc.id, key: doc.id }));
  };

  // userのcollectionにいいねしたpostを保存する
  likePost = async (item = {}) => {
    try {
      let liked = true;
      await this.user
        .doc(`${this.uid}`)
        .collection('liked')
        .doc(`${item.pid}`)
        .get()
        .then(async (doc) => {
          if (!doc.exists) {
            this.user
              .doc(`${this.uid}`)
              .collection('liked')
              .doc(`${item.pid}`)
              .set({ timestamp: Date.now() });

            this.notification.add({
              type: 'like',
              uid: doc.id,
              post: this.post.doc(`${item.pid}`),
              from: this.user.doc(`${item.uid}`),
              timestamp: Date.now(),
            });

            liked = true;
          } else {
            this.user
              .doc(`${this.uid}`)
              .collection('liked')
              .doc(`${item.pid}`)
              .delete();

            const snapshot = await this.notification
              .where('type', '==', 'like')
              .where('post', '==', this.post.doc(`${item.pid}`))
              .where('from', '==', this.user.doc(`${item.uid}`))
              .get();

            await Promise.all(
              snapshot.docs.map(async (d) => {
                await d.ref.delete();
              })
            );

            liked = false;
          }
        });

      return liked;
    } catch (e) {
      console.error(e.message);
      return { error: e.message };
    }
  };
}

const fire = new Firebase(Constants.manifest.extra.firebase);
export default fire;
