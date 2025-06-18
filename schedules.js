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
    { time: "7:30AM - 8AM", task: "Breakfast" },
    { time: "8AM - 10:00AM", task: "Geometry" },
    { time: "10AM - 10:15AM", task: "Break" },
    { time: "10:15AM - 11:15AM", task: "Piano" },
    { time: "11:15AM - 12AM", task: "Presentation Preparation and Daily Chinese Review" },
    { time: "12PM - 12:45PM", task: "Lunch" },
    { time: "12:45PM - 1:45PM", task: "Piano" },
    { time: "1:45PM - 2PM", task: "Break" },
    { time: "2PM - 2:30PM", task: "Read" },
    { time: "2:30PM - 3:30PM", task: "Geometry HW" },
    { time: "3:30PM - 4PM", task: "Passion Project/AI" },
    { time: "4PM - 4:30PM", task: "Exercise" },
    { time: "4:30PM - 5PM", task: "Flue" },
    { time: "5PM - 5:45PM", task: "Debate" }
  ]
};

const USERS = Object.keys(SCHEDULES);

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
