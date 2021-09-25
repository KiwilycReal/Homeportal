import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Divider from '@mui/material/Divider'
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
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AdbIcon from '@mui/icons-material/Adb';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import styles from './MainNavBar.module.css';

const MainNavBar = (props) => {
    
    const menuItemObj = {
        'Gallery': <PhotoLibraryIcon />,
        'Account Books': <LocalAtmIcon />,
        'Dummy1': <AdbIcon />,
        'Dummy2': <AdbIcon />,
        'Dummy3': <AdbIcon />,
        'Dummy4': <AdbIcon />
    }

    return <>
        <AppBar component='div' position='fixed'
            sx={{ 
                zIndex: theme => theme.zIndex.drawer + 1,
                transition: 'width 1s',
                transitionTimingFunction: 'ease',
                ...(props.isDrawerOpened && {
                    marginLeft: props.openedDrawerWidth,
                    width: `calc(100% - ${props.openedDrawerWidth})`
                }),
            }}
        >
            <Toolbar sx={{
                justifyContent: 'space-between'
            }}>
                <Box sx={{
                    display: 'flex',
                    'align-items': 'center',
                }}>
                    <IconButton edge="start"
                        onClick={props.onDrawerChangeHandler}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h5"
                        sx={{margin: '0 0 0 1rem'}}
                    >
                        HOMEPORTAL ｜ 家庭中枢
                    </Typography>
                </Box>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <IconButton
                        edge="end"
                        color="inherit"
                    >
                        <AccountCircleIcon />
                        Login
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
                    transition: 'width 1s',
                    transitionTimingFunction: 'ease'
                },
            }}
        >
            <Toolbar>
                <IconButton edge="end">
                    <ChevronLeftIcon />
                </IconButton>
            </Toolbar>
            <List sx={{
                overflowX: 'hidden',
                // marginTop: theme => theme.mixins.toolbar["@media (min-width:600px)"].minHeight + 'px'
            }}>
                {Object.keys(menuItemObj).map((label, index) => 
                    <ListItem key={label}
                        sx={{padding: '8px 4px'}}
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                {menuItemObj[label]}
                            </ListItemIcon>
                            <ListItemText primary={label} />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </Drawer>
    </>
};

export default MainNavBar;