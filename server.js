const express = require('express');
const bodyParser = require('body-parser');  // to parse req and resp objects
const ejs = require('ejs')

const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.set('view engine','ejs')

app.use(express.static('public'))

// MONGO DB CODE
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
const Task = require('./model/task')

mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Database Connected Successfully!!");    
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

app.get('/', async (req, res) => {
    res.render('index');
});

// read tasks from database
app.get('/tasks', async (req, res) => {
    try {
        const task = await Task.find();
        res.status(200).json(task);
    } catch(error) {
        res.status(404).json({ error: 'Error reading tasks', message: error.message});
    }
});

// read a single task
app.get('/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id);

    try {
        const task = await Task.findById(taskId);
        res.status(200).json(task);
    } catch(error) {
        res.status(404).json({ error: 'Task not found', message: error.message});
    }

});

// create a new task in database
app.post('/tasks', async (req, res) => {
    const newTask = req.body;

    try {
        await Task.create({
            description: newTask.taskDesc,
            createdOn: newTask.createdOn,
            createdBy: newTask.createdBy,
            status: newTask.taskStatus,
            dueDate: newTask.taskDue,
            priority: newTask.taskPriority
        });

        console.log("Task added successfully");
        res.json({ message: 'Task created successfully', task: newTask });
    }
    catch(error) {
        console.log("Error creating data");
        console.log(error);
        res.status(500).send({ error: 'Error saving task' });
    }
});

// update task in database
app.put('/tasks/:index', async (req, res) => {

    try {
        const taskIndex = req.params.index;
        const updatedTask = req.body;
    
        await Task.findByIdAndUpdate(taskIndex, {
            description: updatedTask.taskDesc,
            status: updatedTask.taskStatus,
            dueDate: updatedTask.taskDue, 
            priority: updatedTask.taskPriority
        }, 
        {new: true});

        res.send({ message: "Task updated successfully." })
        
    }
    catch(error) {
        console.log(error)
        res.status(500).send({
            message: error.message
        });
    }    
});

// delete task from database
app.delete('/tasks/:index', async (req, res) => {

    try {
        const taskIndex = req.params.index;

        await Task.findByIdAndDelete(taskIndex);
        
        res.send({
            message: "Task deleted successfully!"
        });
    }
    catch(error) {
        console.log(error)
        res.status(500).send({
          message: error.message
        });
    }
});

// display not found page
app.use((req, res) => res.render('notfound'));