import {WebView} from "react-native-webview";
import React from "react";
import PropTypes from 'prop-types'
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
        this.injectJs(`chart = new seatsio.SeatingChart(${this.configAsString()}).render();`)
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
                onMessage={this.handleMessage.bind(this)}
            />
        );
    }

    handleMessage(event) {
        let message = JSON.parse(event.nativeEvent.data);
        if (message.type === "log") {
            console.log(message.data)
        } else if (message.type === "onChartRendered") {
            this.props.onChartRendered(message.data)
        } else if (message.type === "priceFormatterRequested") {
            let formattedPrice = this.props.priceFormatter(message.data.price)
            this.injectJs(`resolvePromise(${message.data.promiseId}, "${formattedPrice}")`);
        } else if (message.type === "tooltipInfoRequested") {
            let tooltipInfo = this.props.tooltipInfo(message.data.object)
            this.injectJs(`resolvePromise(${message.data.promiseId}, "${tooltipInfo}")`);
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
                <script>
                    let promises = [];
                    let promiseCounter = 0;
                    
                    const resolvePromise = (promiseId, data) => {
                        promises[promiseId](data)
                    }
                </script>
                <div id="${this.props.divId}"></div>
                <script>
                    let chart = new seatsio.SeatingChart(${this.configAsString()}).render();
                </script>
            </body>
            </html>
        `;
    }

    configAsString() {
        let {
            onChartRendered,
            priceFormatter,
            tooltipInfo,
            objectColor,
            sectionColor,
            objectLabel,
            objectIcon,
            isObjectVisible,
            canGASelectionBeIncreased,
            ...config
        } = this.props
        let configString = JSON.stringify(config).slice(0, -1)
        if (onChartRendered) {
            configString += `
                , "onChartRendered": (chart) => {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: "onChartRendered",
                        data: chart
                    }))
                }
            `
        }
        if (priceFormatter) {
            configString += `
                , "priceFormatter": (price) => {
                    promiseCounter++;
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: "priceFormatterRequested",
                        data: {
                            promiseId: promiseCounter,
                            price: price
                        }
                    }));
                    return new Promise((resolve) => {
                        promises[promiseCounter] = resolve;
                    });
                }
            `
        }
        if (tooltipInfo) {
            configString += `
                , "tooltipInfo": (object) => {
                    promiseCounter++;
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: "tooltipInfoRequested",
                        data: {
                            promiseId: promiseCounter,
                            object: object
                        }
                    }));
                    return new Promise((resolve) => {
                        promises[promiseCounter] = resolve;
                    });
                }
            `
        }
        if (objectColor) {
            configString += `
                , "objectColor": (obj, defaultColor, extraConfig) => {
                        ${objectColor.toString()}
                        return objectColor(obj, defaultColor, extraConfig);
                }
            `
        }
        if (sectionColor) {
            configString += `
                , "sectionColor": (section, defaultColor, extraConfig) => {
                        ${sectionColor.toString()}
                        return sectionColor(section, defaultColor, extraConfig);
                }
            `
        }
        if (objectLabel) {
            configString += `
                , "objectLabel": (object, defaultLabel, extraConfig) => {
                        ${objectLabel.toString()}
                        return objectLabel(object, defaultLabel, extraConfig);
                }
            `
        }
        if (objectIcon) {
            configString += `
                , "objectIcon": (object, defaultIcon, extraConfig) => {
                        ${objectIcon.toString()}
                        return objectIcon(object, defaultIcon, extraConfig);
                }
            `
        }
        if (isObjectVisible) {
            configString += `
                , "isObjectVisible": (object, extraConfig) => {
                        ${isObjectVisible.toString()}
                        return isObjectVisible(object, extraConfig);
                }
            `
        }
        if (canGASelectionBeIncreased) {
            configString += `
                , "canGASelectionBeIncreased": (gaArea, defaultValue, extraConfig, ticketType) => {
                        ${canGASelectionBeIncreased.toString()}
                        return canGASelectionBeIncreased(gaArea, defaultValue, extraConfig, ticketType);
                }
            `
        }
        configString += '}'
        return configString
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
    colorScheme: PropTypes.string,
    tooltipInfo: PropTypes.func,
    objectTooltip: PropTypes.object,
    language: PropTypes.string,
    messages: PropTypes.object,
    maxSelectedObjects: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.array
    ]),
    selectedObjectsInputName: PropTypes.string,
    unavailableCategories: PropTypes.array,
    availableCategories: PropTypes.array,
    selectableObjects: PropTypes.array,
    filteredCategories: PropTypes.array,
    objectColor: PropTypes.func,
    sectionColor: PropTypes.func,
    objectLabel: PropTypes.func,
    objectIcon: PropTypes.func,
    isObjectVisible: PropTypes.func,
    canGASelectionBeIncreased: PropTypes.func,
    showRowLabels: PropTypes.bool,
    alwaysShowSectionContents: PropTypes.bool,
    session: PropTypes.oneOf(['continue', 'manual', 'start', 'none']),
    holdToken: PropTypes.string,
    holdOnSelectForGAs: PropTypes.bool,
    showLegend: PropTypes.bool,
    legend: PropTypes.object,
    multiSelectEnabled: PropTypes.bool,
    showMinimap: PropTypes.bool,
    showSectionPricingOverlay: PropTypes.bool,
    mode: PropTypes.string

}
