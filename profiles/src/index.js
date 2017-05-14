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

let clientProfile;
let vexSyncModal;

function getCurrentProfile() {
  return getClientProfile()
    .then(currentProfile => {
      clientProfile = currentProfile;
    });
}

function getCurrentSelectedProfile() {
  return clientProfile;
}

function setCurrentProfile(profileOptionToUpdate) {
  return setClientProfile(profileOptionToUpdate)
    .then(currentProfile => {
      clientProfile = currentProfile;
    });
}

function closeSyncModal() {
  vexSyncModal.close();
}

function setSyncModal(modal) {
  vexSyncModal = modal;
}

function highlightSelectedProfile(selectedProfile) {
  if (notNil(selectedProfile)) {
    $('.selected').removeClass('selected');
    $(`.text-box > p:contains(${capitalize(selectedProfile)})`)
    .closest('.profile-option')
    .attr('class', 'profile-option selected');
  }
}

async function initProfileScene() {
  vex.defaultOptions.className = 'vex-theme-modified-os';
  await getCurrentProfile();

  setProfileClickHandlers();
  setSyncOptionClickhandlers();
  const profiles: Object<profiles_Type> = await getProfiles();
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
  highlightSelectedProfile(clientProfile);
}

$(document).ready(() => {
  initProfileScene();
});

export {
  closeSyncModal,
  setSyncModal,
  setCurrentProfile,
  getCurrentSelectedProfile,
  highlightSelectedProfile
};
