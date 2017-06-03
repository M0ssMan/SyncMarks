/* global chrome window */
import {
  errorHandleWrapper,
  mapToStdOutput
} from 'utils';
import db from './db';

console.log('im in the background page!');
let chromeProfile;
let remoteBookmarks;

function getChromeProfile() {
  return new Promise((success, fail) => {
    chrome.storage.local.get('clientProfile', (storage) => {
      if (chrome.runtime.lastError) {
        fail(chrome.runtime.lastError);
        return;
      }
      success(storage.clientProfile);
    });
  });
}

function setChromeProfile(value) {
  return new Promise((success, fail) => {
    chrome.storage.local.set({
      clientProfile: value
    }, () => {
      if (chrome.runtime.lastError) {
        fail(chrome.runtime.lastError);
        return;
      }
      chromeProfile = value;
      success(value);
    });
  });
}

function getChromeBookmarks() {
  return new Promise((success, fail) => {
    chrome.bookmarks.getTree(bookmarkTree => {
      if (chrome.runtime.lastError) {
        fail(chrome.runtime.lasterror);
        return;
      }
      success(bookmarkTree);
    });
  });
}

function sync(syncOption) {
  const promises = [];
  promises.push(getChromeBookmarks());
  promises.push(db.getBookmarks());
  return Promise.all(promises)
    .then(result => {
      const chromeTree = result[0];
      const normalizedChromeTree = mapToStdOutput(chromeTree[0].children, chromeProfile);
      const dbTree = result[1];
      switch (syncOption) {
        case 'exchange':
          if (dbTree === false) {
            console.log('calling set bookmarks');
            db.setBookmarks(normalizedChromeTree);
          }
          else {
            console.log('dbTree', dbTree);
            console.log('normalizedChromeTree', normalizedChromeTree);
          }
          break;

        case 'push':
          console.log('pushing to db');
          db.setBookmarks(normalizedChromeTree)
            .then(cloudBookmarks => {
              remoteBookmarks = cloudBookmarks;
            });
          break;
      }
    });
}

function setClientProfile(...args) {
  return errorHandleWrapper(setChromeProfile, ...args);
}

function getClientProfile() {
  return chromeProfile;
}

function getProfiles(...args) {
  return errorHandleWrapper(db.getProfiles, ...args);
}

function getRemoteBookmarks() {
  return remoteBookmarks;
}

function syncBookmarks(...args) {
  return errorHandleWrapper(sync, ...args);
}

getChromeProfile()
  .then(currentProfile => {
    chromeProfile = currentProfile;
  });

db.getBookmarks()
  .then(bookmarksFromDb => {
    remoteBookmarks = bookmarksFromDb;
  })

window.shared = {
  getProfiles,
  getClientProfile,
  setClientProfile,
  getRemoteBookmarks,
  syncBookmarks
};
