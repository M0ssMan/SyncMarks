/* global firebase */
import { isNil } from 'lodash';
import { ACCOUNT } from './account';
import { CONFIG } from './config';

firebase.initializeApp(CONFIG);
const fb = firebase.database();

firebase.auth().signInWithEmailAndPassword(ACCOUNT.email, ACCOUNT.password)
  .catch(err => {
    console.error('firebase sign in failed', err);
  })
  .then(() => fb.ref('/initialized').once('value'))
  .then(snapshot => {
    const isInitialized = snapshot.val();
    if (isNil(isInitialized)) {
      console.log('db was initialized');
      fb.ref().update({
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

function getProfiles() {
  return fb.ref('/profiles').once('value')
  .then(snapshot => {
    return snapshot.val();
  })
  .catch(err => console.error(err));
}

function getBookmarks() {
  return fb.ref('/bookmarks').once('value')
  .then(snapshot => snapshot.val())
  .catch(err => console.error(err));
}

function setBookmarks(treeToUpdate) {
  return fb.ref('/bookmarks').set(treeToUpdate)
    .then(() => getBookmarks())
    .catch(err => console.error(err));
}

const fbMethods = {
  getProfiles,
  getBookmarks,
  setBookmarks
};

export default fbMethods;
