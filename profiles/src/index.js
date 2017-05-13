/* global chrome document $ vex */
/* @flow */

import { isNil, capitalize, map } from 'lodash';
import type { profiles_Type } from 'flowtypes';
import setProfileClickHandlers from './setProfileClickHandlers';
import setSyncOptionClickhandlers from './setSyncOptionClickHandlers';

const {
  getProfiles,
  getClientProfile,
  setClientProfile,
  pushToDb,
  syncBookmarks
} = chrome.extension.getBackgroundPage().shared;
let clientProfile;
let vexSyncModal;

function closeSyncModal() {
  vexSyncModal.close();
}

function setSyncModal(modal) {
  vexSyncModal = modal;
}

async function initProfileScene() {
  vex.defaultOptions.className = 'vex-theme-modified-os';
  clientProfile = await getClientProfile();

  setProfileClickHandlers(clientProfile);
  setSyncOptionClickhandlers();
  const profiles: object<profiles_Type> = await getProfiles();
  const profileOptions = map(profiles, (profileValue, profileKey) => {
    const optionId = `${profileKey}-image`;
    return /* @html */`
      <div class="profile-option">
        <div class=${optionId}>
        </div>
        <div class="text-box">
          <p>${profileValue.text}</p>
        </div>
      </div>
    `;
  });
  $("#profiles-container").append(profileOptions);
  $(`.text-box > p:contains(${capitalize(clientProfile)})`)
    .closest('.profile-option')
    .attr('class', 'profile-option selected');
}

$(document).ready(() => {
  initProfileScene();
});

export { closeSyncModal, setSyncModal };
