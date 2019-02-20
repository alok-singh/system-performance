import React, { Component, ReactNode } from 'react'
import VSMCard, { VSMCardProps, ArrowDirection } from './VSMCard'
import GridBlock, { GridBlockBehavior } from './GridBlock';
import { Position, observe } from '../../../behavior/vsm/MoveManager';
import { ArcherContainer } from 'react-archer'

export type CardData = { data: VSMCardProps[] }

const gridColumns = 6
const gridRows = 3
const minHeight = '120px'
var arrowStart: Position | null = null
var arrowEnd: Position | null = null

export class Grid extends Component<{}, CardData> {

    constructor(props:{}) {
        super(props)
        const data:VSMCardProps[] = [
          {
            id: "1",
            position: {x:0, y:0},
            environment: "QA", deployedMaterial: "CommitHash1", downstream: ["2"]
          },
          {
            id: "2",
            position: {x:1, y:0},
            environment: "Prod", deployedMaterial: "CommitHash2"
          },
          {
            id: "3",
            position: {x:2, y:0},
            environment: "Pre-Prod", deployedMaterial: "CommitHash2", downstream: ["2"]
          }
        ]
    
        this.state = { data: this.updateDependencyData(data) }
    }

    unobserve?: (() => void)

    componentDidMount() {
        this.unobserve = observe(this.handleChange)
    }

    componentWillUnmount() {
        if (this.unobserve) {
            this.unobserve()
        }
    }

    onMouseDown = (x: number, y: number) => {
        arrowStart = {x:x, y:y}
    }

    onMouseUp = (x: number, y: number) => {
        arrowEnd = {x:x, y:y}
        if( !!arrowStart && !!arrowEnd) {
            this.createArrow(arrowStart, arrowEnd)
        }
        this.clearArrowState()
    }
    
    clearArrowState = () => {
        arrowStart = null
        arrowEnd = null
    }

    createArrow = (initial: Position, final: Position) => {
        //get the card present in the final position
        const dependencies = this.state.data.filter(card => {
        if (card.position.x == final.x && card.position.y == final.y) {
            return true
        }
        return false
        }).map(card => card.id)

        const newState = this.state.data.map(card => {
        if(card.position.x === initial.x && card.position.y === initial.y) {
            if(!!card.downstream) {
                const downstream = card.downstream
                const uniqueDependencies = dependencies.filter(id => !downstream.includes(id))
                card.downstream.push(...uniqueDependencies)
            } else {
                card.downstream = dependencies
            }
        }
        return card
        })
        this.addDependencyDataAndUpdateState(newState)
    }

    handleChange = (id: string, cardPosition: Position): void => {
        const newState: VSMCardProps[] = this.state.data.map(card => this.updateStateForId(id, cardPosition, card))
        this.addDependencyDataAndUpdateState(newState)
    }

    updateStateForId(id:string, cardPosition: Position, card: VSMCardProps): VSMCardProps {
        if(id == card.id) {
            card.position = cardPosition
        }
        return card
    }

    addDependencyDataAndUpdateState = (data: VSMCardProps[]): void => {
        const finalState = this.updateDependencyData(data)
        if (this.state) {
                this.setState({data: finalState})
        } else {
            this.state = {data: finalState}
        }
    }

    updateDependencyData = (props: VSMCardProps[]): VSMCardProps[] => {
        const positions = props.reduce((map: Map<string, Position>, c: VSMCardProps) => {
                            map.set(c.id, c.position)
                            return map
                            }, 
                            new Map<string, Position>())
        return props.map(card => this.updateArrowDirection(card, positions))
    }

    updateArrowDirection = (card: VSMCardProps, map: Map<String, Position>): VSMCardProps => {
        if(!!card.downstream) {
            const dependency = card.downstream.filter(id => map.has(id)).map(id => this.generateDirection(id, card.position, map.get(id)!))
            card.downstreamInfo = dependency
        }
        return card
    }

    generateDirection = (id: string, from: Position, to: Position): ArrowDirection => {
        if ( from.x < to.x ) {
            return {
                targetId: id,
                targetAnchor: 'left',
                sourceAnchor: 'right'
            }
        } else if(from.x > to.x) {
            return { 
                targetId: id,
                targetAnchor: 'right',
                sourceAnchor: 'left'
            }
        }
        if(from.y < to.y) {
            return {
                targetId: id,
                targetAnchor: 'top',
                sourceAnchor: 'bottom'
            }
        }
        return {
            targetId: id,
            targetAnchor: 'bottom',
            sourceAnchor: 'top'
        }
    }

    renderSquare = (i: number): ReactNode => { 
        const x = i % gridColumns
        const y = Math.floor(i / gridColumns);
        const width:string = 100 / gridColumns + '%'
        return (
            <div key={i} style={{
                width: width,
                minHeight: minHeight
            }}>
                <GridBlock x={x} y={y} canMoveCard={ this.canMoveCard } onMouseUp={this.onMouseUp} onMouseDown={this.onMouseDown} >
                    { this.renderPiece(x, y) }
                </GridBlock>
            </div>
        );
    }

    canMoveCard = (x: number, y:number): boolean => {
        const currentBlock: ((c: VSMCardProps) => boolean)  = this.matchBlock(x, y)
        const cardProp: VSMCardProps[] = this.state.data.filter(currentBlock)
        if (cardProp.length > 0) {
            return false
        }
        return true
    }

    matchBlock = (x:number, y:number) => ((c: VSMCardProps) => c.position.x === x && c.position.y === y)
    
    renderPiece = (x: number, y: number): ReactNode | null => {
        const currentBlock: ((c: VSMCardProps) => boolean)  = this.matchBlock(x, y)
        const cardProp: VSMCardProps[] = this.state.data.filter(currentBlock)
        if (cardProp && cardProp.length == 1) {
            return <VSMCard {...cardProp[0]} />
        }
        return null
    }

    render() {
        const squares: ReactNode[]  = [];
        const grids = gridColumns * gridRows
        for (let i = 0; i < grids; i++) {
            squares.push(this.renderSquare(i));
        }
        return (
            <ArcherContainer strokeColor='black' strokeWidth='2'>
                <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexWrap: 'wrap'
                }}>
                { squares }
                </div>
            </ArcherContainer>
        );
    }
}