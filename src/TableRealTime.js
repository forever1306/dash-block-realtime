import React, { Component } from 'react';
import { Table } from 'reactstrap';
import ReactDOM from 'react-dom';
import NumberFormat from 'react-number-format';
import axios from 'axios';
import Time from 'react-time-format'
import './bootstrap/css/bootstrap.min.css';
export default class TableRealTime extends Component {
    constructor(params) {
        super(params);
        // let blockData = this.getBlockFromApi();
        this.blocks = new Array();
        this.info = new Object();
        // this.getBlocks();
        this.start(2000);
        this.pool={'XvhExSNNr97U1':'Ant Pool'}
    }
    render() {
        return (
            <Table striped>
                <thead>
                    <tr>
                        <th>Block</th>
                        <th>Block Time</th>
                        <th>Adjust</th>
                        <th>Ago</th>
                        <th>Diffyculty</th>
                        <th>Extra by</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.blocks.map(block =>
                        <tr>
                            <th scope="row">{block.height.toString()}</th>
                            <td><Time value={block.block_time} format="hh:mm:ss"/> s</td>
                            <td>{block.adjust} s</td>
                            <td>{Math.floor(block.time_ago/1000)}s</td>
                            <td><NumberFormat thousandSeparator={true} displayType='text' value={block.diff}/> </td>
                            <td>{block.miner.toString()}</td>
                        </tr>
                    )}

                </tbody>
            </Table>
        );
    }

    async getBlocks() {
        let blockData = await this.getBlockFromApi();
        let _blocks = await this.getBlockFromApi();
        this.blocks=this.blocks.length?this.blocks:_blocks;
        // console.log(this.blocks.length);
        
        let isNewBlock = this.blocks.length==0 || (_blocks[0].height !== (this.blocks[0].height || 0));
        if(typeof this.blocks[0]!=='undefined'){
        // console.log('old block: ' + this.blocks[0].height);
        // console.log('new block: '+ _blocks[0].height);
        }
        let now = Date.now();
        if(isNewBlock){
            this.pushBlock(_blocks[0]);
        }
        for (let i=0;i<this.blocks.length;i++) {
            let block=this.blocks[i];
            block.time_ago = now - (block.block_time);
            if(i+1<this.blocks.length){
                block.adjust=Math.floor((block.block_time-this.blocks[i+1].block_time)/1000);
            }
        }
        ReactDOM.render(<TableRealTime blocks={this.blocks} />, document.getElementById('tb'));
    }

    start(timeUpdate) {
        this.getBlocks();
        // this.getBlockRpc();
        setInterval(() => {
            this.getBlocks();
            // this.getBlockRpc();
        }, timeUpdate)
    }

    pushBlock(block){
        let _blocks=new Array();
        _blocks[0]=block;
        console.log(JSON.stringify(_blocks[0]));
        for(let i=1;i<this.blocks.length;i++){
            _blocks[i]=this.blocks[i-1];
        }
       
        console.log(`blocks size: ${this.blocks.length}`);
        this.blocks=_blocks;
        
        
    }

    async getBlockFromApi(){
        let blockData = await axios.get('https://chainz.cryptoid.info/explorer/index.data.dws?coin=dash&n=10');
        let _blocks=blockData.data.blocks;
        let blocks=new Array();
        for(let _block of _blocks){
        blocks.push(this.convertBlock(_block));
    }
        return blocks;
    }
    
    convertBlock(_block){
        let miner=_block.miner.split(',');
        miner=miner.length>1?miner[1]:miner[0];
       
        return {
            height: _block.height,
            diff: _block.diff,
            miner: this.pool[[miner]] || miner,
            block_time: _block.dt*1000,
            adjust:0,
            time_ago: 0
        }
    }

    async getBlockRpc(){
        let blockData = await axios.post('localhost:9998',{
            headers:{
                Authorization:'Basic bm9kZTo2YzI0M2Y2M2U0ZTJhODU4NDdlOWRhZGNhNDk1OTZlYw=='
            }
        });
        console.log(blockData);

    }
}