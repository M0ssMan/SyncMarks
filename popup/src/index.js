/* global chrome document $ window */

import { forOwn } from 'lodash';
import { notNil } from 'utils';

const {
  getClientProfile,
  syncBookmarks
} = chrome.extension.getBackgroundPage().shared;

async function initPopup() {
  const currentProfile = getClientProfile();
  const hascurrentProfile = notNil(currentProfile);
  let clickHandlers;
  if (hascurrentProfile) {
    clickHandlers = {
      bookmarks: () => {
        chrome.tabs.create({ url: "../bookmarks/index.html" });
      },
      profile: () => {
        chrome.tabs.create({ url: "../profiles/index.html" });
      },
      sync: () => console.log('sync was clicked'),
      push: () => {
        console.log('push was clicked');
      },
      pull: () => console.log('pull was clicked')
    };

    $(".popup-container").append(/* @html */`
      <ul>
        <li id="bookmarks">Bookmarks</li>
        <li id="profile">Profile</li>
        <li id="sync">Sync</li>
        <li id="push">Push Local to Cloud</li>
        <li id="pull">Pull Cloud to Local</li>
      </ul>
    `);
  }
  if (!hascurrentProfile) {
    clickHandlers = {
      getStarted: () => {
        chrome.tabs.create({ url: "../profiles/index.html" });
      }
    };

    $(".popup-container").append(/* @html */`
        <ul>
          <li id="getStarted">Get Started</li>
        </ul>
    `);
  }

  forOwn(clickHandlers, (value, key) => {
    $(`#${key}`).bind("click", value);
  });
}

$(document).ready(() => {
  initPopup();
});
