This macro (roomclean.js) was developed as a Proof of Concept (PoC) for a customer inquiring about showing a visual image with cleaning instructions post meeting.  

The macro is built to monitor for meeting "disconnect" events, once triggered it will run the "webview display" command to present a hosted image (roomclean2.jpg) for 2 minutes, at the end of the 2 minute timer, it will run "webview clear".

In the Cisco RoomOS experience:
- The macro triggers upon disconnecting from a Webex meeting, Webex video call, VIMT/CVI, Zoom CRC/SIP and SIP call

In the Microsoft Teams Rooms experience on Cisco Devices
- the macro triggers upon disconnecting from a Teams Meeting, Webex meeting, Webex video call, Zoom CRC/SIP and SIP call

Note: webview.display does not work if there is an active content share when disconnecting from a meeting as the content share will take precedence.  You would see this more on Desk devices, but could potentially be fixed if you add a delay to the webview.display command trigger.
