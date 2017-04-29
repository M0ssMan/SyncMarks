/* global chrome document $ */

import { isNil, forOwn } from 'lodash';

const {
  // syncProfile,
  // pushToDb,
  // pullFromDb,
  syncProfile
} = chrome.extension.getBackgroundPage().shared;

$(document).ready(() => {
  const hasSyncProfile = !isNil(syncProfile);
  let clickHandlers;
  if (hasSyncProfile) {
    clickHandlers = {
      profile: () => console.log('profile was clicked'),
      sync: () => console.log('sync was clicked'),
      push: () => console.log('push was clicked'),
      pull: () => console.log('pull was clicked')
    };

    $(".popup-container").append(/* @html */`
      <ul>
        <li id="profile">Profile</li>
        <li id="sync">Sync</li>
        <li id="push">Push Local to Cloud</li>
        <li id="pull">Pull Cloud to Local</li>
      </ul>
    `);
  }
  if (!hasSyncProfile) {
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
});
