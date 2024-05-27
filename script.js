document.addEventListener('DOMContentLoaded', () => {
    console.log('Document loaded'); 

    const addTaskButton = document.getElementById('add-task');
    console.log('Add Task Button:', addTaskButton); 

    
    loadTasks();

    addTaskButton.addEventListener('click', () => {
        console.log('Add Task button clicked'); 
        if (document.getElementById('form-task')) {
            return;
        }

        const formTask = document.createElement('div');
        formTask.setAttribute('id', 'form-task');

        const inputTask = document.createElement('input');
        inputTask.setAttribute('type', 'text');
        inputTask.setAttribute('id', 'task-input');

        const sendTaskButton = document.createElement('button');
        sendTaskButton.textContent = 'Send';

        sendTaskButton.addEventListener('click', sendTask);

        inputTask.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                sendTask();
            }
        });

        formTask.appendChild(inputTask);
        formTask.appendChild(sendTaskButton);

        document.body.appendChild(formTask);

        inputTask.focus();
    });

    function sendTask() {
        console.log('Send Task function called'); 

        const inputTask = document.getElementById('task-input');
        const textTask = inputTask.value.trim();

        if (textTask !== '') {
            const newTask = createTaskElement(textTask);

            const todoList = document.getElementById('todo-list');
            todoList.appendChild(newTask);

            inputTask.value = "";

            const formTask = document.getElementById('form-task');
            if (formTask) {
                formTask.remove();
            }

            updateDraggables();
            saveTasks();
        }
    }

    function createTaskElement(textTask) {
        console.log('Creating task element:', textTask); // Debugging

        const newTask = document.createElement('li');
        newTask.classList.add('task');
        newTask.innerHTML = `<span class="task-content">${textTask}</span> <div class='delete-btn'></div>`;
        newTask.setAttribute('draggable', 'true');

        const deleteBtn = newTask.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            newTask.remove();
            saveTasks();
        });

        newTask.addEventListener('dragstart', () => {
            newTask.classList.add('dragging');
        });

        newTask.addEventListener('dragend', () => {
            newTask.classList.remove('dragging');
            saveTasks();
        });

        return newTask;
    }

    function saveTasks() {
        console.log('Saving tasks to localStorage'); 
        const lists = document.querySelectorAll('.column ul');
        const tasks = {};

        lists.forEach(list => {
            const taskList = [];
            list.querySelectorAll('.task .task-content').forEach(task => {
                taskList.push(task.textContent);
            });
            tasks[list.id] = taskList;
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        console.log('Loading tasks from localStorage');

        const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
        console.log('Tasks loaded:', tasks); 

        for (const listId in tasks) {
            if (Array.isArray(tasks[listId])) {
                const todoList = document.getElementById(listId);
                tasks[listId].forEach(task => {
                    const newTask = createTaskElement(task);
                    todoList.appendChild(newTask);
                });
            } else {
                console.error(`Expected an array but got ${typeof tasks[listId]} for listId: ${listId}`);
            }
        }
        updateDraggables();
    }

    function updateDraggables() {
        console.log('Updating draggables'); 

        const draggables = document.querySelectorAll('.task');

        draggables.forEach((task) => {
            task.addEventListener('dragstart', () => {
                task.classList.add('dragging');
            });

            task.addEventListener('dragend', () => {
                task.classList.remove('dragging');
                saveTasks();
            });
        });
    }

    const droppables = document.querySelectorAll('.column');

    droppables.forEach((zone) => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();

            const bottTask = insertAboveTask(zone, e.clientY);
            const curTask = document.querySelector('.dragging');
            if (curTask) {
                if (!bottTask) {
                    zone.querySelector('ul').appendChild(curTask);
                } else {
                    zone.querySelector('ul').insertBefore(curTask, bottTask);
                }
            }
        });

        zone.addEventListener('dragend', () => {
            saveTasks();
        });
    });

    const insertAboveTask = (zone, mouseY) => {
        const els = zone.querySelectorAll("li:not(.dragging)");

        let closestTask = null;
        let closestOffset = Number.NEGATIVE_INFINITY;

        els.forEach((task) => {
            const { top } = task.getBoundingClientRect();

            const offset = mouseY - top;

            if (offset < 0 && offset > closestOffset) {
                closestOffset = offset;
                closestTask = task;
            }
        });

        return closestTask;
    }
});
