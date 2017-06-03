/* global chrome document $ vex */
/* @flow */

import { capitalize, map } from 'lodash';
import { notNil } from 'utils';
import type { profiles_Type } from 'flowtypes';
import setProfileClickHandlers from './setProfileClickHandlers';
import setSyncOptionClickhandlers from './setSyncOptionClickHandlers';

const {
  getProfiles,
  getClientProfile,
  setClientProfile
} = chrome.extension.getBackgroundPage().shared;

let vexSyncModal;

function highlightSelectedProfile() {
  const selectedProfile = getClientProfile();
  if (notNil(selectedProfile)) {
    $('.selected').removeClass('selected');
    $(`.text-box > p:contains(${capitalize(selectedProfile)})`)
    .closest('.profile-option')
    .attr('class', 'profile-option selected');
  }
}

function setCurrentProfile(profileOptionToUpdate) {
  return setClientProfile(profileOptionToUpdate)
    .then(() => highlightSelectedProfile());
}

function closeSyncModal() {
  vexSyncModal.close();
}

function setSyncModal(modal) {
  vexSyncModal = modal;
}

async function initProfileScene() {
  vex.defaultOptions.className = 'vex-theme-modified-os';
  await getClientProfile();

  setProfileClickHandlers();
  setSyncOptionClickhandlers();
  const profiles: Object<profiles_Type> = await getProfiles();
  const profileOptions = map(profiles, (profileValue, profileKey) => {
    const optionId = `${profileKey}-image`;
    const $profileOption = /* @html */`
      <div class="profile-option">
        <div class=${optionId}>
        </div>
        <div class="text-box">
          <p>${profileValue.text}</p>
        </div>
      </div>
    `;
    return $profileOption;
  });
  $("#profiles-container").append(profileOptions);
  highlightSelectedProfile();
}

$(document).ready(() => {
  initProfileScene();
});

export {
  closeSyncModal,
  setSyncModal,
  getClientProfile,
  setCurrentProfile
};
