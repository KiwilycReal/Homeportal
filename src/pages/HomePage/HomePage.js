import styles from './HomePage.module.css';

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent';

const HomePage = () => {

    return <>
        <Grid container item justifyContent="flex-start">
            <Grid item>
                <Card>
                    <CardContent>
                        <h2>This is for gallery</h2>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item>
                <Card>
                    <CardContent>
                        <h2>This is for to-do list</h2>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
        <Grid container item justifyContent="center">
            <Grid item>
                <Card>
                    <CardContent>
                        <h2>This is for account chart</h2>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </>
};

export default HomePage;