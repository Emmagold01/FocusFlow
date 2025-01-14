const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const clearBtn = document.getElementById('clear-tasks');
const footer = document.getElementById('footer');
const formBtn = taskForm.querySelector('button');
let isEditMode = false;

function displayTasks() {
  const tasksFromStorage = getTasksFromStorage();

  tasksFromStorage.forEach((task) => addTaskToDOM(task));

  checkUI();
}

function onAddTaskSubmit(e) {
  e.preventDefault();

  const newTask = taskInput.value.trim(); // Trim whitespace from input

  // Validate input
  if (newTask === '') {
    alert('Please Add Task');
    return;
  }

  // Check If task exists
  if (checkIfTaskExist(newTask)) {
    alert('Tasks Already Exists');
    return;
  }

  if (isEditMode) {
    const taskToEdit = taskList.querySelector('.edit-mode');

    // Update the task in the DOM
    removeTaskFromStorage(taskToEdit.textContent);
    taskToEdit.textContent = newTask;
    taskToEdit.classList.remove('edit-mode');

    // Add updated task to storage
    addTaskToStorage(newTask);

    isEditMode = false; // Exit edit mode
  } else {
    // Add new task
    addTaskToDOM(newTask);
    addTaskToStorage(newTask);
  }

  checkUI(); // Reset UI
  taskInput.value = ''; // Clear input field
}

function addTaskToDOM(task) {
  //   create li item and appended child to the parent element
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(task));

  const button = createButton('remove-task btn-link icon-color');
  li.appendChild(button);

  //   appended list too the tasklist parent
  taskList.appendChild(li);
}

function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;

  const icon = createIcon('fa-solid fa-check');
  button.appendChild(icon);
  return button;
}

function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function addTaskToStorage(task) {
  const tasksFromStorage = getTasksFromStorage();

  //   add new tasks to array
  tasksFromStorage.push(task);

  //   Convert jSON to string and set it to local storage
  localStorage.setItem('tasks', JSON.stringify(tasksFromStorage));
}

function getTasksFromStorage(task) {
  let tasksFromStorage;

  if (localStorage.getItem('tasks') === null) {
    tasksFromStorage = [];
  } else {
    tasksFromStorage = JSON.parse(localStorage.getItem('tasks'));
  }

  return tasksFromStorage;
}

function clearTasks() {
  if (confirm('🎉 Congratulations! All tasks cleared.')) {
    taskList.innerHTML = '';

    // localStorage.removeItem('tasks');
    localStorage.clear();
  }

  checkUI();
}

function onClickTask(e) {
  if (e.target.parentElement.classList.contains('remove-task')) {
    // Prevent triggering "Edit Mode" when removing a task
    e.stopPropagation();
    removeTask(e.target.parentElement.parentElement);
  } else {
    taskToEdit(e.target);
  }
}
function taskToEdit(task) {
  // Ensure the clicked element is not a button
  if (task.tagName !== 'LI') return;

  isEditMode = true;

  taskList
    .querySelectorAll('li')
    .forEach((t) => t.classList.remove('edit-mode'));

  task.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>   Update Task';
  formBtn.style.background = '#228B22';
  taskInput.value = task.textContent;
}

function removeTask(task) {
  if (confirm('Are You Sure ?')) {
    // remove task from dom
    task.remove();

    // remove task from local storage
    removeTaskFromStorage(task.textContent);

    // Ensure we're not in edit mode after removing a task
    isEditMode = false;

    checkUI();
  }
}

function checkIfTaskExist(task) {
  const tasksFromStorage = getTasksFromStorage();
  return tasksFromStorage.includes(task);
}

function removeTaskFromStorage(taskText) {
  let tasksFromStorage = getTasksFromStorage();

  //   Filter out task to be removed
  tasksFromStorage = tasksFromStorage.filter(
    (task) => task.trim() !== taskText.trim()
  );

  //   reset to local storage
  localStorage.setItem('tasks', JSON.stringify(tasksFromStorage));
}

function checkUI() {
  taskInput.value = '';

  const tasks = document.querySelectorAll('li');
  if (tasks.length === 0) {
    clearBtn.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
  }

  // Reset form button to "Add Task" if not in edit mode
  if (!isEditMode) {
    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i>   Add Task';
    formBtn.style.background = '#333';
  }
}

function init() {
  taskForm.addEventListener('submit', onAddTaskSubmit);
  clearBtn.addEventListener('click', clearTasks);
  taskList.addEventListener('click', onClickTask);
  document.addEventListener('DOMContentLoaded', displayTasks);

  checkUI();
}

init();
