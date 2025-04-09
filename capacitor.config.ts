import { CapacitorConfig } from '@capacitor/cli';

// @ts-ignore
const config: CapacitorConfig = {
  appId: 'io.PHMSoft.SF',
  appName: 'SpaceFlix',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    "SplashScreen": {
      "launchShowDuration": 3000,
      "launchAutoHide": true,
      "launchFadeOutDuration": 3000,
      "backgroundColor": "#37253e",
      "androidSplashResourceName": "splash",
      "androidScaleType": "CENTER_CROP",
      "showSpinner": true,
      "androidSpinnerStyle": "large",
      "iosSpinnerStyle": "small",
      "spinnerColor": "#999999",
      "splashFullScreen": true,
      "splashImmersive": true,
      "layoutName": "launch_screen",
      "useDialog": true
    },
    "LocalNotifications": {
      "smallIcon": "logonoti.png",
      "iconColor": "#488AFF",
      "sound": "beep.wav"
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  },
  android: {
    buildOptions: {
      keystorePath: 'c:\Users\hugor\OneDrive\Escritorio\SpaceflixWeb\SpaceflixWeb\KEY\Key.jks',
      keystoreAlias: 'key0',
    }
  }
};

export default config;
