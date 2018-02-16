[![Build Status](https://travis-ci.org/rickiesmooth/coolcast.svg?branch=master)](https://travis-ci.org/rickiesmooth/coolcast)

Repo for personal podcast project using React Native in combination with React Native Web. Using Gitlab for CD (after PR merged it deploys it to firebase) and will be available on https://coolcast.ricksm.it. Deployment to Apple's Testflight is manual after ejecting.

*I'm currently in the process of refactoring the backend so the deployed version will not work at the moment*

## Table of Contents

* [Installing](#installing)
* [Running](#available-scripts)
  * [npm start](#npm-start)
  * [npm run ios](#npm-run-ios)
  * [npm run android](#npm-run-android)
  * [npm run eject](#npm-run-eject)
  * [npm run watch-web](#npm-run-watch-web)

## Installing

cd coolcast
yarn install

cd coolcast/graphcool
yarn install

## Running

You'll need to setup some environment variables first, but then you can run the following commands.

### `npm start`

Runs your app in development mode.

Open it in the [Expo app](https://expo.io) on your phone to view it. It will reload if you save edits to your files, and you will see build errors and logs in the terminal.

Sometimes you may need to reset or clear the React Native packager's cache. To do so, you can pass the `--reset-cache` flag to the start script:

#### `npm run ios`

Like `npm start`, but also attempts to open your app in the iOS Simulator if you're on a Mac and have it installed.

#### `npm run android`

Like `npm start`, but also attempts to open your app on a connected Android device or emulator. Requires an installation of Android build tools (see [React Native docs](https://facebook.github.io/react-native/docs/getting-started.html) for detailed setup). We also recommend installing Genymotion as your Android emulator. Once you've finished setting up the native build environment, there are two options for making the right copy of `adb` available to Create React Native App:

#### `npm run eject`

This will start the process of "ejecting" from Create React Native App's build scripts. You'll be asked a couple of questions about how you'd like to build your project.

#### `npm run watch-web`

This will start webpack and bundles the javascript for web and it will reload if you save edits to your files.
