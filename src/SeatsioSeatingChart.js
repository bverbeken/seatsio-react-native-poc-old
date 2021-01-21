import {WebView} from "react-native-webview";
import React from "react";

export default class SeatsioSeatingChart extends React.Component {

    render() {
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

        console.log(html)

        return (
            <WebView
                originWhitelist={['*']}
                source={{html: html}}
                onMessage={(event) => {
                    console.log(event.nativeEvent.data)
                }}
            />
        );
    }


}

SeatsioSeatingChart.defaultProps = {
    divId: 'chart',
    chartJsUrl: 'https://cdn.seatsio.net/chart.js'
};
