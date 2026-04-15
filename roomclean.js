//This Macro was developed by Tyler Ronsman, Customer Success Engineer at Cisco, tronsman@cisco.com

import xapi from 'xapi';

//this is where you set the image you would like to display post meeting as well as the duration of said image to be seen
const CLEAN_IMAGE_URL = 'https://github.com/trons-cisco/roomclean/blob/main/roomclean2.png?raw=true';
const DISPLAY_DURATION = 120000; // 2 minutes in milliseconds
const WEBEX_DELAY_MS = 3000;     // 3-second delay before showing modal for Webex

// State trackers to ensure we only trigger the modal when an active call actually ends
let isMtrInCall = false;
let isNativeInCall = false;

//Displays the cleaning reminder and sets a timer to hide it
function showCleanupReminder() {
  console.log('Meeting ended. Displaying cleanup reminder for 2 minutes.');
  
  // Show the image
  //more info https://roomos.cisco.com/xapi/Command.UserInterface.WebView.Display
  xapi.command('UserInterface.WebView.Display', {
    Url: CLEAN_IMAGE_URL,
    Target: 'OSD', //OSD, Controller, PWA, RoomScheduler
    Title: 'Room Cleanup Reminder',
    Mode: 'Modal' //Fullscreen or Modal
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
        showCleanupReminder(); // Triggers instantly for MTR
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
        
        // Triggers after a 3-second delay for Webex
        setTimeout(() => {
            showCleanupReminder();
        }, WEBEX_DELAY_MS);
    }
});
