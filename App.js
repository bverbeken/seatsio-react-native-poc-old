import React from 'react';
import SeatsioSeatingChart from "./src/SeatsioSeatingChart";
import { StyleSheet, View } from 'react-native';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 100,
        backgroundColor: 'red',
    },
});

export default function App() {
    return (
        <View style={styles.container}>
            <SeatsioSeatingChart
                chartJsUrl="http:/localhost:9001/chart.js"
                workspaceKey="publicDemoKey"
                events={["smallTheatreEvent2"]}
                onChartRendered={ chart => console.log(chart)}
                pricing={[
                        {'category': 1, 'ticketTypes': [
                                {'ticketType': 'adult', 'price': 30},
                                {'ticketType': 'child', 'price': 20}
                            ]},
                        {'category': 2, 'ticketTypes': [
                                {'ticketType': 'adult', 'price': 40},
                                {'ticketType': 'child', 'price': 30},
                                {'ticketType': '65+', 'price': 25}
                            ]},
                        {'category': 3, 'price': 50}
                ]}
                priceFormatter={ price => '$ ' + price}
            />
        </View>
    )

}
