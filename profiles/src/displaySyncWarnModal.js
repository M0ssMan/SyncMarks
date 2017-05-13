/* global vex */

function displaySyncWarnModal() {
  console.log('sync modal thingy is running');
  vex.dialog.confirm({
    unsafeMessage: 'Another profile is already being synced with this computer.<br/>' +
    'Switching profiles will cause all bookmarks' +
    'associated with the previously synced profile to be removed.<br />' +
    'Are you sure you want to proceed?',
    callback: (userChoice) => {
      // @TODO
    }
  });
}


export default displaySyncWarnModal;
