import React, {useState, useEffect} from "react";
import Axios from 'axios';
import {  AiFillEdit, AiFillDelete } from "react-icons/ai";

export const Task = (props) => {
    const [checked, setChecked] = useState(props.completed)

    
    const api = process.env.REACT_APP_API_URL
    // const api = 'http://localhost:3001'

    useEffect(() => {
        if(props.completed === true) {
            let item = document.getElementById(props._id)
            item.classList.add("completed")
        }
    }, [])

    const months = {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December"
    }

    const convertDate = (date) => {
        let year = date.substring(0,4)
        let tempMonth = date.substring(5,7)
        let day = date.substring(8,10)
        let month = months[tempMonth]

        return month + ' ' + day + ', ' + year
    }

    const checkboxUpdate = () => {
        // document.getElementById(props._id).checked = true;
        Axios.put(`${api}/updateTaskBool`,{
            email: props.email,
            completed: !checked,
            id: props._id
        }).then(()=> {
            let item = document.getElementById(props._id)
            if(!checked === false) {
                item.classList.remove("completed")
            } else {
                item.classList.add("completed")
            }
            setChecked(!checked)
        })
        // console.log(props._id)
    }



    return(<>
        <div className="taskItem" id={props._id}>
            <input type="checkbox" onChange={()=>checkboxUpdate()} checked={checked}/>
            <div className="taskText taskName">
                <h4>{props.taskname}</h4>
            </div>
            <div className="taskText taskDate">
                <h4>Due: {convertDate(new Date(props.date).toISOString().substring(0, 10))}</h4>
            </div>
            <button onClick={event => props.handleClick(props.taskname,new Date(props.date),props._id)} className="actionButton">
                <AiFillEdit size={'1.2em'}/>
                Edit
            </button>
            <button onClick={()=>props.delete(props._id)} className="actionButton">
                <AiFillDelete size={'1.2em'}/>
                Delete
            </button>
        </div>
    </>)
}