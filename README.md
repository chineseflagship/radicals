# Radicals

## THIS IS NO LONGER THE MAIN REPO --> cfadevrepo/radicals

### Last Working Environment (Jessica Ng, 8/16/19)

Installed and set up dependencies using React Native's [Getting Started guide](https://facebook.github.io/react-native/docs/getting-started.html) for macOS, target iOS.

Originally Downloaded XCode 9.2 directly from https://developer.apple.com/download/more/ instead of App Store because App Store wasn’t updating XCode properly. (latest version that works with my OS and that watchman requires) Ultimately updated to macOS 10.13 and Xcode 9.4.

- macOS: High Sierra (10.13.6) on MacBook Air
- Xcode: v9.4
- node: v10.16.0
- npm: v6.9.0
- npx: v6.9.0
- react-native-cli: 2.0.1
- react-native: 0.57.1

Was able to run using `react-native run-ios` in `Radicals` folder or running from Xcode. (Changes to deck data may require the app to reinstalled in Simulator).

Was able to run on iPhone 5S using React Native's [Running on Device guide](https://facebook.github.io/react-native/docs/running-on-device#running-your-app-on-ios-devices) for iOS on macOS, but did not got through setting it up for production.

Note: Had to change bundle ID in the Xcode project to run for my own personal Apple developer account, as I did not have access to the one we are using for production. Please change back before setting up for production. (See Radicals (in file selector of Xcode) > Targets > Radicals).  

### Getting Started

If you haven't already, install [Xcode](https://developer.apple.com/xcode/), [Node.js](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/en/).

Then clone this repo and install the dependencies:

```bash
git clone git@github.com:nycoliver/Radicals.git
cd Radicals
yarn
```

Run the app:

```bash
yarn run ios
```

or open `ios/Radicals.xcodeproj/` and run from Xcode.
