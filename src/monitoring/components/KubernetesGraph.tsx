import React, { Component, useState, useEffect } from 'react'

import { Grid, Col, Row, AreaChart, SingleAreaChart } from 'patternfly-react'


interface GraphState {
    columns: (string | number)[][] 
    type: string
}


export function KuberneteGraph(props: {}) {
    const singleAreaChartDataColumns: (string | number)[][] = [['data2', 140, 100, 150, 205, 145, 50]]
    const eventSource: EventSource = new EventSource("http://127.0.0.1:5000/events")

    const [chartData, setChartData] = useState([['data2', 140, 100, 150, 205, 145, 50]])

    useEffect(() => {
        eventSource.addEventListener('cpu-utilization', (evt: any) => {
            console.log("reached")
            setChartData(JSON.parse(evt.data).data)
        })
        return () => {
            eventSource.close();
        }
    })

    return (
        <Grid fluid={true} >
            <Row>
                <Col xs={10} md={4}>
                <SingleAreaChart id="area-chart-2" size={{ width: 400, height: 300 }} data={{columns: chartData, type: 'area-spline'}} />
                </Col>
            </Row>
        </Grid>
    );
}