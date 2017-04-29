/* global chrome document $ vex */

$(document).ready(() => {
  vex.defaultOptions.className = 'vex-theme-modified-os';

  $(document).on("click", "#profile-option", () => {
    vex.dialog.prompt({
      message: "are you absolutely sure you want to destroy the world?",
      placeholder: "saladfingers",
      callback(value) {
        console.log('value', value);
      }
    });
  });
  const { fb } =
  chrome.extension.getBackgroundPage().shared;
  fb.getProfiles()
    .then(() => {
      // dumby data below
      const dbProfileOptions = [
        { type: 'laptop', text: 'Laptop' },
        { type: 'work', text: 'Work' },
        { type: 'home', text: 'Home' },
        { type: 'mobile', text: 'Mobile' },
        { type: 'add', text: 'Add Profile' }
      ];
      const profileOptions = dbProfileOptions.map((option) => {
        const optionId = `${option.type}-image`;
        return /* @html */`
          <div id="profile-option">
            <div id=${optionId}>
            </div>
            <div id="text-box">
              <p>${option.text}</p>
            </div>
          </div>
        `;
      });
      $("#profiles-container").append(profileOptions);
    })
    .catch(err => console.log('err in profiles', err));
});
