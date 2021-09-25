
import { Typography } from '@mui/material';
import styles from './BottomBanner.module.css';

const BottomBanner = () => {
    return <div className={styles.banner}>
        <Typography variant="h6">
            Copyright © 2021 Yichen Liu
        </Typography>
    </div>

};

export default BottomBanner;