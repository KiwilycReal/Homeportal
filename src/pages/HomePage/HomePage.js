
import styles from './HomePage.module.css';
import { Button } from '@material-ui/core';
import MainNavBar from '../../components/MainNavBar/MainNavBar';
import BottomBanner from '../../components/MainNavBar/BottomBanner/BottomBanner';

const HomePage = () => {
    return <>
        <MainNavBar/>
        <div style={{height: '3000px'}}/>
        <BottomBanner/>
    </>
};

export default HomePage;