import React, { Component } from 'react'
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Grid } from './Grid';

export class GridWithDrag extends Component {
    render() {
        return (
        <DragDropContextProvider backend={HTML5Backend}>
          <Grid />
        </DragDropContextProvider>
        );
    }
}