
import './App.css';

import Grid from '@mui/material/Grid';

import { useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Snackbar from '@mui/material/Snackbar';

import MainNavBar from './components/MainNavBar/MainNavBar';
import BottomBanner from './components/MainNavBar/BottomBanner/BottomBanner';
import HomePage from './pages/HomePage/HomePage';
import TodoPage from './pages/TodoPage/TodoPage';
import AuthenticationDialog from './components/AuthenticationDialog/AuthenticationDialog';
import { useDispatch, useSelector } from 'react-redux';
import { snackbarActions } from './store/snackbarSlice';
import DenyPage from './pages/DenyPage/DenyPage';

function App() {

  const openedDrawerWidth = '200px';
  const closedDrawerWidth = '56px';
  const [isDrawerOpened, setIsDrawerOpened] = useState(false);
  const [isAuthDialogOpened, setIsAuthDialogOpened] = useState(false);
  const isLogged = useSelector(state => state.auth.isLogged);
  const snackbarState = useSelector(state => state.snackbar);
  const dispatch = useDispatch();

  const onAuthDialogChangeHandler = () => {
      setIsAuthDialogOpened(!isAuthDialogOpened)
  }

  const onDrawerChangeHandler = () => {
      setIsDrawerOpened(!isDrawerOpened)
  }

  return <>
    <MainNavBar isDrawerOpened={isDrawerOpened}
        onDrawerChange={onDrawerChangeHandler}
        onAuthDialogChange={onAuthDialogChangeHandler}
        openedDrawerWidth={openedDrawerWidth}
        closedDrawerWidth={closedDrawerWidth}
    />
    <Grid container
        // spacing={2}
        alignItems='flex-start'
        sx={{
            width: `calc(100% - ${isDrawerOpened ? openedDrawerWidth : closedDrawerWidth})`,
            height: '1000px',
            padding: '16px',
            zIndex: theme => theme.zIndex.drawer + 1,
            marginTop: theme => theme.mixins.toolbar["@media (min-width:600px)"].minHeight + 'px',
            transition: 'margin 300ms, width 300ms',
            transitionTimingFunction: 'ease',
            marginLeft: isDrawerOpened ? openedDrawerWidth : closedDrawerWidth
    }}>
        <Switch>
            <Route path="/home">
                <HomePage />
            </Route>
            <Route path="/todo">
                {isLogged ? <TodoPage /> : <DenyPage />}
            </Route>
            <Route path="/">
                <Redirect to="/home" />
            </Route>
        </Switch>
    </Grid>
    <BottomBanner/>
    <AuthenticationDialog isAuthDialogOpened={isAuthDialogOpened}
        onAuthDialogChange={onAuthDialogChangeHandler}
    />
    <Snackbar open={snackbarState.isActive}
            autoHideDuration={snackbarState.autoHideDuration}
            anchorOrigin={{
                vertical: snackbarState.vertical,
                horizontal: snackbarState.horizontal
            }}
            onClose={() => dispatch(snackbarActions.close())}
            
        >
            <Alert severity={snackbarState.alertSeverity}
                onClose={() => dispatch(snackbarActions.close())}
            >
                <AlertTitle>{snackbarState.title}</AlertTitle>
                {snackbarState.message}
            </Alert>
        </Snackbar>
  </>
}

export default App;
