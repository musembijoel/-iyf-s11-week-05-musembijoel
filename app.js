const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const itemsLeft = document.getElementById("items-left");
const filters = document.querySelectorAll(".filter");
const clearCompletedBtn = document.getElementById("clear-completed");

let todos = [];
let currentFilter = "all";

function createTodoElement(todo) {
    const li = document.createElement("li");
    li.dataset.id = todo.id;
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.padding = "10px";
    li.style.borderBottom = "1px solid #eee";
    
    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text;
    span.style.cursor = "pointer";
    if (todo.completed) {
        span.style.textDecoration = "line-through";
        span.style.color = "#888";
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "❌";
    deleteBtn.style.border = "none";
    deleteBtn.style.background = "none";
    deleteBtn.style.cursor = "pointer";

    li.appendChild(span);
    li.appendChild(deleteBtn);
    return li;
}

function renderTodos() {
    todoList.innerHTML = "";
    
    const filteredTodos = todos.filter(todo => {
        if (currentFilter === "active") return !todo.completed;
        if (currentFilter === "completed") return todo.completed;
        return true;
    });

    filteredTodos.forEach(todo => {
        const todoElement = createTodoElement(todo);
        todoList.appendChild(todoElement);
    });

    updateStats();
}

function addTodo(text) {
    if (!text.trim()) return;
    
    const newTodo = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false
    };
    
    todos.push(newTodo);
    renderTodos();
}

function toggleTodo(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

function updateStats() {
    const incompleteCount = todos.filter(todo => !todo.completed).length;
    if (itemsLeft) {
        itemsLeft.textContent = `${incompleteCount} item${incompleteCount === 1 ? '' : 's'} left`;
    }
}

function filterTodos(filter) {
    currentFilter = filter;
    
    filters.forEach(btn => {
        const type = btn.dataset.filter || btn.textContent.toLowerCase().trim();
        if (type === filter) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    
    renderTodos();
}

form.addEventListener("submit", function(event) {
    event.preventDefault();
    addTodo(input.value);
    input.value = "";
});

todoList.addEventListener("click", function(event) {
    const target = event.target;
    const li = target.closest("li");
    if (!li) return;
    
    const todoId = li.dataset.id;

    if (target.classList.contains("delete-btn")) {
        deleteTodo(todoId);
    } else {
        toggleTodo(todoId);
    }
});

filters.forEach(button => {
    button.addEventListener("click", function() {
        const filterType = this.dataset.filter || this.textContent.toLowerCase().trim();
        filterTodos(filterType);
    });
});

if (clearCompletedBtn) {
    clearCompletedBtn.addEventListener("click", function() {
        todos = todos.filter(todo => !todo.completed);
        renderTodos();
    });
}

renderTodos();
