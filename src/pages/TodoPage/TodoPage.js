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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';

const TodoPage = () => {
    
    const emptyItemData = {
        title: '',
        detail: '',
        isChecked: false,
        isFavoured: false
    }
    const [itemList, setItemList] = useState([
        {
            title: 'this is title1',
            detail: 'this is detail1!!!---this is detail1!!!---this is detail1!!!---this is detail1!!!---',
            isChecked: false,
            isFavoured: false
        },
        {
            title: 'this is title2',
            detail: 'this is detail2!!!---this is detail2!!!---this is detail2!!!---this is detail1!!!---',
            isChecked: true,
            isFavoured: false
        },
        {
            title: 'this is title3',
            detail: 'this is detail3!!!---this is detail3!!!---this is detail3!!!---this is detail1!!!---',
            isChecked: false,
            isFavoured: true
        },
    ]);
    const [modalState, setModalState] = useState({
        isOpen: false,
        isNew: false,
        itemIndex: -1
    });
    const { control, handleSubmit, formState: { errors }, reset } = useForm();
    // Clear the form after modal closed, ensures proper display of modal.
    useEffect(reset, [modalState]);

    // Simplified function for handling favoured/checked status, not quite universal.
    const onItemStatusChangeHandler = (event, index, statusType) => {
        event.stopPropagation();
        setItemList(prevState => {
            let newState = Array.from(prevState);
            let changedItem = newState[index];
            let updatedValue = !changedItem[statusType];
            newState.splice(index, 1, {...changedItem, [statusType]: updatedValue})
            return newState;
        });
    };

    const createItem = () => {
        setModalState({
            isOpen: true,
            isNew: true,
            itemIndex: -1
        });
    };

    const editItem = (index) => {
        setModalState({
            isOpen: true,
            isNew: false,
            itemIndex: index
        });
    };

    const deleteItem = (index) => {
        setItemList(prevState => {
            let newState = Array.from(prevState);
            newState.splice(index, 1);
            return newState;
        });
    };

    const submitItemData = data => {
        setItemList(prevState => {
            let newState = Array.from(prevState);
            let index = modalState.itemIndex;
            if(index < 0){
                newState.push({
                    ...modalState.itemData,
                    ...data
                });
            }else{
                let changedItem = newState[index];
                newState.splice(index, 1, {
                    ...changedItem,
                    ...data
                })
            }
            return newState;
        })
        closeModal();
    }

    const closeModal = () => {
        setModalState({
            isOpen: false,
            isNew: false,
            itemIndex: -1
        });
    }

    return <Grid container item
        spacing={4}
    >
        <Grid item>
            <h1>TODO List</h1>
        </Grid>

        <Grid container item
            justifyContent='space-between'
            alignItems='center'
        >
            <Grid item>
                <TextField label="Search"
                    variant="standard" />
            </Grid>
            <Grid item>
                <Button variant="contained" onClick={createItem}>
                    Add one!
                </Button>
            </Grid>
        </Grid>

        <Grid item
            xs={12}
            sx={{
                width: '98%'
            }}
        >
            {itemList.map((item, index) =>
                <Accordion key={item.title}>
                    <AccordionSummary sx={{
                        bgcolor: '#edf4fb',
                        '& .MuiAccordionSummary-content': {
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }
                    }}>
                        <Typography variant='h4'>{item.title}</Typography>
                        <Box>
                            <IconButton size='large'
                                onClick={(e)=>onItemStatusChangeHandler(e, index, 'isChecked')}
                            >
                                {item.isChecked
                                    ? <CheckCircleOutlineIcon />
                                    : <RadioButtonUncheckedIcon />}
                            </IconButton>
                            <IconButton size='large'
                                onClick={(e)=>onItemStatusChangeHandler(e, index, 'isFavoured')}
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
                        <Typography variant='h6'>{item.detail}</Typography>
                        <Button variant='text'
                            size='small'
                            color='success'
                            startIcon={<EditIcon />}
                            onClick={()=>editItem(index)}
                        >
                            Edit
                        </Button>
                        <Button variant='text'
                            size='small'
                            color='error'
                            startIcon={<DeleteIcon />}
                            onClick={()=>deleteItem(index)}
                        >
                            Delete
                        </Button>
                    </AccordionDetails>
                </Accordion>
            )}
        </Grid>

        <Dialog open={modalState.isOpen}
            fullWidth={true}
            maxWidth='md'    
        >
            <DialogTitle>
                {modalState.isNew
                    ? 'Creating a new TODO note...'
                    : 'Editing a TODO note...'}
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
                                defaultValue={itemList[modalState.itemIndex]?.title}
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
                                defaultValue={itemList[modalState.itemIndex]?.detail}
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
                    onClick={closeModal}
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