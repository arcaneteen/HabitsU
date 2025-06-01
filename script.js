let currentDate = new Date();
let todos = JSON.parse(localStorage.getItem('todos')) || {};
let diaryEntries = JSON.parse(localStorage.getItem('diaryEntries')) || [];

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    const monthYear = document.getElementById('monthYear');
    calendar.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    monthYear.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'header';
        dayHeader.textContent = day;
        calendar.appendChild(dayHeader);
    });

    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        calendar.appendChild(emptyDay);
    }

    for (let i = 1; i <= lastDate; i++) {
        const day = document.createElement('div');
        day.className = 'day';
        day.textContent = i;

        const dateStr = `${year}-${month + 1}-${i}`;
        const todayTodos = todos[dateStr] || [];
        const completedTodos = todayTodos.filter(todo => todo.completed).length;
        if (completedTodos >= 2) {
            day.classList.add('completed');
        }

        const today = new Date();
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            day.classList.add('today');
        }

        calendar.appendChild(day);
    }
}

function addTodo() {
    const todoInput = document.getElementById('todoInput');
    const todoText = todoInput.value.trim();
    if (todoText) {
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        if (!todos[dateStr]) {
            todos[dateStr] = [];
        }
        todos[dateStr].push({ text: todoText, completed: false });
        localStorage.setItem('todos', JSON.stringify(todos));
        todoInput.value = '';
        renderTodos();
        renderCalendar();
    }
}

function toggleTodo(dateStr, index) {
    if (todos[dateStr] && todos[dateStr][index]) {
        todos[dateStr][index].completed = !todos[dateStr][index].completed;
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
        renderCalendar();
    }
}

function deleteTodo(dateStr, index) {
    if (todos[dateStr]) {
        todos[dateStr].splice(index, 1);
        if (todos[dateStr].length === 0) {
            delete todos[dateStr];
        }
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
        renderCalendar();
    }
}

function renderTodos() {
    const todoItems = document.getElementById('todoItems');
    todoItems.innerHTML = '';
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const todayTodos = todos[dateStr] || [];

    todayTodos.forEach((todo, index) => {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.onclick = () => toggleTodo(dateStr, index);
        const span = document.createElement('span');
        span.textContent = todo.text;
        if (todo.completed) {
            span.style.textDecoration = 'line-through';
        }
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTodo(dateStr, index);
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteButton);
        todoItems.appendChild(li);
    });
}

function addDiaryEntry() {
    const diaryInput = document.getElementById('diaryInput');
    const entry = diaryInput.value.trim();
    if (entry) {
        diaryEntries.push({ text: entry, date: new Date().toLocaleDateString() });
        localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
        diaryInput.value = '';
        renderDiary();
    }
}

function renderDiary() {
    const diaryEntriesList = document.getElementById('diaryEntries');
    diaryEntriesList.innerHTML = '';
    diaryEntries.forEach((entry, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${entry.date}: ${entry.text} <button onclick="deleteDiaryEntry(${index})">Delete</button>`;
        diaryEntriesList.appendChild(li);
    });
}

function deleteDiaryEntry(index) {
    diaryEntries.splice(index, 1);
    localStorage.setItem('diaryEntries', JSON.stringify(diaryEntries));
    renderDiary();
}

function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

// Initial render
renderCalendar();
renderTodos();
renderDiary();