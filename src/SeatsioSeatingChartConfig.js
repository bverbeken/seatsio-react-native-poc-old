export default class SeatsioSeatingChartConfig {
    constructor(props) {
        this.props = props
    }

    asString() {
        let config = {
            divId: this.props.divId,
            workspaceKey: this.props.workspaceKey,
            event: this.props.event,
            events: this.props.events,
            pricing: this.props.pricing,
            numberOfPlacesToSelect: this.props.numberOfPlacesToSelect
        }
        return this.addCallbacks(config);
    }

    addCallbacks(config) {
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
        if (this.props.priceFormatter) {
            configString += `
                , "priceFormatter": (price) => {
                    return priceFormatter(price)
                }
            `
        }
        return configString + '}'
    }

    getJavascriptToInject() {
        let result = "";
        if (this.props.priceFormatter) {
            result += this.props.priceFormatter.toString();
        }
        return result;
    }
}
