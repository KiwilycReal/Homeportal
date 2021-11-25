import styles from './MainNavBar.module.css';

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import TimelineIcon from '@mui/icons-material/Timeline';
import EventIcon from '@mui/icons-material/Event';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from '../../store/authSlice';
import { snackbarActions } from '../../store/snackbarSlice';
import useAxios from '../../hooks/useAxios';

const MainNavBar = (props) => {
    
    const [selectedItemIndex, setSelectedItemIndex] = useState(0);
    const isLogged = useSelector(state => state.auth.isLogged);
    const sendRequest = useAxios();
    const dispatch = useDispatch();

    const menuItemObj = {
        'Home': [<HomeIcon />, '/home'],
        'Gallery': [<PhotoLibraryIcon />, '/gallery'],
        'Account Books': [<LocalAtmIcon />, '/account-book'],
        'To-do List': [<FormatListNumberedIcon />, '/todo'],
        'Chronology': [<TimelineIcon />, '/chronology'],
        'Calendar': [<EventIcon />, '/calendar']
    };


    const onMenuItemSelectHandler = (index) => {
        if (index === selectedItemIndex) return;
        if (!isLogged) props.onAuthDialogChange();
        setSelectedItemIndex(index);
    };

    const userLogout = () => {
        let successHandler = (response) => {
            console.log('Logout successfully', response.data);
            localStorage.setItem('username', '');
            dispatch(authActions.logout());
            dispatch(snackbarActions.showMessage({
                message: 'You have logged out, login to access the full website',
                title: 'Log out successfully!',
                alertSeverity: 'success'
            }));
        };
        let errorHandler = (error) => dispatch(snackbarActions.showMessage({
            message: error.response.data + '; ' + error.response.statusText,
            title: "Error occurs when trying to logout!",
            alertSeverity: 'error'
        }));

        sendRequest({
            url: '/api/logout',
            method: 'get'
        }, successHandler, errorHandler);
    }

    return <>
        <AppBar component='div' position='fixed'
            sx={{ 
                zIndex: theme => theme.zIndex.drawer + 1,
                transition: 'width 300ms',
                transitionTimingFunction: 'ease',
                ...(props.isDrawerOpened && {
                    marginLeft: props.openedDrawerWidth,
                    width: `calc(100% - ${props.openedDrawerWidth})`
                }),
            }}
        >
            <Toolbar sx={{
                justifyContent: 'space-between',
                paddingLeft: '8px !important'
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    {!props.isDrawerOpened && <IconButton onClick={props.onDrawerChange}>
                        <MenuIcon />
                    </IconButton>}
                    <Typography
                        variant="h5"
                        sx={{margin: '0 0 0 8px'}}
                    >
                        HOMEPORTAL
                    </Typography>
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <IconButton color="inherit"
                        onClick={
                            isLogged
                                ? userLogout
                                : props.onAuthDialogChange
                        }
                    >
                        {
                            isLogged
                                ? <><LogoutIcon />Log out</>
                                : <><AccountCircleIcon />Log in</>
                        }
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                '& .MuiDrawer-paper': {
                    width: props.isDrawerOpened ? props.openedDrawerWidth : props.closedDrawerWidth,
                    transition: 'width 300ms',
                    transitionTimingFunction: 'ease'
                },
            }}
        >
            <Toolbar sx={{
                bgcolor: theme => theme.palette.primary.main,
                justifyContent: 'flex-end',
                paddingRight: '0 !important'
            }}>
                <IconButton size="large"
                onClick={props.onDrawerChange}
                >
                    <ChevronLeftIcon fontSize="inherit" />
                </IconButton>
            </Toolbar>
            <List sx={{
                overflowX: 'hidden',
                '& a': {
                    color: 'inherit',
                    textDecoration: 'none'
                }
            }}>
                {Object.keys(menuItemObj).map((label, index) => 
                    <Link to={menuItemObj[label][1]}
                        key={label}
                    >
                        <ListItem  sx={{
                            padding: '8px 0',
                            whiteSpace: 'nowrap'
                        }}>
                            <ListItemButton selected={index === selectedItemIndex}
                                onClick={()=>onMenuItemSelectHandler(index)}
                            >
                                <ListItemIcon>
                                    {menuItemObj[label][0]}
                                </ListItemIcon>
                                    <ListItemText primary={label} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                )}
            </List>
        </Drawer>
    </>
};

export default MainNavBar;