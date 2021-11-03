import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Alert, AlertTitle, Backdrop, Button, CircularProgress, Grid, IconButton, Snackbar, TextField } from '@mui/material';
import { InputAdornment } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import qs from 'qs';

const AuthenticationDialog = (props) => {

    const { control, handleSubmit, formState: { errors }, reset, getValues } = useForm();
    const [ isLogin, setIsLogin ] = useState(false);
    const [ isPasswordVisible, setIsPasswordVisible ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ hintState, setHintState ] = useState({
        isActive: false,
        message: '',
        autoHideDuration: 6000,
        vertical: 'top',
        horizontal: 'center'
    });

    useEffect(reset,[reset, props.isAuthDialogOpened])

    var lastSetTimeout = null;

    const submitAuthData = data => {
        setIsLoading(true);
        console.log(data)
        let requestPromise = isLogin
            ? sendLoginRequest
            : sendRegisterRequest;
        requestPromise(data).then( r => {
            console.log('Login/Register response', r);
            if(!r.data.username) throw new Error(r.data)
            if(isLogin){
                localStorage.setItem('username', r.data.username)
                props.onAuthDialogChange();
            }else{
                setIsLogin(true);
            }
        }).catch( e => {
            console.log(e);
            setHintState({
                ...hintState,
                isActive: true,
                message: e.message
            })
        }).finally(() => setIsLoading(false));
    }

    const sendRegisterRequest = data => axios.post(
        '/api/register',
        data
    );

    const sendLoginRequest = data => axios.post(
        '/api/login',
        qs.stringify(data),
        {
            headers: {
                'Content-Type': "application/x-www-form-urlencoded"
            }
        }
    );

    const changePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    }

    

    const checkDuplicateUsername = () => new Promise((resolve, reject) => {
        let username = getValues('username');
        clearTimeout(lastSetTimeout);
        lastSetTimeout = setTimeout(() => {
            axios.get(
                '/api/auth',
                {
                    params: {
                        username: username
                    }
                }
            ).then(r => resolve(r.data)).catch(e => reject(e));
        }, 2500)
    });
    

    return <Dialog open={props.isAuthDialogOpened}
            fullWidth={true}
            maxWidth='xs'
        >
        <DialogContent>
            <form>
                <Grid container
                    spacing={2}
                    sx={{
                        justifyContent: 'center',
                        overflow: 'hidden',
                        height: isLogin ? '350px' : '650px',
                        transition: 'height .2s'
                    }}
                >
                    <Grid container item
                        sx={{
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        xs={12}>
                        <Grid item>
                            <Button 
                                onClick={() => setIsLogin(false)}
                                sx={{
                                    fontSize: isLogin || 30
                            }}>
                                Sign Up
                            </Button>
                        </Grid>
                        <Grid item>
                            <span><b>/</b></span>
                        </Grid>
                        <Grid item>
                            <Button 
                                onClick={() => setIsLogin(true)}
                                sx={{
                                    fontSize: isLogin && 30
                            }}>
                                Sign in
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Controller name='username'
                            control={control}
                            rules={{
                                required: true,
                                // validate: async () => await checkDuplicateUsername()
                            }}
                            render={({field}) => <TextField {...field}
                                label='Username'
                                error={!!errors.username}
                                helperText={errors.username
                                    ? 'This field cannot be empty.'
                                    : ''}
                                fullWidth
                            />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller name='password'
                            control={control}
                            rules={{
                                required: true
                            }}
                            render={({field}) => <TextField {...field}
                                label='Password'
                                type={isPasswordVisible ? 'text' : 'password'}
                                error={!!errors.password}
                                helperText={errors.password
                                    ? 'This field cannot be empty.'
                                    : ''}
                                fullWidth
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton onClick={changePasswordVisibility}>
                                                {isPasswordVisible
                                                    ? <VisibilityOffIcon />
                                                    : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />}
                        />
                    </Grid>
                    {isLogin || <>
                        <Grid item xs={12}>
                            <Controller name='passwordC'
                                control={control}
                                rules={{
                                    required: true
                                }}
                                render={({field}) => <TextField {...field}
                                    label='Confirm Your Password'
                                    type='text'
                                    error={!!errors.passwordC}
                                    helperText={errors.passwordC
                                        ? 'This field cannot be empty.'
                                        : ''}
                                    fullWidth
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position='end'>
                                                <IconButton onClick={changePasswordVisibility}>
                                                    {isPasswordVisible
                                                        ? <VisibilityOffIcon />
                                                        : <VisibilityIcon />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller name='firstName'
                                control={control}
                                rules={{
                                    required: true
                                }}
                                render={({field}) => <TextField {...field}
                                    label='First Name'
                                    error={!!errors.firstName}
                                    helperText={errors.firstName
                                        ? 'This field cannot be empty.'
                                        : ''}
                                    fullWidth
                                />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller name='lastName'
                                control={control}
                                rules={{
                                    required: true
                                }}
                                render={({field}) => <TextField {...field}
                                    label='Last Name'
                                    error={!!errors.lastName}
                                    helperText={errors.lastName
                                        ? 'This field cannot be empty.'
                                        : ''}
                                    fullWidth
                                />}
                            />
                        </Grid>
                    </>}
                    <Grid container item
                        xs={12}
                        sx={{
                            justifyContent: 'space-between'
                        }}
                    >
                        <Grid item>
                            <Button variant='outlined'
                                color='error'
                                onClick={props.onAuthDialogChange}
                            >
                                Cancel
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant='contained'
                                onClick={handleSubmit(submitAuthData)}
                            >
                                {isLogin ? 'Login' : 'Register'}
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </form>
        </DialogContent>

        <Backdrop open={isLoading}
            sx={{
                flexDirection: 'column'
            }}
        >
            <Typography variant='h5' color='ivory'>Just few seconds ...</Typography>
            <CircularProgress />
        </Backdrop>

        <Snackbar open={hintState.isActive}
            autoHideDuration={hintState.autoHideDuration}
            anchorOrigin={{
                vertical: hintState.vertical,
                horizontal: hintState.horizontal
            }}
            onClose={() => setHintState({
                ...hintState,
                isActive: false
            })}
            
        >
            <Alert severity='error'
                onClose={() => setHintState({
                    ...hintState,
                    isActive: false
                })}
                // action={
                //     <IconButton color='inherit'
                //         onClick={()=>setHintState({
                //             ...hintState,
                //             isActive: false
                //         })}
                //     >
                //         <CloseIcon />
                //     </IconButton>
                // }
            >
                <AlertTitle>Authentication Error</AlertTitle>
                {hintState.message}
            </Alert>
        </Snackbar>
    </Dialog>
};

export default AuthenticationDialog;