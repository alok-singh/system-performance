import React, { Component } from 'react'


export class Block extends Component {

    render() {
        return (
            <div style={{
                // backgroundColor: 'lightgrey',
                width: '100%',
                height: '100%',
                padding: '20px 20px 20px 20px'
              }}>
                {this.props.children}
              </div>
        );
    }
}