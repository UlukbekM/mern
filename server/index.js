const express = require("express")
const app = express()
const UserModel = require("./models/Users")
require('dotenv').config()

const cors = require('cors')
app.use(express.json())
app.use(cors())

const mongoose = require("mongoose")
mongoose.connect(`mongodb+srv://ulu:${process.env.REACT_APP_MONGODB}@cluster0.exuzikf.mongodb.net/mernproject?retryWrites=true&w=majority`)

// mongoose.connect(`mongodb+srv://ulu:SgyOorRdsrllqwpT@cluster0.exuzikf.mongodb.net/mernproject?retryWrites=true&w=majority`)


app.get("/getUsers", (req, res) => {
    UserModel.find({}, (err, result) => {
        if(err) {
            res.json(err)
        } else {
            res.json(result)
        }
    })
})

app.get("/getByEmail", (req, res) => {
    try {
        UserModel.find({email: req.query.email}, (err, result) => {
            if(err) {
                res.json(err)
            } else {
                res.json(result)
            }
        })
    } catch {
        res.send({error: 'email not found!'})
    }
})

app.post("/createUser", async (req, res) => {
    const user = req.body;
    const newUser = new UserModel(user)
    await newUser.save()

    res.json(user)
})

app.put("/newTask", async (req,res) => {
    try {
        let doc = await UserModel.findOne({email: req.body.email})
        doc.tasks.push( {
            taskname: req.body.newTask,
            date: req.body.newDate,
            completed: false
        })
        doc.save()
        // console.log(doc.tasks)
    } catch (err) {
        console.log(err)
    }
    res.send("task created")
})

app.put("/update", async (req, res) => {
    try {
        let doc = await UserModel.findOne({email: req.body.email})
        let obj = doc.tasks.find(o => o._id == req.body.id)
        doc.tasks[doc.tasks.indexOf(obj)].taskname = req.body.newTask
        doc.tasks[doc.tasks.indexOf(obj)].date = req.body.newDate
        doc.save()
        // console.log(obj)
    } catch (err) {
        console.log(err)
    }
    res.send("updated")
})

app.put("/updateTaskBool", async (req, res) => {
    try {
        let doc = await UserModel.findOne({email: req.body.email})
        let obj = doc.tasks.find(o => o._id == req.body.id)
        doc.tasks[doc.tasks.indexOf(obj)].completed = req.body.completed
        doc.save()
    } catch (err) {
        console.log(err)
    }
    res.send("updated task boolean")
})

app.delete("/deleteTask/:email/:id", async (req, res) => {
    try {
        let doc = await UserModel.findOne({email: req.params.email})
        let obj = doc.tasks.find(o => o.id === req.params.id);
        doc.tasks.splice(doc.tasks.indexOf(obj),1)
        doc.save()
        // console.log(req.params.email, req.params.id)
    } catch (err) {
        console.log(err)
    }
    res.send('deleted')
})

app.listen(process.env.PORT || 3001, () => {
    console.log('server running')
})


console.log(process.env.PORT)