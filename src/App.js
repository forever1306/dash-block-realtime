import React, { Component } from 'react';
import TableRealTime from './TableRealTime';
import './App.css';


class App extends Component {
  render() {
    return (
      <div id="tb">
      <TableRealTime blocks={[]}/>
      </div>
    );
  }
}

export default App;
