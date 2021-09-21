
import { useState } from 'react';
import { AppBar, Button, IconButton, Toolbar, Typography, Box, Drawer,  List, ListItemIcon, Divider, ListItemText, CssBaseline } from '@material-ui/core';
import { AccountCircle, ChevronLeft } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import styles from './MainNavBar.module.css';

const MainNavBar = () => {
    
    const [isDrawerOpened, setIsDrawerOpened] = useState(false);

    return <>
        <AppBar position='fixed'
            sx={{ 
                zIndex: 1300
            }}
        >
            <Toolbar style={{
                'justify-content': 'space-between'
            }}>
                <Box sx={{
                    display: 'flex',
                    'align-items': 'center',
                }}>
                    <IconButton edge="start">
                        <MenuIcon/>
                    </IconButton>
                    <Typography
                        variant="h5"
                        style={{margin: '0 0 0 1rem'}}
                    >
                        HOMEPORTAL ｜ 家庭中枢
                    </Typography>
                </Box>
                <Box sx={{
                    display: 'flex',
                    'justify-content': 'flex-end'
                }}>
                    <IconButton
                        edge="end"
                        color="inherit"
                    >
                        <AccountCircle/>
                        Login
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={isDrawerOpened} anchor="left">
            {/* <IconButton onClick={()=>setIsDrawerOpened(false)}>
                <ChevronLeft />
            </IconButton> */}
            <Toolbar />
            <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                
                <p>text</p>
            ))}
            </List>
        </Drawer>
    </>
};

export default MainNavBar;