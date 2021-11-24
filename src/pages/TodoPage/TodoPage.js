import styles from './TodoPage.module.css';

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import HightlightText from '../../components/utilities/HighlightText';
import useTodoItemList from './useTodoItemList';
import { useDispatch } from 'react-redux';
import { snackbarActions } from '../../store/snackbarSlice';

const TodoPage = () => {

    /**
     *   State for controlling the item edit dialog, the itemIndex stands
     * for the index of the current editting item in the entire item list.
     * This field will be -1 if user is adding a new item.
     */
    const [itemEditDialogState, setItemEditDialogState] = useState({
        isOpen: false,
        itemIndex: -1
    });
    const [searchTerm, setSearchTerm] = useState('');

    const [todoItemList, setTodoItemList, addTodoItem, updateTodoItem, deleteTodoItem] = useTodoItemList();
    const { control, handleSubmit, formState: { errors }, reset } = useForm();
    const dispatch = useDispatch();
    // Index value for newly added item
    let newItemIndex = todoItemList.length;

    const itemListFilter = (item) => {
        if(searchTerm === '') return true;
        let titleMatchResult = item.title.match(searchTerm, 'gi');
        let detailMatchResult = item.detail.match(searchTerm, 'gi');
        return titleMatchResult !== null || detailMatchResult !== null; 
    };

    const fetchLatestItem = () => {
        axios.get(
            '/api/todo'
        ).then(r => {
            /**
             *   The index field here is to locate the absolute position
             * of each item regarding to the entire item list. With this
             * index we can easily manipulate the state object for item
             * list when we edit/delete/display it.
             * 
             **/
            let itemList = r.data.map((item, index) => ({...item, index}));
            setTodoItemList(itemList);
        }).catch(
            e => dispatch(snackbarActions.showMessage({
                message: e.response.data + '\n' + e.response.statusText,
                title: 'Error occurs when fetching todo item list',
                alertSeverity: 'error'
            }))
        );
    };

    // Simplified function for handling favoured/checked status
    const onItemStatusChangeHandler = (event, index, statusType) => {
        // Prevent expanding the accordion when clicking fav/check icons
        event.stopPropagation();

        let updatedValue = !todoItemList[index][statusType];
        let updatedItem = {
            ...todoItemList[index],
            [statusType]: updatedValue
        };
        axios.post(
            "/api/todo/update",
            updatedItem
        ).then(r => {
            console.log('Changed item status', r.data);
            updateTodoItem(updatedItem);
        }).catch(
            e => dispatch(snackbarActions.showMessage({
                message: e.response.data + '\n' + e.response.statusText,
                title: "Failed to update the item's status!",
                alertSeverity: 'error'
            }))
        );
    };

    const createItem = () => {
        setItemEditDialogState({
            isOpen: true,
            itemIndex: -1
        });
    };

    const editItem = (index) => {
        setItemEditDialogState({
            isOpen: true,
            itemIndex: index
        });
    };

    const deleteItem = (index) => {
        axios.delete(
            `/api/todo/${todoItemList[index].id}`
        ).then(r => {
            console.log('deleted item', r.data);
            dispatch(snackbarActions.showMessage({
                title: 'Success!',
                message: 'Deleted the item successfully',
                alertSeverity: 'success'
            }));
            deleteTodoItem(index);
        }).catch(
            e => dispatch(snackbarActions.showMessage({
                title: 'Fail to delete the item!',
                message: e.response.data + '\n' + e.response.statusText,
                alertSeverity: 'error'
            }))
        );
    };

    const closeItemEditDialog = () => {
        setItemEditDialogState({
            isOpen: false,
            itemIndex: -1
        });
    };

    /**
     *   Update the item list state based on editting/adding behavior
     * and send proper data to the server to update database
     * @param {Object} data The user input value from the form
     */
    const submitItemData = data => {
        let index = itemEditDialogState.itemIndex;
        if(index < 0){
            // We are adding a new todo item
            let newItem = {
                isChecked: false,
                isFavoured: false,
                id: Date.now(),
                index: newItemIndex,
                ...data
            };
            axios.post(
                '/api/todo/new',
                newItem
            ).then(r => {
                console.log('added item', r.data);
                addTodoItem(newItem);
                dispatch(snackbarActions.showMessage({
                    title: 'Success!',
                    message: 'Added the new item',
                    alertSeverity: 'success'
                }));
            }).catch(
                e => dispatch(snackbarActions.showMessage({
                    title: 'Fail to add the new item!',
                    message: e.response.data + '\n' + e.response.statusText,
                    alertSeverity: 'error'
                }))
            );
        }else{
            // We are updating an existed todo item
            let updatedItem = {
                ...todoItemList[index],
                ...data
            }
            axios.post(
                '/api/todo/update',
                updatedItem
            ).then(r => {
                console.log('updated item', r.data);
                updateTodoItem(updatedItem);
                dispatch(snackbarActions.showMessage({
                    title: 'Success!',
                    message: 'Update successfully',
                    alertSeverity: 'success'
                }));
            }).catch(
                e => dispatch(snackbarActions.showMessage({
                    title: 'Fail to update the item!',
                    message: e.response.data + '\n' + e.response.statusText,
                    alertSeverity: 'error'
                }))
            );
        }
        closeItemEditDialog();
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    /**
     *   A minor component to display the todo item list based on current
     * todoItemList state (controlled by the useTodoItemList() hook)
     * @returns The filtered item list for displaying based on searchTerm
     */
    const TodoItemList = () => {
        const displayItemList = todoItemList.filter(itemListFilter);
        // The item list is empty or no item matches the current searchTerm
        if(displayItemList.length === 0) return 'Nothing Here';
        
        return displayItemList.map( item =>
            <Accordion key={item.id}>
                <AccordionSummary sx={{
                    bgcolor: '#edf4fb',
                    '& .MuiAccordionSummary-content': {
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }
                }}>
                    <Typography variant='h5'
                        sx={{
                            maxWidth: {
                                xs: '60%',
                                sm: '80%'
                            }
                        }}
                    >
                        <b><HightlightText keyword={searchTerm} rawText={item.title} /></b>
                    </Typography>
                    <Box>
                        <IconButton size='large'
                            onClick={(e)=>onItemStatusChangeHandler(e, item.index, 'isChecked')}
                        >
                            {item.isChecked
                                ? <CheckCircleOutlineIcon />
                                : <RadioButtonUncheckedIcon />}
                        </IconButton>
                        <IconButton size='large'
                            onClick={(e)=>onItemStatusChangeHandler(e, item.index, 'isFavoured')}
                        >
                            {item.isFavoured
                                ? <FavoriteIcon />
                                : <FavoriteBorderIcon />}
                        </IconButton>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{
                    bgcolor: '#e6eaef'
                }}>
                    <Typography variant='h6'>
                        <HightlightText keyword={searchTerm} rawText={item.detail} />
                    </Typography>
                    <Button variant='text'
                        size='small'
                        color='success'
                        startIcon={<EditIcon />}
                        onClick={()=>editItem(item.index)}
                    >
                        Edit
                    </Button>
                    <Button variant='text'
                        size='small'
                        color='error'
                        startIcon={<DeleteIcon />}
                        onClick={()=>deleteItem(item.index)}
                    >
                        Delete
                    </Button>
                </AccordionDetails>
            </Accordion>
        );
    };

    // Clear the form after modal closed, ensures proper display of modal.
    useEffect(reset, [itemEditDialogState, reset]);
    
    // Fetch the latest item list from database when the page initialized
    useEffect(fetchLatestItem, []);

    return <Grid container item>

        <Grid container item
            sx={{
                alignItems: 'center',
                bgcolor: '#edf4fb',
                padding: '6px'
            }}
        >
            <Grid item>
                <Typography variant={'h3'}>TODO List</Typography>
            </Grid>
            <Grid item>
                <IconButton onClick={fetchLatestItem}
                    color='primary'
                    size='large'
                >
                    <RefreshIcon />
                </IconButton>
            </Grid>
        </Grid>

        <Grid container item
            spacing={2}
            sx={{
                paddingTop: '8px',
                paddingBottom: '10px',
                justifyContent: {
                    xs: 'flex-start',
                    sm: 'space-between'
                },
                alignItems: 'flex-end'
            }}
        >
            <Grid item>
                <Button variant="contained" onClick={createItem}>
                    Add one!
                </Button>
            </Grid>
            <Grid item>
                <TextField label="Search"
                    variant="standard"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <ManageSearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            searchTerm !== '' && <InputAdornment position='end'>
                                <IconButton onClick={clearSearch}>
                                    <SearchOffIcon />
                                </IconButton>
                            </InputAdornment>
                        )
                    }} />
            </Grid>
        </Grid>

        <Grid item
            xs={12}
            sx={{
                width: '98%'
            }}
        >
            <TodoItemList />
        </Grid>

        <Dialog open={itemEditDialogState.isOpen}
            fullWidth={true}
            maxWidth='md'    
        >
            <DialogTitle>
                Editting item...
            </DialogTitle>
            <DialogContent sx={{
                paddingTop: '20px !important'
            }}>
                <form>
                    <Grid container
                        spacing={4}
                    >
                        <Grid item xs={12}>
                            <Controller name='title'
                                control={control}
                                defaultValue={todoItemList[itemEditDialogState.itemIndex]?.title}
                                rules={{
                                    required: true
                                }}
                                render={({field}) => <TextField {...field}
                                    label='Title'
                                    error={!!errors.title}
                                    helperText={errors.title
                                        ? 'You must enter a title.'
                                        : ''}
                                    fullWidth
                                />}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Controller name='detail'
                                control={control}
                                defaultValue={todoItemList[itemEditDialogState.itemIndex]?.detail}
                                rules={{
                                    required: true
                                }}
                                render={({field}) => <TextField {...field}
                                    label='Detail'
                                    error={!!errors.detail}
                                    helperText={errors.detail
                                        ? 'You must enter the details.'
                                        : ''}
                                    multiline
                                    fullWidth
                                    maxRows={10}
                                />}
                            />
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined'
                    color='error'
                    onClick={closeItemEditDialog}
                >
                    Discard
                </Button>
                <Button variant='contained'
                    color='success'
                    onClick={handleSubmit(submitItemData)}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    </Grid>
};

export default TodoPage;