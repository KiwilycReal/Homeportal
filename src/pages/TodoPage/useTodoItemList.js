import { useState } from "react";

const useTodoItemList = () => {
    const [todoItemList, setItemList] = useState([]);

    const setTodoItemList = (list) => {
        setItemList(list);
    };

    const addTodoItem = (item) => {
        setItemList(prevItemList => {
            let newItemList = Array.from(prevItemList);
            newItemList.push(item);
            return newItemList;
        });
    };

    const updateTodoItem = (item) => {
        setItemList(prevItemList => {
            let newItemList = Array.from(prevItemList);
            newItemList.splice(item.index, 1, item);
            return newItemList;
        });
    };

    const deleteTodoItem = (index) => {
        setItemList(prevItemList => {
            let newItemList = prevItemList.map(item => {
                // Leave items with smaller index than the deleted one untouched
                if(item.index < index) return item;

                return {
                    ...item,
                    index: item.index-1
                }
            });
            // After index update completes, remove the target item
            newItemList.splice(index, 1);
            return newItemList;
        });
    }

    return [todoItemList, setTodoItemList, addTodoItem, updateTodoItem, deleteTodoItem];
};

export default useTodoItemList;