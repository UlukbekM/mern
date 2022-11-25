import React, {useEffect, useState} from "react";
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { BsXLg } from "react-icons/bs";
import Modal from 'react-modal';
import DatePicker from 'react-date-picker';
import Axios from 'axios';
import { Task } from "./Tasks";
import { Header } from './Header'

//https://www.npmjs.com/package/@react-oauth/google
//https://www.npmjs.com/package/jwt-decode
//https://www.npmjs.com/package/react-date-picker

Modal.setAppElement('#root');

export const Home = () => {
    const [credentials, setCredentials] = useState([])
    const [modalIsOpen, setIsOpen] = useState(false);
    const [date, setDate] = useState(new Date());
    const [taskName, setTaskName] = useState("");
    const [tasks, setTasks] = useState([])
    const [updatingItem, setUpdatingItem] = useState(false)
    const [userExists, setUserExists] = useState(false)
    const [id,setId] = useState("")

    const [oldTask, setOldTask] = useState("")

    function tempFunction() {
        console.log(taskName);
        console.log(date);
    }
    
    function openModal() {
        setIsOpen(true);
    }

    const openModalEdit = (editTask,editDate,id) => {
        setTaskName(editTask)
        setDate(editDate)
        setUpdatingItem(true)
        setIsOpen(true)
        setOldTask(editTask)
        setId(id)
    }

    function closeModal() {
        setIsOpen(false);
        setTaskName("")
        setDate(new Date())
        setUpdatingItem(false)
        setOldTask("")
        setId("")
    }

    const decodeJWT = () => {
        let cred = window.sessionStorage.getItem("credential");
        if(cred !== null) {
            var decoded = jwt_decode(cred);
            setCredentials(decoded)
            // console.log(decoded);
        }
    }

    useEffect(() => {
        decodeJWT()
        closeModal()
    }, [])

    const logout = () => {
        sessionStorage.removeItem('credential');
        window.location.reload();
    }

    useEffect(()=> {
        getTasks()
    },[credentials.email])

    const getTasks = () => {
        if(credentials.email) {
            // console.log(`${window.location.origin}`)
            Axios.get(`http://localhost:3001/getByEmail`,{ 
                params: { email: credentials.email } })
                .then((response) => {
                // if(response.data.length > 0) {
                //     setUserExists(true)
                // }
                if(response.data.length !== 0) {
                    setUserExists(true)
                    // let array = response.data[0].tasks
                    // console.log(array)
                    // const sortedActivities = array.sort((a, b) => b.date - a.date)
                    // console.log(sortedActivities)
                    setTasks(response.data[0].tasks)
                }
            })
        }
    }

    const submitForm = () => {
        let tempDate = date.setHours(0,0,0,0)
        if(taskName !== "") {
            if(updatingItem) {
                Axios.put(`http://localhost:3001/update`, { 
                    email: credentials.email,
                    oldTask: oldTask,
                    newTask: taskName,
                    newDate: date,
                    id: id
                })
                .then(()=> {
                    getTasks()
                })
            } else {
                if(userExists) {
                    Axios.put(`http://localhost:3001/newTask`,{
                        email: credentials.email,
                        newTask: taskName,
                        newDate: tempDate
                    }).then(()=> {
                        getTasks()
                    })
                } else {
                    Axios.post(`http://localhost:3001/createUser`, {
                        email: credentials.email,
                        tasks: [{
                            taskname: taskName,
                            date: date,
                            completed: false
                        }]
                    }).then(()=> {
                        getTasks()
                    })
                }
            }
        }
        closeModal()
    }

    const deleteTask = (id) => {
        Axios.delete(`http://localhost:3001/deleteTask/${credentials.email}/${id}`,{
                        email: credentials.email,
                        id: id
                    }).then(()=> {
                        const temp = tasks.filter(item => item._id !== id)
                        setTasks(temp)
                    })
    }

    return(<>
        <Header status={credentials}/>
        {credentials.email ?<>
            <Modal
                className={"ReactModal__Content"}
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={{ overlay: {backgroundColor: 'transparent'} }}
                >
                <div className="modalContainer">
                    <div className="taskTop">
                        <div className="homeTopButton"></div>
                        <div className="homeTopTitle">
                            <h2>Add Task</h2>
                        </div>
                        <div className="homeTopButton">
                            <BsXLg className="taskButton" onClick={closeModal}/>
                        </div>
                    </div>
                    <form>
                    <div>
                        <h3>Task name</h3>
                            <input className="taskInput" value={taskName} onChange={e => setTaskName(e.target.value)}/>
                    </div>
                    <div>
                        <DatePicker onChange={setDate} value={date} />
                    </div>
                    <button onClick={()=>submitForm()} type="button">Submit</button>
                    </form>
                </div>
            </Modal>

            <div className="homeContainer">
                <div className="homeTop">
                    <div className="homeTopButton">
                        {/* <BsFillPlusCircleFill size={25} className="taskButton" onClick={()=>openModal()}/> */}
                    </div>
                    <div className="homeTopTitle">
                        <h1>Tasks</h1>
                    </div>
                    <div className="homeTopButton">
                        <BsFillPlusCircleFill size={25} className="taskButton" onClick={()=>openModal()}/>
                    </div>
                </div>
                <div className="taskContainer">
                    {tasks.length > 0 &&
                        tasks.map((task,index) => (
                            // <Task key={index} {...task} onClick={()=>openModalEdit}/>
                            <Task key={index} {...task} handleClick={openModalEdit} delete={deleteTask} email={credentials.email}/>
                    ))}
                </div>
                {/* <button onClick={()=>logout()} className="logInOutButton">Logout</button> */}
            </div>
        </>:
            <div className="loginContainer">
                <h1>Please login</h1>
                <div className="logInOutButton">
                    <GoogleLogin
                    onSuccess={credentialResponse => {
                        // console.log(credentialResponse)
                        window.sessionStorage.setItem("credential", credentialResponse.credential);
                        decodeJWT()
                    }}
                    onError={() => {
                        console.log('Login Failed')
                    }}
                    />
                </div>
            </div>
        }
    </>)
}