const start = document.getElementById("start");
const stop = document.getElementById("stop");
const reset = document.getElementById("reset");
const timer = document.getElementById("timer");

const taskInput = document.getElementById("task");
const taskLogElement = document.getElementById("task-log");

let timeLeft = 1500;  // 25 minutes in seconds
let interval = null;
let taskLog = [];
let startTime = null;
let taskDescription = "";

// Update the timer display
const updateTimer = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timer.innerHTML = `${minutes.toString().padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`;
};

// Start the timer
const startTimer = () => {
    if (interval === null) {  // Prevent multiple intervals from being set
        taskDescription = taskInput.value.trim();  // Correct task input retrieval
        if (!taskDescription) {
            alert("Please enter a task description.");
            return;
        }

        startTime = new Date();  // Record the start time
        interval = setInterval(() => {
            timeLeft--;
            updateTimer();

            if (timeLeft === 0) {
                stopTimer();
                logTask();
                alert("Time's up!");
                timeLeft = 1500;  // Reset to 25 minutes
                updateTimer();
            }
        }, 1000);
    }
};

// Stop the timer
const stopTimer = () => {
    if (interval !== null) {
        clearInterval(interval);
        interval = null;
        logTask();  // Log the task when the timer stops
    }
};

// Reset the timer
const resetTimer = () => {
    clearInterval(interval);
    interval = null;
    timeLeft = 1500;
    updateTimer();
};

// Log the task with start/end time and duration
const logTask = () => {
    const endTime = new Date();
    const duration = ((endTime - startTime) / 1000 / 60).toFixed(2);  // Calculate task duration in minutes

    const taskEntry = {
        task: taskDescription,
        startTime: startTime.toLocaleTimeString(),
        endTime: endTime.toLocaleTimeString(),
        duration: `${duration} minutes`
    };

    // Add task to the log
    taskLog.push(taskEntry);
    updateTaskLogUI(taskEntry);

    // Reset the task input
    taskInput.value = '';
};

// Update the UI to show the task log
const updateTaskLogUI = (taskEntry) => {
    const listItem = document.createElement("li");
    listItem.textContent = `Task: ${taskEntry.task}, Start: ${taskEntry.startTime}, End: ${taskEntry.endTime}, Duration: ${taskEntry.duration}`;
    taskLogElement.appendChild(listItem);
};

// Function to download the task log as an Excel file
const downloadTaskLog = () => {
    if (taskLog.length === 0) {
        alert("No tasks to export.");
        return;
    }
    // Convert taskLog to a format that SheetJS can use
    const worksheet = XLSX.utils.json_to_sheet(taskLog);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Task Log");
    // Download the Excel file
    XLSX.writeFile(workbook, "task_log.xlsx");
};

// Attach event listeners
start.addEventListener("click", startTimer);
stop.addEventListener("click", stopTimer);
reset.addEventListener("click", resetTimer);

// Create and append the export button
const exportButton = document.createElement("button");
exportButton.textContent = "Export Task Log";
exportButton.classList.add("export-button");
exportButton.addEventListener("click", downloadTaskLog);
document.querySelector(".container").appendChild(exportButton);




