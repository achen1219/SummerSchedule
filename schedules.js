// ======= User Schedules: Edit as needed ========
const SCHEDULES = {
  Valerie: [
    "8:30AM - 9AM: Breakfast",
    "9AM - 9:45AM: Beast Academy",
    "9:45AM - 10AM: Break",
    "10AM - 10:30AM: Train the Brain Questions",
    "10:30AM - 11AM: Chinese HW",
    "11AM - 11:30AM: Chinese Reading Comprehension",
    "11:30AM - 12PM: English Reading Comprehension",
    "12PM - 12:45PM: Lunch",
    "12:45PM - 1:45PM: Presentation Preparation",
    "1:45PM - 2PM: Break",
    "2PM - 3PM: Piano",
    "3PM - 3:15PM: Break",
    "3:15PM - 4PM: Spanish",
    "4PM - 4:30PM: Piano",
    "4:30PM - 5PM: Make up work"
  ],
  Olivia: [
    "8:30AM - 9AM: Breakfast",
    "9AM - 9:30AM: Reading",
    "9:30AM - 10AM: Math Practice",
    "10AM - 10:30AM: Creative Writing",
    "10:30AM - 11AM: Break",
    "11AM - 11:45AM: Chinese HW",
    "11:45AM - 12:15PM: Science Exploration",
    "12:15PM - 12:45PM: Lunch",
    "12:45PM - 1:30PM: Art Project",
    "1:30PM - 2PM: Break",
    "2PM - 2:30PM: English Practice",
    "2:30PM - 3PM: Piano",
    "3PM - 3:15PM: Snack/Break",
    "3:15PM - 4PM: Outdoor Play",
    "4PM - 4:30PM: Board Games"
  ]
};

const USERS = Object.keys(SCHEDULES);

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
