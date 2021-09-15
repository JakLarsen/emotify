#Emotify

Emotify utilizes Neural-Navigation, allowing users to navigate a Spotify-inspired audio app using their BRAINWAVES.
 - Using an Emotiv Insight (https://www.emotiv.com/insight/) for realtime, user-specific EEG data, Emotify displays a working proof of concept that aims at giving a wider user population autonomy over their music experience.
 - You can play and pause, go next or previous, or even cycle between playlists, all with the use of your brain.
    - The idea is to give full control of the main audio functionality over to EEG-trained brainwave commands in place of the usual physical inputs in order to provide accessibility to those who might benefit from an alternative methodoloy. It could also have implications on things like hands-free music control in the future.

- A standard userflow would include signing up/logging in and then creating a playlist to play from or playing from pre-existing ones. Once logged in, hit "connect headset" to connect the Emotiv Insight headset that you've trained "neutral," "push," and "pull" commands with using the Emotiv App. When you use a "push" command, your currently selected playlist will begin to play. This will be updated so that your initial playlist is your "favorited" playlist to start.
- Audio Controls (longer input times due to EEG sensitivity - i.e. with a better headset connect, this could be shortened; with more sensors and specificity, the number of discrete commands could be increased as well): 
- if paused:
    - "push" 2s : Play
    - "pull" 2s : Previous Song
    - "pull" 4s : Previous Playlist
- if playing:
    - "pull" 2s : Pause
    - "push" 2s : Next Song
    - "push" 4s : Next Playlist

- Cortex Library (MIT) is utilized in conjunction with Emotiv's Cortex API for connecting to the headset via websocket with Python
  - https://github.com/Emotiv/cortex-v2-example/tree/master/python 
  - https://emotiv.gitbook.io/cortex-api/
- Main site is built out with JavaScript/jQuery, utilizing Flask on the back end with PSQL to manage the database.

📫 If you're curious about Emotify, drop me an email at jacoblarsendk@gmail.com or toss me a message on linkedIn: https://www.linkedin.com/in/jacobwlarsen/
