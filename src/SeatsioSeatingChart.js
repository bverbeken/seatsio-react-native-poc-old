import {WebView} from "react-native-webview";
import React from "react";
import PropTypes from 'prop-types'
import SeatsioSeatingChartConfig from "./SeatsioSeatingChartConfig";
import {didPropsChange} from "./util";

export default class SeatsioSeatingChart extends React.Component {

    constructor(props) {
        super(props);
    }


    async componentDidUpdate(prevProps) {
        if (didPropsChange(this.props, prevProps)) {
            this.destroyChart();
            this.rerenderChart();
        }

    }

    rerenderChart() {
        this.injectJs(`chart = new seatsio.SeatingChart(${new SeatsioSeatingChartConfig(this.props).asString()}).render();`)
    }

    destroyChart() {
        this.injectJs("chart.destroy();")
    }

    injectJs(js) {
        this.webRef.injectJavaScript(js + '; true;')
    }

    render() {
        return (
            <WebView
                ref={(r) => (this.webRef = r)}
                originWhitelist={['*']}
                source={{html: this.html()}}
                injectedJavaScriptBeforeContentLoaded={this.pipeConsoleLog()}
                injectedJavaScript={new SeatsioSeatingChartConfig(this.props).getJavascriptToInject()}
                onMessage={this.onMessage.bind(this)}
            />
        );
    }

    onMessage(event) {
        let message = JSON.parse(event.nativeEvent.data);
        if (message.type === "log") {
            console.log(message.data)
        } else if (message.type === "onChartRendered") {
            this.props.onChartRendered(message.data)
        }
    }

    html() {
        return `
            <html lang="en">
            <head>
                <title>seating chart</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <script src="${this.props.chartJsUrl}"></script>
            </head>
            <body>
                <div id="${this.props.divId}"></div>
                <script>
                    let chart = new seatsio.SeatingChart(${new SeatsioSeatingChartConfig(this.props).asString()}).render();
                </script>
            </body>
            </html>
        `;
    }

    pipeConsoleLog() {
        return `
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
        `
    }
}

SeatsioSeatingChart.defaultProps = {
    divId: 'chart',
    chartJsUrl: 'https://cdn.seatsio.net/chart.js'
};

SeatsioSeatingChart.propTypes = {
    divId: PropTypes.string,
    event: PropTypes.string,
    events: PropTypes.array,
    workspaceKey: PropTypes.string.isRequired,
    onChartRendered: PropTypes.func,
    pricing: PropTypes.array,
    priceFormatter: PropTypes.func,
    numberOfPlacesToSelect: PropTypes.number,
    objectWithoutPricingSelectable: PropTypes.bool,
    objectWithoutCategorySelectable: PropTypes.bool,
    selectedObjects: PropTypes.array,
    session: PropTypes.string,
    colorScheme: PropTypes.string
}
