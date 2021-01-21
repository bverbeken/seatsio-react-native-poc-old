import {WebView} from "react-native-webview";
import React from "react";
import PropTypes from 'prop-types'

export default class SeatsioSeatingChart extends React.Component {

    onMessage(event) {
        let message = JSON.parse(event.nativeEvent.data);
        if (message.type === "log") {
            console.log(message.data)
        } else if (message.type === "onChartRendered") {
            this.props.onChartRendered(message.data)
        }
    }

    propsToChartConfig() {
        let config = {
            divId: this.props.divId,
            workspaceKey: this.props.workspaceKey,
            event: this.props.event
        }
        console.log(JSON.stringify(config))
        let configString = JSON.stringify(config).slice(0, -1)
        if (this.props.onChartRendered) {
            configString += `
                , "onChartRendered": (chart) => {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: "onChartRendered",
                        data: chart
                    }))
                }
            `
        }
        return configString + '}'
    }

    render() {
        const pipeConsoleLog = `
            console = new Object();
            console.log = function(log) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: "log", 
                    data: log
                })));
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
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <script src="${this.props.chartJsUrl}"></script>
        </head>
        <body>
            <div id="${this.props.divId}"></div>
            <script>
                new seatsio.SeatingChart(${this.propsToChartConfig()}).render();
            </script>
        </body> 
        </html>
        `

        return (
            <WebView
                originWhitelist={['*']}
                source={{html: html}}
                injectedJavaScriptBeforeContentLoaded={pipeConsoleLog}
                onMessage={this.onMessage.bind(this)}
            />
        );
    }


}

SeatsioSeatingChart.defaultProps = {
    divId: 'chart',
    chartJsUrl: 'https://cdn.seatsio.net/chart.js'
};

SeatsioSeatingChart.propTypes = {
    workspaceKey: PropTypes.string.isRequired,
    event: PropTypes.string,
    onChartRendered: PropTypes.func
}
