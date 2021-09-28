
import './App.css';

import Grid from '@mui/material/Grid';

import { useState } from 'react';
import { Route, Switch, Redirect} from 'react-router-dom';

import MainNavBar from './components/MainNavBar/MainNavBar';
import BottomBanner from './components/MainNavBar/BottomBanner/BottomBanner';
import HomePage from './pages/HomePage/HomePage';
import TodoPage from './pages/TodoPage/TodoPage';

function App() {

  const openedDrawerWidth = '200px';
  const closedDrawerWidth = '56px';
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);

  const onDrawerChange = () => {
      setIsDrawerOpened(!isDrawerOpened)
  }

  return <>
    <MainNavBar isDrawerOpened={isDrawerOpened}
        onDrawerChangeHandler={onDrawerChange}
        openedDrawerWidth={openedDrawerWidth}
        closedDrawerWidth={closedDrawerWidth}
    />
    <Grid container
        spacing={2}
        sx={{
        height: '1000px',
        zIndex: theme => theme.zIndex.drawer + 1,
        marginTop: theme => theme.mixins.toolbar["@media (min-width:600px)"].minHeight + 'px',
        transition: 'margin 300ms',
        transitionTimingFunction: 'ease',
        marginLeft: isDrawerOpened ? openedDrawerWidth : closedDrawerWidth
    }}>
        <Switch>
            <Route path="/home">
                <HomePage />
            </Route>
            <Route path="/todo">
                <TodoPage />
            </Route>
            <Route path="/">
                <Redirect to="/home" />
            </Route>
        </Switch>
    </Grid>
    <BottomBanner/>
  </>
}

export default App;
