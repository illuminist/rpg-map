import React from 'react'
import map1Def from 'mapdefs/demo1def.yaml'
import map2Def from 'mapdefs/demo2def.yaml'
import map3Def from 'mapdefs/demo3def.yaml'
import GameMap from 'components/GameMap'
import ThemeProvider from '@material-ui/styles/ThemeProvider'
import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import partialTheme from 'theme'
import CssBaseline from '@material-ui/core/CssBaseline'
import { HashRouter, Route, Switch } from 'react-router-dom'
import GameEditor from 'components/GameEditor'
import store, { persistor } from 'store/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

const theme = createMuiTheme(partialTheme)

function App() {
  return (
    <HashRouter basename={process.env.PUBLIC_URL}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
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
                  <Route path="/demo3">
                    <GameMap mapDef={map3Def} />
                  </Route>

                  <Route>
                    <GameEditor mapDef={map3Def} />
                  </Route>
                </Switch>
              </div>
            </CssBaseline>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </HashRouter>
  )
}

export default App
