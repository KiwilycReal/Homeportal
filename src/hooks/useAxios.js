import axios from 'axios';
import { useDispatch } from 'react-redux';
import { authActions } from '../store/authSlice';
import { snackbarActions } from '../store/snackbarSlice';

const useAxios = () => {

    const dispatch = useDispatch();

    const sendRequest = (config, successHandler, errorHandler) => {
        return axios(config).catch(error => {
            if(error.response.status === 401){
                // When HTTP 401 Unauthorized happens
                dispatch(snackbarActions.showMessage({
                    message: 'Please login first to access the full webiste',
                    title: 'You are not logged in',
                    alertSeverity: 'error'
                }));
                dispatch(authActions.logout());
                return Promise.resolve(error.response);
            }else{
                return Promise.reject(error);
            }
        }).then( response => {
            if(response.status === 401){
                // We have handled the HTTP 401 error in the above catch
                return
            }else{
                successHandler(response)
            }
        }).catch(errorHandler);
    }

    return sendRequest;
};

export default useAxios;