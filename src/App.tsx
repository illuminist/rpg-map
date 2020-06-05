import React from 'react'
import mapDef from './mapDef.yaml'
import GameMap from 'components/GameMap'

function App() {
  return (
    <div className="App">
      <GameMap mapDef={mapDef} />
    </div>
  )
}

export default App
