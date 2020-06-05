import React from 'react'
import map1Def from 'mapdefs/demo1def.yaml'
import map2Def from 'mapdefs/demo2def.yaml'
import GameMap from 'components/GameMap'
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import partialTheme from 'theme'
import CssBaseline from '@material-ui/core/CssBaseline'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

const theme = createMuiTheme(partialTheme)

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <div className="App">
            <Switch>
              <Route path="/demo1">
                <GameMap mapDef={map1Def} />
              </Route>
              <Route path="/demo2">
                <GameMap mapDef={map2Def} />
              </Route>

              <Route>
                <GameMap mapDef={map1Def} />
              </Route>
            </Switch>
          </div>
        </CssBaseline>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
