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
                workspaceKey="publicDemoKey"
                event="smallTheatreEvent"
            />
        </View>
    )

}
