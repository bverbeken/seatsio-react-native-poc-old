/*global seatsio*/

import React from 'react';
import {WebView} from "react-native-webview";

export default class Embeddable extends React.Component {

    render() {
        console.log(this.props.chartJsUrl)
        const html = `
        <html>
        <head>
            <script src=${this.props.chartJsUrl}></script>
        </head>
        <body>
            <div id="${this.props.divId}"></div>
            <script>
                new seatsio.SeatingChart({
                    divId: "${this.props.divId}",
                    workspaceKey: "${this.props.workspaceKey}",
                    event: "${this.props.event}"
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
            />
        );
    }
}

Embeddable.defaultProps = {
    divId: 'chart',
    chartJsUrl: 'https://cdn.seatsio.net/chart.js'
};
