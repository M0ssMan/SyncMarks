/* global chrome window */
import {
  errorHandleWrapper,
  mapToStdOutput
} from 'utils';
import fb from './db';

console.log('im in the background page!');

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

function bkSyncBookmarks(syncedProfile) {
  console.log('syncedProfile', syncedProfile);
  const promises = [];
  promises.push(getChromeBookmarks());
  promises.push(fb.getBookmarks());
  return Promise.all(promises)
    .then(result => {
      const chromeTree = result[0];
      console.log('chromeTree', chromeTree);
      const normalizedChromeTree = mapToStdOutput(chromeTree, syncedProfile);
      const dbTree = result[1];
      if (dbTree === false) {
        console.log('calling set bookmarks');
        fb.setBookmarks(normalizedChromeTree);
      }
      else {
        console.log('dbTree', dbTree);
        console.log('normalizedChromeTree', normalizedChromeTree);
      }
    });
}

function setClientProfile(...args) {
  return errorHandleWrapper(setChromeProfile, ...args);
}

function getClientProfile(...args) {
  return errorHandleWrapper(getChromeProfile, ...args);
}

function getProfiles(...args) {
  return errorHandleWrapper(fb.getProfiles, ...args);
}

function syncBookmarks(...args) {
  return errorHandleWrapper(bkSyncBookmarks, ...args);
}

window.shared = {
  getProfiles,
  getClientProfile,
  setClientProfile,
  syncBookmarks
};
