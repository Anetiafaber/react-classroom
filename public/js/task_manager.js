$(document).ready( () => {
    loadTasks();
    $("#addTask").click(addTask);
    $("#deleteTask").click(deleteTask);
    $("#searchBox").on('change keyup paste', searchTask);

    // Due date restricted to today and future dates
    let today = formatDate(new Date());
    $("#taskDue").attr("min", today);
});

const addTask = () => {
    // Get user input values
    const taskDesc = $("#taskDesc").val();
    const createdOn = new Date();
    const createdBy = "Anetia Faber";
    const taskStatus = "Open";
    const taskDue = $("#taskDue").val();
    const taskPriority = $("#taskPriority").val();

    // Validating mandatory field
    if(taskDesc === "") {
        alert("Task Description is required.");
        return;
    }

    // Store task in task list
    const task = { 
        taskDesc,
        createdOn,
        createdBy,
        taskStatus,
        taskDue, 
        taskPriority
    };

    $.ajax({
        url: '/tasks',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(task),
        success: function(response) {

            // load all tasks after adding new
            loadTasks();

            // Clear input fields
            $("#taskDesc").val("");
            $("#taskDue").val("");
            $("#taskPriority").val("High");
        },
        error: function(xhr, status, error) {
            console.error("Error fetching tasks:", status, error);
        }
    });
}

const editTask = async index => {
    try {
        // get all tasks from json file - server
        const tasks = await getTasks();

        // Add a field to update status
        $("#statusInput").css("display", "flex");

        // Toggle display between add task and edit task button
        $("#addBtnBox").addClass("hide");
        $("#editBtnBox").removeClass("hide");

        // Populate the input fields with values of updating task
        const selectedTask = tasks[index];
        $("#taskDesc").val(selectedTask.description);
        $("#taskStatus").val(selectedTask.status);

        let dueDate = formatDate(new Date(selectedTask.dueDate));
        $("#taskDue").val(dueDate);
        $("#taskPriority").val(selectedTask.priority);
        
        // Attach click event to edit task button
        $("#editTask").click(() => updateTask(selectedTask._id));

        // Set focus to input fields
        $("#taskDesc").focus();
    } 
    catch (error) {
        console.error("Failed to load tasks:", error);
    }
}

const updateTask = (index) => {

    // Get values from input field
    const taskDesc = $("#taskDesc").val();
    const taskStatus = $("#taskStatus").val();
    const taskDue = $("#taskDue").val();
    const taskPriority = $("#taskPriority").val();

    // Validating mandatory fields
    if(taskDesc === "") {
        alert("Task Description is required.");
        return;
    }

    // Update task in list
    const task = { 
        taskDesc,
        taskStatus,
        taskDue,
        taskPriority
    };

    $.ajax({
        url: '/tasks/' + index,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(task),
        success: function(response) {

            // read all tasks after updating
            loadTasks();

            // Remove a field to update status
            $("#statusInput").css("display", "none");

            // Toggle display between add task and edit task button
            $("#editBtnBox").addClass("hide");
            $("#addBtnBox").removeClass("hide");

            // Remove click event from edit task button
            $("#editTask").off("click");

            // Clear input fields
            $("#taskDesc").val("");
            $("#taskStatus").val("");
            $("#taskDue").val("");
            $("#taskPriority").val("High");
        },
        error: function(xhr, status, error) {
            console.error("Error updating task:", status, error);
        }
    });
}

const deleteTask = index => {
    
    $.ajax({
        url: '/tasks/' + index,
        type: 'DELETE',
        success: function(response) {
            // read all tasks after deletion
            loadTasks();
        },
        error: function(xhr, status, error) {
            console.error("Error deleting task:", status, error);
        }
    });
}

const loadTasks = async() => {
    try {
        const tasks = await getTasks();

        // Remove existing rows (tasks) from table (task list)
        const container = $("#tasksList tbody");
        $("#tasksList tbody tr").remove();
        
        let innerHTML = '';
        let priorityClass = "";

        // Add a row for each task into the table
        tasks.forEach((task, index) => {
            task.createdOn = new Date(task.createdOn).toDateString();
            task.dueDate = new Date(task.dueDate).toDateString();
            let taskId = task._id.toString();

            // Set color to priority cell, based on the priority level
            switch(task.priority) {
                case 'High' :
                    priorityClass = "bg-danger";
                    break;
                case 'Medium' :
                    priorityClass = "bg-warning";
                    break;
                case 'Low' :
                    priorityClass = "bg-success";
                    break;
                default: 
                    break;
            }

            innerHTML = `
                <tr class="fw-normal">
                    <td class="align-middle" style="display: none;">
                        <span>${task._id}</span>
                    </td>
                    <td class="align-middle">
                        <span>${task.description}</span>
                    </td>
                    <td class="align-middle">
                        <span>${task.createdOn}</span>
                    </td>
                    <td class="align-middle">
                        <h6 class="mb-0">${task.createdBy}</h6>
                    </td>
                    <td class="align-middle">
                        <h6 class="mb-0">${task.status}</h6>
                    </td>
                    <td class="align-middle">
                        <h6 class="mb-0">${task.dueDate}</h6>
                    </td>
                    <td class="align-middle">
                        <h6 class="mb-0"><span class="badge ${priorityClass}">${task.priority} priority</span></h6>
                    </td>
                    <td class="align-middle">
                        <button onClick="editTask(${index})" class="edit-task-btn"><i class="fas fa-edit fa-lg me-3"></i></button>
                        <button onClick="deleteTask('${taskId}')" class="delete-task-btn"><i class="fas fa-trash-alt fa-lg text-warning"></i></button>
                    </td>
                </tr>`;

            container.append(innerHTML);
        });
    } catch (error) {
        console.error("Failed to load tasks:", error);
    }
}

const getTasks = () => {
    // get tasks from json file - server side
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/tasks',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                resolve(response);
            },
            error: function(xhr, status, error) {
                console.error("Error fetching tasks:", status, error);
                reject(error);
            }
        });
    });
}

const searchTask = async () => {
    const searchVal = $("#searchBox").val().toLowerCase();
    const tasks = await getTasks();

    // Filter task list array based on searched value
    // Returns task if any of the task attributes includes the searched value
    const filteredTasks = tasks.filter(task =>
        task.description.toLowerCase().includes(searchVal) ||
        task.createdOn.toLowerCase().includes(searchVal) ||
        task.createdBy.toLowerCase().includes(searchVal) ||
        task.status.toLowerCase().includes(searchVal) ||
        task.dueDate.toLowerCase().includes(searchVal) ||
        task.priority.toLowerCase().includes(searchVal)
    );
    displayFilteredList(filteredTasks);
}

const displayFilteredList = taskList => {
    // Remove the existing rows(task) from table (task list)
    const container = $("#tasksList tbody");
    $("#tasksList tbody tr").remove();

    let priorityClass = "";
    let innerHTML = ``;

    // Add a row for each task into the table
    taskList.forEach((task, index) => {

        task.createdOn = new Date(task.createdOn).toDateString();
        task.dueDate = new Date(task.dueDate).toDateString();
        let taskId = task._id.toString();

        // Set color to priority cell, based on the priority level
        switch(task.priority) {
            case 'High' :
                priorityClass = "bg-danger";
                break;
            case 'Medium' :
                priorityClass = "bg-warning";
                break;
            case 'Low' :
                priorityClass = "bg-success";
                break;
            default: 
                break;
        }

        innerHTML = `
            <tr class="fw-normal">
                <td class="align-middle" style="display: none;">
                    <span>${task._id}</span>
                </td>
                <td class="align-middle">
                    <span>${task.description}</span>
                </td>
                <td class="align-middle">
                    <span>${task.createdOn}</span>
                </td>
                <td class="align-middle">
                    <h6 class="mb-0">${task.createdBy}</h6>
                </td>
                <td class="align-middle">
                    <h6 class="mb-0">${task.status}</h6>
                </td>
                <td class="align-middle">
                    <h6 class="mb-0">${task.dueDate}</h6>
                </td>
                <td class="align-middle">
                    <h6 class="mb-0"><span class="badge ${priorityClass}">${task.priority} priority</span></h6>
                </td>
                <td class="align-middle">
                    <button onClick="editTask(${task.taskId - 1})" class="edit-task-btn"><i class="fas fa-edit fa-lg me-3"></i></button>
                    <button onClick="deleteTask('${taskId}')" class="delete-task-btn"><i class="fas fa-trash-alt fa-lg text-warning"></i></button>
                </td>
            </tr>`;

        container.append(innerHTML);
    });
}

const formatDate = inputDate => {
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const day = String(inputDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}