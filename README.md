# Room Clean Checklist

## About
This macro (roomclean.js) was developed as a Proof of Concept (PoC) for a customer inquiring about showing a visual image with cleaning instructions post meeting.  

### Example Image
[![Example Zone Visual](/roomclean2.png)](#)

### The Details
The macro is built to monitor for meeting "disconnect" events, once triggered it will run the "webview display" command to present a hosted image (roomclean2.jpg) for 2 minutes, at the end of the 2 minute timer, it will run "webview clear".

In the Cisco RoomOS experience:
- The macro triggers upon disconnecting from a Webex meeting, Webex video call, VIMT/CVI, Zoom CRC/SIP and SIP call

In the Microsoft Teams Rooms experience on Cisco Devices
- the macro triggers upon disconnecting from a Teams Meeting, Webex meeting, Webex video call, Zoom CRC/SIP and SIP call

## Version History
|  **Version** | **Notes** | 
|-----|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1.0 | Issue with Desk device displaying the webview as it was returning to an active content share |
| 1.1 | Add in a delay to accomodate for returning to active content upon meeting disconnect, this version addes delay for WebexNative only, will test on MTR or add checks for "device type" |
