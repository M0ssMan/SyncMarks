/* global chrome document $ vex */
// @flow

import { isNil, capitalize, map } from 'lodash';
import type { profileTypes } from 'flowtypes';

const { getProfiles, pushToDb } =
chrome.extension.getBackgroundPage().shared;
const syncProfile = 'home';

function displaySyncOptions(syncOptions) {
  const vexModal = vex.dialog.alert();
  const $syncElements = syncOptions.map(option => {
    const isSelected = option === syncProfile ? 'selected' : '';
    const syncOption = `sync-option-${option}`;
    const syncImage = `sync-image-${option}`;
    return /* @html */`
      <div class=${syncOption} id=${isSelected}>
        <div class="bookmark-image"></div>
        <div class=${syncImage}></div>
        <div class="cloud-image"></div>
      </div>
    `;
  });
  const $syncContainer = /* @html */`
    <div class="sync-options-container"></div>
  `;

  $(vexModal.contentEl).prepend(
    $($syncContainer).append($syncElements)
  );
  const $buttons = $('.vex-dialog-buttons').detach();
  console.log('$buttons', $buttons);
  return vexModal;
}

function displaySyncWarn() {
  const vexModal = vex.dialog.confirm({
    unsafeMessage: 'Another profile is already being synced with this computer.<br/>' +
    'Switching profiles will cause all bookmarks' +
    'associated with the previously synced profile to be removed.<br />' +
    'Are you sure you want to proceed?',
    callback: (userChoice) => {
      // @TODO
    }
  });
  return vexModal;
}

$(document).ready(() => {
  vex.defaultOptions.className = 'vex-theme-modified-os';
  const syncOptions = ['push', 'pull', 'exchange'];
  let vexSyncModal;
  let vexWarnModal;

  $(document).on("click", ".profile-option", () => {
    if (isNil(syncProfile)) {
      // vexSyncModal = displaySyncOptions(syncOptions);
    }
    else {
      vexWarnModal = displaySyncWarn();
      // @TODO
    }
  });
  syncOptions.forEach(syncOption => {
    $(document).on('click', `.sync-option-${syncOption}`, () => {
      vexSyncModal.close();
      console.log(`${syncOption} option was chosen`);
      switch (syncOption) {
        case 'push':
          pushToDb();
          break;
        default:
          // @TODO
          break;
      }
    });
  });
  getProfiles()
    .then((profiles: object<profileTypes>) => {
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
      $(`.text-box > p:contains(${capitalize(syncProfile)})`)
        .closest('.profile-option')
        .attr('class', 'profile-option selected');
    })
    .catch(err => console.log('err in profiles', err));
});
