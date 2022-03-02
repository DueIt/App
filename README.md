# App

## Install

To run the app you will need node. It's using react native with the create-react-native-app boiler plate.

For install be sure to run:
```shell
npm install
```
&nbsp;
## Running

For running on iOS (in simulator) just run:
```shell
npm run ios
```

For running on the phone make sure you have pod installed (running it in simulator first works too) with:
```shell
cd ios && pod install && cd ..
```

To run on device connect it, sign the app in Xcode, and then run it.
&nbsp;
## Linting

For committing code please lint your code with:
```shell
npm run lint
```

You can also fix most of the issues automatically with:
```shell
npm run lint-fix
```

If you want to auto lint on save you can use VScode with the ESlint plugin