// ======= User Schedules: Edit as needed ========
const SCHEDULES = {
  valerie: [
    { time: "8:30AM - 9AM", task: "Breakfast" },
    { time: "9AM - 9:45AM", task: "Beast Academy" },
    { time: "9:45AM - 10AM", task: "Break" },
    { time: "10AM - 10:30AM", task: "Train the Brain Questions" },
    { time: "10:30AM - 11AM", task: "Chinese HW" },
    { time: "11AM - 11:30AM", task: "Chinese Reading Comprehension" },
    { time: "11:30AM - 12PM", task: "English Reading Comprehension" },
    { time: "12PM - 12:45PM", task: "Lunch" },
    { time: "12:45PM - 1:45PM", task: "Presentation Preparation" },
    { time: "1:45PM - 2PM", task: "Break" },
    { time: "2PM - 3PM", task: "Piano" },
    { time: "3PM - 3:15PM", task: "Break" },
    { time: "3:15PM - 4PM", task: "Spanish" },
    { time: "4PM - 4:30PM", task: "Piano" },
    { time: "4:30PM - 5PM", task: "Make up work" }
  ],
  olivia: [
    { time: "8:30AM - 9AM", task: "Breakfast" },
    { time: "9AM - 9:30AM", task: "Reading" },
    { time: "9:30AM - 10AM", task: "Math Practice" },
    { time: "10AM - 10:30AM", task: "Creative Writing" },
    { time: "10:30AM - 11AM", task: "Break" },
    { time: "11AM - 11:45AM", task: "Chinese HW" },
    { time: "11:45AM - 12:15PM", task: "Science Exploration" },
    { time: "12:15PM - 12:45PM", task: "Lunch" },
    { time: "12:45PM - 1:30PM", task: "Art Project" },
    { time: "1:30PM - 2PM", task: "Break" },
    { time: "2PM - 2:30PM", task: "English Practice" },
    { time: "2:30PM - 3PM", task: "Piano" },
    { time: "3PM - 3:15PM", task: "Snack/Break" },
    { time: "3:15PM - 4PM", task: "Outdoor Play" },
    { time: "4PM - 4:30PM", task: "Board Games" }
  ]
};

const USERS = Object.keys(SCHEDULES);

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
