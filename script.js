// Get the date
var date = new Date();
var currMonth = date.getMonth();
var currDate = date.getDate();
var currYear = date.getFullYear();

// Set month title
var months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
document.getElementById("title").innerText = months[currMonth];

// Constants for localStorage keys (unique per month and year)
const habitTitleKey = `habitTitle-${currMonth}-${currYear}`;
const completedDaysKey = `completedDays-${currMonth}-${currYear}`;

// Set and update habit title on click
var habitTitle = document.getElementById("habitTitle");

// Load saved habit title if exists
if (localStorage.getItem(habitTitleKey)) {
  habitTitle.innerText = localStorage.getItem(habitTitleKey);
} else {
  habitTitle.innerText = "Click to Set Your habit";
}

habitTitle.onclick = function () {
  let habits = prompt("What's your Habit", habitTitle.innerText);
  if (habits === null || habits.trim().length === 0) {
    habitTitle.innerText = "Click to Set Your habit";
    localStorage.removeItem(habitTitleKey); // remove from storage if cleared
  } else {
    habitTitle.innerText = habits;
    localStorage.setItem(habitTitleKey, habits); // save habit title
  }
};

// Set the total days for current month (consider leap year)
var dayInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// Leap year check for February
if (currMonth === 1 && ((currYear % 4 === 0 && currYear % 100 !== 0) || currYear % 400 === 0)) {
  dayInMonths[1] = 29;
}
var dayInThisMonth = dayInMonths[currMonth];

// Track completed days and total days element
var totalDays = document.getElementById("totalDays");

// Load completed days from localStorage or initialize empty array
var completedDays = JSON.parse(localStorage.getItem(completedDaysKey)) || [];

// Setup the calendar days
let dayCounter = 1;
const dayContainers = document.getElementsByClassName("days");

for (let i = 0; i < dayContainers.length; i++) {
  const days = dayContainers[i].getElementsByClassName("day");
  for (let j = 0; j < days.length; j++) {
    if (dayCounter <= dayInThisMonth) {
      days[j].innerText = dayCounter;
      days[j].classList.add("active-day");

      // If this day is in completedDays, add 'completed' class
      if (completedDays.includes(dayCounter)) {
        days[j].classList.add("completed");
      }

      // Add click event to toggle completion
      days[j].onclick = function () {
        const clickedDay = parseInt(this.innerText);
        this.classList.toggle("completed");

        // Update completedDays array
        if (this.classList.contains("completed")) {
          if (!completedDays.includes(clickedDay)) {
            completedDays.push(clickedDay);
          }
        } else {
          completedDays = completedDays.filter(day => day !== clickedDay);
        }

        // Save updated completedDays array in localStorage
        localStorage.setItem(completedDaysKey, JSON.stringify(completedDays));

        // Update the progress display
        updateProgress();
      };

      dayCounter++;
    } else {
      days[j].style.visibility = "hidden"; // Hide extra boxes for days not in this month
    }
  }
}

// Update progress display
function updateProgress() {
  // Update daysCompleted count from current completed days in DOM
  let daysCompleted = document.querySelectorAll(".day.completed").length;
  totalDays.innerText = `${daysCompleted}/${dayInThisMonth}`;
}

// Initialize progress display on page load
updateProgress();

// Reset button clears completed days and habit title in localStorage and UI
document.getElementById("reset").onclick = function () {
  // Remove completed class from all days
  const activeDays = document.querySelectorAll(".day.completed");
  activeDays.forEach(day => day.classList.remove("completed"));

  // Clear completed days array and localStorage
  completedDays = [];
  localStorage.removeItem(completedDaysKey);

  // Reset habit title UI and localStorage
  habitTitle.innerText = "Click to Set Your habit";
  localStorage.removeItem(habitTitleKey);

  // Update progress
  updateProgress();
};

