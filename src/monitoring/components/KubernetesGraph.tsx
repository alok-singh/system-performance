import React, { Component } from 'react'

import { Grid, Col, Row, AreaChart, SingleAreaChart } from 'patternfly-react'


interface GraphState {
    columns: (string | number)[][] 
    type: string
}


export class KuberneteGraph extends Component<{}, GraphState> {
    areaChartDataColumns: (string | number)[][]
    areaChartData: { columns: (string | number)[][], type: string}
    singleAreaChartDataColumns: (string | number)[][]
    singleAreaChartData: { columns: (string | number)[][], type: string}
    eventSource: EventSource


    constructor(props: {}) {
        super(props)
        this.areaChartDataColumns = [
            ['data1', 350, 400, 350, 0],
            ['data2', 140, 100, 150, 205, 145, 50],
            ['data3', 10, 60, 90, 10, 325, 400],
            ['data4', 260, 10, 305, 100, 50, 150]
        ]
        this.areaChartData = {
            columns: this.areaChartDataColumns,
            type: 'area-spline'
        }
        this.singleAreaChartDataColumns = [['data2', 140, 100, 150, 205, 145, 50]]
        this.singleAreaChartData = {
            columns: this.singleAreaChartDataColumns,
            type: 'area-spline'
        }

        this.state = {
            columns : this.singleAreaChartDataColumns,
            type: 'area-spline'
        }

        this.eventSource = new EventSource("http://127.0.0.1:5000/events")
    }

    componentDidMount() {
        console.log("Component mounted")
        // this.eventSource.onmessage = event => {
        //     console.log("data: " + event.data)
        // }
        this.eventSource.addEventListener('cpu-utilization', (evt: any) => {
            this.setState({ columns: JSON.parse(evt.data).data, type: 'area-spline'})
            console.log("received: "+ this.state.columns+ " "+evt.data)
        })
    }

    componentWillUnmount() {
        this.eventSource.close()
    }

    render() {
        return (
            <Grid fluid={true} >
                <Row>
                    <Col xs={10} md={4}>
                        <AreaChart data={this.areaChartData} size={{ width: 400, height: 300}} />
                    </Col>
                    <Col xs={10} md={4}>
                    <SingleAreaChart id="area-chart-2" size={{ width: 400, height: 300 }} data={this.state} />
                    </Col>
                </Row>
            </Grid>
        );
    }
}