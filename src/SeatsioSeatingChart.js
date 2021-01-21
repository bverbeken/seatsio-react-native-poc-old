import {WebView} from "react-native-webview";
import React from "react";

export default class SeatsioSeatingChart extends React.Component {

    onMessage (event) {
        console.log(event.nativeEvent.data)
    }

    render() {
        const pipeConsoleLog = `
            console = new Object();
            console.log = function(log) {
                window.ReactNativeWebView.postMessage('$Webview: '+log);
            };
            console.debug = console.log;
            console.info = console.log;
            console.warn = console.log;
            console.error = console.log;
        `;


        const html = `
        <html lang="en">
        <head>
            <title>seating chart</title>
            <script src="${this.props.chartJsUrl}"></script>
        </head>
        <body>
            <div id="${this.props.divId}"></div>
            <script>
                new seatsio.SeatingChart({
                    divId: "${this.props.divId}",
                    workspaceKey: "${this.props.workspaceKey}",
                    event: "${this.props.event}",
                    onChartRendered: () => {
                        window.ReactNativeWebView.postMessage("Hello Chart Rendered! This msg can only be a string")
                    }
                }).render();
            </script>
        </body> 
        </html>
        `

        return (
            <WebView
                originWhitelist={['*']}
                source={{html: html}}
                injectedJavaScriptBeforeContentLoaded={pipeConsoleLog}
                onMessage={this.onMessage}
            />
        );
    }


}

SeatsioSeatingChart.defaultProps = {
    divId: 'chart',
    chartJsUrl: 'https://cdn.seatsio.net/chart.js'
};
