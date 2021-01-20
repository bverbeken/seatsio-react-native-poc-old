import React from 'react';
import {WebView} from 'react-native-webview';


export default function App() {
  return (
      <WebView
          source={{ html: '<div id="chart" style="border: 1px solid red"></div>' }}
      />
  );
}
