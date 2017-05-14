/* global firebase */
import { isNil } from 'lodash';
import { ACCOUNT } from './account';
import { CONFIG } from './config';

firebase.initializeApp(CONFIG);
const db = firebase.database();

firebase.auth().signInWithEmailAndPassword(ACCOUNT.email, ACCOUNT.password)
  .catch(err => {
    console.error('firebase sign in failed', err);
  })
  .then(() => db.ref('/initialized').once('value'))
  .then(snapshot => {
    const isInitialized = snapshot.val();
    if (isNil(isInitialized)) {
      console.log('db was initialized');
      db.ref().update({
        initialized: true,
        bookmarks: false,
        profiles: {
          home: {
            text: 'Home'
          },
          work: {
            text: 'Work'
          },
          laptop: {
            text: 'Laptop'
          },
          mobile: {
            text: 'Mobile'
          }
        }
      });
    }
  })
  .catch(err => {
    console.error(err);
  });

const fbMethods = {
  getProfiles() {
    return db.ref('/profiles').once('value')
    .then(snapshot => {
      console.log('profiles', snapshot.val());
      return snapshot.val();
    });
  },
  getBookmarks() {
    return db.ref('/bookmarks').once('value')
      .then(snapshot => snapshot.val());
  },
  setBookmarks(treeToUpdate) {
    console.log('treeToUpdate', treeToUpdate);
    return db.ref('/bookmarks').set(treeToUpdate)
  }
};

export default fbMethods;
