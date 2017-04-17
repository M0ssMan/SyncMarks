/* global chrome document $ */

import { isNil, forOwn } from 'lodash';

const {
  // syncProfile,
  // pushToDb,
  // pullFromDb,
  profileToSync
} = chrome.extension.getBackgroundPage();

$(document).ready(() => {
  const hasLinkedProfile = !isNil(profileToSync);
  console.log('document has loaded');
  let clickHandlers;
  if (hasLinkedProfile) {
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
  if (!hasLinkedProfile) {
    clickHandlers = {
      getStarted: () => console.log('get Started was pressed')
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
