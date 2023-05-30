"use strict";
import { fetchStudents } from './fetching.js';

let students = []; // Global array to store student data
let expelledStudents = []; // Global array to store expelled student data

// Fetch and clean the data
async function fetchData() {
  try {
    const response = await fetchStudents(
    );
    const data = await response.json();
    cleanData(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Clean the data and split into individual properties
function cleanData(data) {
  data.forEach((student) => {
    const cleanedStudent = {
      firstName: getFirstName(student.fullname),
      middleName: getMiddleName(student.fullname),
      lastName: getLastName(student.fullname),
      nickName: getNickName(student.fullname),
      // Add other necessary properties
      house: student.house,
      responsibilities: student.responsibilities,
      expelled: false, // Initialize expelled status as false for each student
    };
    students.push(cleanedStudent);
  });

  // Call initial functions
  applyFilters();
  updateCounts();
}

// Helper functions to get individual name properties
function getFirstName(fullname) {
  /* code to get first name */
}
function getMiddleName(fullname) {
  /* code to get middle name */
}
function getLastName(fullname) {
  /* code to get last name */
}
function getNickName(fullname) {
  /* code to get nickname */
}

// Apply filters to the student list
function applyFilters() {
  const selectedHouse = houseFilter.value;
  const selectedResponsibilities = responsibilitiesFilter.value;
  const showExpelled = expelledFilter.checked;

  const filteredStudents = students.filter((student) => {
    const matchesHouse =
      selectedHouse === "" || student.house === selectedHouse;
    const matchesResponsibilities =
      selectedResponsibilities === "" ||
      student.responsibilities.includes(selectedResponsibilities);
    const matchesExpelled = showExpelled || !student.expelled;

    return matchesHouse && matchesResponsibilities && matchesExpelled;
  });

  displayStudentList(filteredStudents);
}

// Perform search on the student list
function performSearch() {
  const query = searchInput.value.toLowerCase();

  const searchedStudents = students.filter((student) => {
    const fullName = student.firstName + " " + student.lastName;
    return fullName.toLowerCase().includes(query);
  });

  displayStudentList(searchedStudents);
}

// Display the student list in the UI
function displayStudentList(studentListData) {
  studentList.innerHTML = "";

  studentListData.forEach((student) => {
    const li = document.createElement("li");
    li.textContent = student.firstName + " " + student.lastName;
    studentList.appendChild(li);
  });

  updateCounts(studentListData.length);
}

// Update the counts in the footer
function updateCounts(displayedStudentCount) {
  displayedCount.textContent = displayedStudentCount;
  totalCount.textContent = students.length;
  expelledCount.textContent = expelledStudents.length;

  const houseCountsData = getHouseCounts(students);
  houseCounts.textContent = "";

  for (const house in houseCountsData) {
    const count = houseCountsData[house];
    const span = document.createElement("span");
    span.textContent = house + ": " + count;
    houseCounts.appendChild(span);
  }
}

// Helper function to calculate the count of students in each house
function getHouseCounts(studentList) {
  const houseCounts = {};

  studentList.forEach((student) => {
    if (student.house in houseCounts) {
      houseCounts[student.house]++;
    } else {
      houseCounts[student.house] = 1;
    }
  });

  return houseCounts;
}

// Handle the event when a student is selected
function selectStudent(student) {
  // Display the details popup with student information
  // Add logic to decorate the popup with house crest and colors

  // Example:
  console.log("Selected student:", student);
}

// Handle the event when a student is expelled
function expelStudent(student) {
  student.expelled = true;
  expelledStudents.push(student);
  // Remove the student from the displayed student list
  // Update the counts in the footer

  // Example:
  console.log("Expelled student:", student);
}

// Handle the event when a student is appointed as a prefect
function appointPrefect(student) {
  // Add logic to enforce the limit of two prefects per house

  // Example:
  console.log("Appointed as prefect:", student);
}

// Handle the event when a student is removed from the prefect role
function removePrefect(student) {
  // Example:
  console.log("Removed as prefect:", student);
}

// Implement the hackTheSystem function
function hackTheSystem() {
  // Add logic to implement the hacking functionalities

  // Example:
  console.log("Hacking the system...");
}

// Event listeners for student selection, expelling, and prefect actions
studentList.addEventListener("click", (event) => {
  const selectedStudent = event.target.textContent;
  const student = students.find(
    (student) => student.fullName === selectedStudent
  );
  if (student) {
    selectStudent(student);
  }
});

// Example event listeners for expelling and prefect actions
studentList.addEventListener("contextmenu", (event) => {
  event.preventDefault();
  const selectedStudent = event.target.textContent;
  const student = students.find(
    (student) => student.fullName === selectedStudent
  );
  if (student) {
    expelStudent(student);
  }
});

// Call the necessary functions to initialize the student list and update the counts
fetchData();
