# UNO Card Game

## Highlights

* Established a real-time multi-player card game application where up to 10 users can play UNO games interactively.
* Implemented the backend with Node.js and Express.js, designed the frontend with Vue.js, and generated 8 reusable Vue Components to simplify the UI rendering process; connected multiple users with Socket.io.






<!-- # Assignment 3: multiplayer card game

Remember: your app will not run if you do not have two terminals open, one for running the API server (`server/`) and one for the Vue UI (`ui/`).

1. Pull the latest examples repo and copy all the files in the `lecture11-card-game/` directory into your assignment directory. DO NOT COPY OVER THE `.git` DIRECTORY.
2. Create a `ui/src/components/AnimatedCard.vue` component to replace the `<pre>`-based rendering of individual cards. The component needs to use at least one prop and emit at least one event. The component needs to visually differentiate between the last played card vs. player cards, as well as show when a card is not legal to play *without* the user needing to click on it to try playing it. HINT: `import` a helper function from the `server/` directory to do this. 
3. Add an array parameter to the `game-state` event emitted by `server.ts` that includes a list of the players who have only 2 cards left in their hand or fewer.
4. Update `Game.vue` to use the information from step 3 to show which players have only 2 or fewer cards left in their hands. You are free to present this in any way you want.
5. Change the game logic on the server side to make kings "wild". In other words, you can always play a king regardless of the last card played. In addition to providing flexibility to the player playing the king, it also gives flexibility to the player that plays after the king, because any card of theirs will also match the king. 
6. Add 2 new socket.io event handlers to `server.ts` called `get-config` and `update-config` and add a new `interface Config` to `model.ts`. The purpose of this is so that the number of decks of cards and rank limit can be dynamically configured while the server is running. `update-config` should take a single `Config` parameter. In response to the two events, the server should send out two events, `get-config-reply` and `update-config-reply`, respectively. For `update-config-reply`, it should return a single `boolean` parameter that should be `false` if, by using `typeof`-based checks, the supplied `config` does not conform to the needed type or has extra fields. Finally, `update-config-reply` needs to be sent out after waiting 2 seconds after receiving `update-config`. Configuration changes only need to impact new games, not a game already in progress. There is also no need to load/save this configuration on disk. 
7. Add an additional Vue route, `/config`, that shows a page with a form for configuring the number of decks of cards and the rank limit. Create a form similar to that seen in Lecture 9's example, including the labels set up in a way to support accessibility. You'll need to add a `<b-overlay>` component around the form that depends on a reactive variable called `busy` that you set to `true` when the UI is waiting on a `-reply` event to come in via socket.io. (See https://bootstrap-vue.org/docs/components/overlay, though remember that the example code in the `<script>` section is not using `<script setup>` composition API style; define reactive variables using `ref()` as we have discussed in class.) Finally, use the `number` attribute on the `<b-form-input>` to automatically parse the string input into a `number`. Finally, load the configuration from the server when the page loads using `onMounted(() => { /* call to emit get-config goes here */ })`.
8. Record a video demo to share with the instructor/TAs/grader on Panopto. The video needs to include 2 complete games played end to end (have two web browsers positioned side by side), demonstrating the visual features from steps 2, 4, 5, and 7. In between the two games, use the configuration form to change the parameters to something obviously different, so that we can easily see that the configuration setting feature works. -->
