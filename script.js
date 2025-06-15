let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(filter = 'all', searchTerm = '') {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks
    .filter(task => {
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    })
    .filter(task => task.text.toLowerCase().includes(searchTerm.toLowerCase()))
    .forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `list-group-item d-flex justify-content-between align-items-center ${task.completed ? 'task-completed' : ''}`;

        li.innerHTML = `
        <div class="d-flex align-items-center gap-2 flex-grow-1">
            <input type="checkbox" onchange="toggleComplete(${index})" ${task.completed ? 'checked' : ''}>
            <span ondblclick="editTask(${index}, this)" class="flex-grow-1">${task.text}</span>
        </div>
        <button class="btn btn-sm btn-danger" onclick="deleteTask(${index})">Delete</button>
        `;

        taskList.appendChild(li);
    });
}

function addTask(){
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();
    if (!taskText) return;

    tasks.push({ text: taskText, completed: false});
    input.value = '';
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function clearCompleted() {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
    renderTasks();
}

function filterTasks(type){
    renderTasks(type);
}

function searchTasks(query) {
    renderTasks('all', query);
}

function editTask(index, span) {
    const currentText = tasks[index].text;
    const input = document.createElement('input');
    input.className = 'edit-input';
    input.value = currentText;
    span.replaceWith(input);
    input.focus();

    input.addEventListener('blur', () => {
        tasks[index].text = input.value.trim() || currentText;
        saveTasks();
        renderTasks();
    });

    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') input.blur();
    });
}

renderTasks();