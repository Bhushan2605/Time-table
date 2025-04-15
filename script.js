document.addEventListener('DOMContentLoaded', function () {
    // Check if user is logged in
    const username = localStorage.getItem("loggedInUser");
    if (!username) {
        alert("Please login to access this page.");
        window.location.href = "login.html";
        return;
    }

    // Show user name (optional)
    const userNameElement = document.getElementById("user-name");
    if (userNameElement) {
        userNameElement.textContent = username;
    }

    // Load existing timetable
    loadTimetable();

    // Attach refresh button logic
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshTimetable);
    }
});

function addTimetableEntry() {
    const day = document.getElementById('day').value;
    const time = document.getElementById('time').value;
    const subject = document.getElementById('subject').value.trim();
    const teacher = document.getElementById('teacher').value.trim();

    if (subject === '' || teacher === '') {
        alert('Please enter both a subject and a teacher!');
        return;
    }

    let timetable = JSON.parse(localStorage.getItem('timetable')) || {};
    if (!timetable[day]) {
        timetable[day] = {};
    }

    timetable[day][time] = { subject, teacher };
    localStorage.setItem('timetable', JSON.stringify(timetable));
    loadTimetable();

    // Optional: clear inputs
    document.getElementById('subject').value = '';
    document.getElementById('teacher').value = '';
}

function loadTimetable() {
    const timetable = JSON.parse(localStorage.getItem('timetable')) || {};
    const timetableBody = document.getElementById('timetable-body');
    timetableBody.innerHTML = '';

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['9-10', '10-11', '11-12', '12-1', '1-2', '2-3', '3-4'];

    days.forEach(day => {
        let row = document.createElement('tr');
        let dayCell = document.createElement('td');
        dayCell.textContent = day;
        row.appendChild(dayCell);

        timeSlots.forEach(time => {
            let cell = document.createElement('td');
            if (timetable[day] && timetable[day][time]) {
                const entry = timetable[day][time];
                cell.innerHTML = `<strong>${entry.subject}</strong><br><small>${entry.teacher}</small>`;
            } else {
                cell.textContent = '-';
            }
            row.appendChild(cell);
        });
        timetableBody.appendChild(row);
    });
}

function refreshTimetable() {
    const confirmRefresh = confirm("Are you sure you want to refresh the timetable? This will clear all data.");
    if (confirmRefresh) {
        localStorage.removeItem('timetable');
        alert("Timetable has been refreshed!");
        loadTimetable();
    }
}

function logoutUser() {
    localStorage.removeItem("loggedInUser");
    alert("Logged out successfully!");
    window.location.href = "login.html";
}
