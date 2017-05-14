/* global chrome window */
import fb from './db';
import {
  mapToStdOutput,
  check
} from './utils';

console.log('im in the background page!');

function getProfiles() {
  return check(() => fb.getProfiles());
}

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

function getClientProfile() {
  return getChromeProfile()
    .catch(err => {
      console.error(err);
      throw err;
    });
}

function setClientProfile(profileOptionToUpdate) {
  return setChromeProfile(profileOptionToUpdate)
    .catch(err => {
      console.error(err);
      throw err;
    });
}

const unchecked = {
  syncBookmarks() {
    let localChromeBookmarks;
    let serverBookmarks;
    chrome.bookmarks.getTree(bkTree => {
      console.log('bookmark tree', bkTree);
      localChromeBookmarks = bkTree;
      const stdChromeBookmarks = mapToStdOutput(localChromeBookmarks);
      console.log('stdChromeBookmarks', stdChromeBookmarks);
    });
    fb.getBookmarks()
      .then(bookmarksFromDb => {
        serverBookmarks = bookmarksFromDb;
        console.log('serverBookmarks', serverBookmarks);
      });
  }
};

function syncBookmarks() {
  return check(unchecked.syncBookmarks);
}
window.shared = {
  getProfiles,
  getClientProfile,
  setClientProfile,
  syncBookmarks
};
