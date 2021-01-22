export default class SeatsioSeatingChartConfig {
    constructor(props) {
        this.props = props
    }

    asString() {
        let config = {
            divId: this.props.divId,
            workspaceKey: this.props.workspaceKey,
        }
        if (this.props.event) {
            config.event = this.props.event
        } else if (this.props.events) {
            config.events = this.props.events
        }
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

}
