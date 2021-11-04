import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { Alert, AlertTitle, Backdrop, Button, CircularProgress, Grid, IconButton, Snackbar, TextField } from '@mui/material';
import { InputAdornment } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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

    const getUsernameErrorMsg = () => {
        if(!errors.username) return '';

        switch(errors.username.type){
            case 'required': return 'This field cannot be empty!';
            case 'minLength': return "Username's length must longer than 3";
        }
    }

    const getPasswordErrorMsg = () => {
        if(!errors.password) return '';

        switch(errors.password.type){
            case 'required': return 'This field cannot be empty!';
            case 'pattern': return "Password should contain both numbers and letters, with the least length of 8";
        }
    }

    const getNameErrorMsg = (error) => {
        if(!error) return '';

        switch(error.type){
            case 'required': return 'This field cannot be empty!';
            case 'pattern': return "Characters other than letter are not allowed";
        }
    }
    
    return <Dialog open={props.isAuthDialogOpened}
            fullWidth={true}
            maxWidth='xs'
        >
        <DialogContent>
            <form>
                <Grid container
                    spacing={1}
                    sx={{
                        justifyContent: 'center',
                        height: isLogin ? '300px' : '560px',
                        overflow: 'hidden',
                        transition: 'height 0.2s'
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
                                minLength: 2,
                            }}
                            render={({field}) => <TextField {...field}
                                label='Username'
                                error={!!errors.username}
                                helperText={getUsernameErrorMsg()}
                                fullWidth
                            />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller name='password'
                            control={control}
                            rules={{
                                required: true,
                                pattern: /^(?=.*[0-9])(?=.*[a-zA-Z])(.{8,})$/
                            }}
                            render={({field}) => <TextField {...field}
                                label='Password'
                                type={isPasswordVisible ? 'text' : 'password'}
                                error={!!errors.password}
                                helperText={getPasswordErrorMsg()}
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
                                    required: true,
                                    validate: () => getValues('password') === getValues('passwordC')
                                }}
                                render={({field}) => <TextField {...field}
                                    label='Confirm Your Password'
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    error={!!errors.passwordC}
                                    helperText={errors.passwordC
                                        ? "Passwords don't match"
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
                                    required: true,
                                    pattern: /^[A-Za-z ]+$/
                                }}
                                render={({field}) => <TextField {...field}
                                    label='First Name'
                                    error={!!errors.firstName}
                                    helperText={getNameErrorMsg(errors.firstName)}
                                    fullWidth
                                />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller name='lastName'
                                control={control}
                                rules={{
                                    required: true,
                                    pattern: /^[A-Za-z]+$/
                                }}
                                render={({field}) => <TextField {...field}
                                    label='Last Name'
                                    error={!!errors.lastName}
                                    helperText={getNameErrorMsg(errors.lastName)}
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
            >
                <AlertTitle>Authentication Error</AlertTitle>
                {hintState.message}
            </Alert>
        </Snackbar>
    </Dialog>
};

export default AuthenticationDialog;