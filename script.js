document.addEventListener('DOMContentLoaded', () => {
    const addTaskButton = document.getElementById('add-task');

    addTaskButton.addEventListener('click', () => {
        // Verificar se o formulário já existe para evitar duplicação
        if (document.getElementById('form-task')) {
            return;
        }

        const formTask = document.createElement('div');
        formTask.setAttribute('id', 'form-task');

        const inputTask = document.createElement('input');
        inputTask.setAttribute('type', 'text');
        inputTask.setAttribute('id', 'task-input'); // Adiciona um ID para facilitar a seleção

        const sendTaskButton = document.createElement('button');
        sendTaskButton.textContent = 'Send';

        // Adiciona o evento de clique ao botão "Enviar"
        sendTaskButton.addEventListener('click', sendTask);

        // Adiciona o evento de tecla "Enter" ao input
        inputTask.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                sendTask();
            }
        });

        formTask.appendChild(inputTask);
        formTask.appendChild(sendTaskButton);

        document.body.appendChild(formTask);

        // Focar o input automaticamente
        inputTask.focus();
    });

    function sendTask() {
        const inputTask = document.getElementById('task-input');
        const textTask = inputTask.value.trim();

        if (textTask !== '') {
            const newTask = document.createElement('li');
            newTask.classList.add('task');
            newTask.innerHTML = `<span class="task-content">${textTask}</span> <div class='delete-btn'></div>`;
            newTask.setAttribute('draggable', 'true');

            const deleteBtn = newTask.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                newTask.remove();
            });

            newTask.addEventListener('dragstart', () => {
                newTask.classList.add('dragging');
            });

            newTask.addEventListener('dragend', () => {
                newTask.classList.remove('dragging');
            });

            const todoList = document.getElementById('todo-list');
            todoList.appendChild(newTask);

            inputTask.value = ""; // Corrige o valor do input

            // Limpa e remove o formTask após adicionar a tarefa
            const formTask = document.getElementById('form-task');
            if (formTask) {
                formTask.remove();
            }

            // Atualiza os elementos arrastáveis
            updateDraggables();
        }
    }

    // Função para atualizar os elementos arrastáveis
    function updateDraggables() {
        const draggables = document.querySelectorAll('.task');

        draggables.forEach((task) => {
            task.addEventListener('dragstart', () => {
                task.classList.add('dragging');
            });

            task.addEventListener('dragend', () => {
                task.classList.remove('dragging');
            });
        });
    }

    // Drag
    const droppables = document.querySelectorAll('.column');

    droppables.forEach((zone) => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();

            const bottTask = insertAboveTask(zone, e.clientY);
            const curTask = document.querySelector('.dragging');
            // Condições para dragg entre as tasks
            if (curTask) {
                if (!bottTask) {
                    zone.appendChild(curTask);
                } else {
                    zone.insertBefore(curTask, bottTask);
                }
            }
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

