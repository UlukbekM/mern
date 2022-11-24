import React, {useState, useEffect} from "react";
import Axios from 'axios';

export const Task = (props) => {
    // console.log(props)
    const [checked, setChecked] = useState(props.completed)

    

    useEffect(() => {
        if(props.completed === true) {
            let item = document.getElementById(props._id)
            item.classList.add("completed")
        }
    }, [])

    const convertDate = (date) => {
        let year = date.substring(0,4)
        let tempMonth = date.substring(5,7)
        let day = date.substring(8,10)
        let month = ''

        if(tempMonth === "01") {
            month = 'January'
        } else if(tempMonth === "02") {
            month = 'February'
        } else if(tempMonth === "03") {
            month = 'March'
        } else if(tempMonth === "04") {
            month = 'April'
        } else if(tempMonth === "05") {
            month = 'May'
        } else if(tempMonth === "06") {
            month = 'June'
        } else if(tempMonth === "07") {
            month = 'July'
        } else if(tempMonth === "08") {
            month = 'August'
        } else if(tempMonth === "09") {
            month = 'September'
        } else if(tempMonth === "10") {
            month = 'October'
        } else if(tempMonth === "11") {
            month = 'November'
        } else if(tempMonth === "12") {
            month = 'December'
        }

        return month + ' ' + day + ', ' + year
    }

    const checkboxUpdate = () => {
        // document.getElementById(props._id).checked = true;
        Axios.put("http://localhost:3001/updateTaskBool",{
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
            <button onClick={event => props.handleClick(props.taskname,new Date(props.date),props._id)}>Edit</button>
            <button onClick={()=>props.delete(props._id)}>Delete</button>
        </div>
    </>)
}