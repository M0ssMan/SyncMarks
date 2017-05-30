/* global $ document chrome */
import { isNil } from 'lodash';
import { setSyncModal, getClientProfile } from './index';
import displaySyncOptionsModal from './displaySyncOptionsModal';
import displaySyncWarnModal from './displaySyncWarnModal';

function profileClickEvent(event) {
  const profileOptionToUpdate = $(event.target)
    .closest('.profile-option')
    .find('p')
    .text()
    .toLowerCase();
  const currentProfile = getClientProfile();
  if (isNil(currentProfile) || profileOptionToUpdate === currentProfile) {
    const vexSyncModal = displaySyncOptionsModal(currentProfile);
    setSyncModal(vexSyncModal);
  }
  else {
    displaySyncWarnModal(profileOptionToUpdate);
  }
}

function setProfileClickHandlers() {
  $(document).on('click', '.profile-option', profileClickEvent);
}

export default setProfileClickHandlers;
