import { Grid, Typography, Button, Paper } from "@mui/material";

const DenyPage = () => {

    return <Grid container item
        spacing={10}
        sx={{
            textAlign: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '10%'
    }}>
        <Grid item xs={12}>
            <Typography variant='h4'>
                Oops! This page will stay hidden until you log in!
            </Typography>
        </Grid>

        <Grid item xs={12}>
            <img style={{
                maxWidth: '40%',
                maxHeight: '40%'
            }} src='/roadblock.jpg' />
        </Grid>
    </Grid>
};

export default DenyPage;