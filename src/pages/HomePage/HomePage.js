
import styles from './HomePage.module.css';
import { useState } from 'react';
import Grid from '@mui/material/Grid'
import MainNavBar from '../../components/MainNavBar/MainNavBar';
import BottomBanner from '../../components/MainNavBar/BottomBanner/BottomBanner';

const HomePage = () => {

    const openedDrawerWidth = '239px';
    const closedDrawerWidth = '62px';
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
        <Grid
            sx={{
            height: '3000px',
            zIndex: theme => theme.zIndex.drawer + 1,
            marginTop: theme => theme.mixins.toolbar["@media (min-width:600px)"].minHeight + 'px',
            transition: 'margin 1s',
            transitionTimingFunction: 'ease',
            marginLeft: isDrawerOpened ? openedDrawerWidth : closedDrawerWidth
        }}>
            <h1>teste</h1>
        </Grid>
        <BottomBanner/>
    </>
};

export default HomePage;