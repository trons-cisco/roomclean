//This Macro was developed by Tyler Ronsman, Customer Success Engineer at Cisco, tronsman@cisco.com
//Version 1.2
//More details at https://github.com/trons-cisco/roomclean

import xapi from 'xapi';

//This is where you set the image you would like to display post meeting as well as the duration of said image to be seen
const CLEAN_IMAGE_URL = 'https://github.com/trons-cisco/roomclean/blob/main/roomclean3.png?raw=true';  //This example image is hosted on this github repo
const DISPLAY_DURATION = 120000; // 2 minutes in milliseconds
const WEBEX_DELAY_MS = 3000;     // 3-second delay before showing modal for Webex, VIMT/CVI and Zoom CRC/SIP
const MTR_DELAY_MS = 6000;     // 6-second delay before showing modal for Teams meetings in MTR mode

//State trackers to ensure we only trigger the modal when an active call actually ends
let isMtrInCall = false;
let isNativeInCall = false;

//Displays the cleaning reminder and sets a timer to hide it
function showCleanupReminder() {
  console.log('Meeting ended. Displaying cleanup reminder for 2 minutes.');
  
  // Show the image
  // More info https://roomos.cisco.com/xapi/Command.UserInterface.WebView.Display
  xapi.command('UserInterface.WebView.Display', {
    Url: CLEAN_IMAGE_URL,
    Target: 'OSD', // options: OSD, Controller, PWA, RoomScheduler
    Title: 'Room Cleanup Reminder',
    Mode: 'Modal' // options: Fullscreen or Modal
  });

  // Auto-clear after 2 minutes
  setTimeout(() => {
    console.log('Closing cleanup reminder.');
    xapi.command('UserInterface.WebView.Clear');
  }, DISPLAY_DURATION);
}

// 1. Subscription for Microsoft Teams Rooms (MTR) mode
xapi.Status.MicrosoftTeams.Calling.InCall.on(value => {
    console.log(`MTR InCall Status: ${value}`);
    
    if (value === 'True') {
        isMtrInCall = true;
    } else if (value === 'False' && isMtrInCall) {
        // Call transitioned from True to False (Meeting Ended)
        isMtrInCall = false;
        console.log('MTR Meeting ended. Showing modal immediately.');
        //Removed OG code to accomodate for potential active share // showCleanupReminder(); // Triggers instantly for MTR
      
      // Triggers after a 6-second delay for MTR Teams Join
        setTimeout(() => {
            showCleanupReminder();
        }, MTR_DELAY_MS);
    }
});

// 2. Subscription for Webex / Native Calls
xapi.Status.Call.Status.on((value) => {
    console.log(`Webex/Native Call Status: ${value}`);
    
    if (value === 'Connected') {
        isNativeInCall = true;
    } else if (value === 'Disconnecting' && isNativeInCall) {
        // Call transitioned from Connected to Disconnecting (Meeting Ended)
        isNativeInCall = false;
        console.log(`Webex Meeting ended. Waiting ${WEBEX_DELAY_MS / 1000} seconds before showing modal.`);
        
        // Triggers after a 3-second delay for Webex, VIMT/CVI and Zoom CRC/SIP
        setTimeout(() => {
            showCleanupReminder();
        }, WEBEX_DELAY_MS);
    }
});
