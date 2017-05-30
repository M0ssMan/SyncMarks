/* global chrome window */
import {
  errorHandleWrapper,
  mapToStdOutput
} from 'utils';
import fb from './db';

console.log('im in the background page!');
let chromeProfile;

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

function sync(syncedProfile, syncOption) {
  console.log('syncedProfile', syncedProfile);
  const promises = [];
  promises.push(getChromeBookmarks());
  promises.push(fb.getBookmarks());
  return Promise.all(promises)
    .then(result => {
      const chromeTree = result[0];
      const normalizedChromeTree = mapToStdOutput(chromeTree[0].children, syncedProfile);
      const dbTree = result[1];
      switch (syncOption) {
        case 'exchange':
          if (dbTree === false) {
            console.log('calling set bookmarks');
            fb.setBookmarks(normalizedChromeTree);
          }
          else {
            console.log('dbTree', dbTree);
            console.log('normalizedChromeTree', normalizedChromeTree);
          }
          break;

        case 'push':
          fb.setBookmarks(normalizedChromeTree);
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
  return errorHandleWrapper(fb.getProfiles, ...args);
}

function getRemoteBookmarks(...args) {
  return errorHandleWrapper(fb.getBookmarks, ...args);
}

function syncBookmarks(...args) {
  return errorHandleWrapper(sync, ...args);
}

getChromeProfile()
  .then(currentProfile => {
    chromeProfile = currentProfile;
  });

window.shared = {
  getProfiles,
  getClientProfile,
  setClientProfile,
  getRemoteBookmarks,
  syncBookmarks
};
