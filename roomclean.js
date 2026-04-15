//This Macro was developed by Tyler Ronsman, Customer Success Engineer at Cisco, tronsman@cisco.com

import xapi from 'xapi';

//this is where you set the image you would like to display post meeting as well as the duration of said image to be seen
const CLEAN_IMAGE_URL = 'https://github.com/trons-cisco/roomclean/blob/main/roomclean2.png?raw=true';
const DISPLAY_DURATION = 120000; // 2 minutes in milliseconds

let wasInCall = false;

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

  // Auto-close after 2 minutes
  setTimeout(() => {
    console.log('Closing cleanup reminder.');
    xapi.command('UserInterface.WebView.Clear');
  }, DISPLAY_DURATION);
}

// --- Subscription for Microsoft Teams Rooms (MTR) Mode ---
xapi.status.on('MicrosoftTeams.Calling.InCall', (value) => {
  if (value === 'True') {
    wasInCall = true;
  } else if (value === 'False' && wasInCall) {
    wasInCall = false;
    showCleanupReminder();
  }
});

// --- Subscription for Webex / Native SIP Calls ---
xapi.status.on('Call.Status', (status) => {
  // If a call is connected or ringing, mark as active
  if (status === 'Connected') {
    wasInCall = true;
  } 
  // If it goes back to Idle after being in a call
  else if (status === 'Idle' && wasInCall) {
    wasInCall = false;
    showCleanupReminder();
  }
});
