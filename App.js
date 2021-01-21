import React from 'react';
import SeatsioSeatingChart from "./src/SeatsioSeatingChart";


export default function App() {
    return (
        <SeatsioSeatingChart
            workspaceKey="publicDemoKey"
            event="smallTheatreEvent"
        />
    )

}
