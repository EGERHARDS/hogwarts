"use strict";
import { Student } from "./students.js";
import { fetchStudents, fetchFamilies } from "./fetching.js";

function capitalizeNameParts(names) {
  return names.map((name) => {
    if (!name || name === "-") {
      return name; // return the name as is if it's empty or "-"
    }
    
    return name
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase() + part.substring(1).toLowerCase())
      .join(' ');
  });
}

let allStudents = [];
let expelledStudents = [];

window.addEventListener("DOMContentLoaded", init);

function init() {
  fetchData();
  attachEventListeners();
}

async function fetchData() {
  const students = await fetchStudents();
  const families = await fetchFamilies();

  students.forEach((studentData) => {
    const nameParts = createName(studentData.fullname);

    const capitalizedNames = capitalizeNameParts([
      nameParts.firstName,
      nameParts.middleName,
      nameParts.nickName,
      nameParts.lastName,
    ]);

    const [firstName, middleName, nickName, lastName] = capitalizedNames;
    const imageName = createImageName(lastName, firstName.charAt(0)); // create image name using the lastName and the first character of the firstName

    const student = new Student({
      firstName,
      lastName,
      middleName: middleName !== '-' ? middleName : undefined,
      nickName: nickName !== '-' ? nickName : undefined,
      imageName,
      house: capitalizeHouse(studentData.house.trim()),
      bloodStatus: getBloodStatus(studentData, families),
    });

    allStudents.push(student);
  });

  displayList(allStudents);
}

function createName(fullname) {
  fullname = fullname.trim(); // Remove leading/trailing white space

  let firstName = "";
  let lastName = "";
  let middleName = "-";
  let nickName = "-";

  const nameParts = fullname.split(" ");
  if (nameParts.length > 0) {
    firstName = nameParts[0];
  }

  const lastSpaceIndex = fullname.lastIndexOf(" ");
  if (lastSpaceIndex !== -1) {
    lastName = fullname.substring(lastSpaceIndex + 1);
  }

  const nicknameMatch = fullname.match(/\"(.*)\"/);
  if (nicknameMatch) {
    nickName = nicknameMatch[1];
  }

  const nameWithoutNickname = fullname.replace(/\".*\"/, "").trim();
  const middleNameParts = nameWithoutNickname.split(" ").slice(1, -1);
  if (middleNameParts.length > 0) {
    middleName = middleNameParts.join(" ");
  }

  const cleanedNameParts = capitalizeNameParts([firstName, middleName, lastName, nickName]);
  firstName = cleanedNameParts[0];
  middleName = cleanedNameParts[1];
  lastName = cleanedNameParts[2];
  nickName = cleanedNameParts[3];

  return { firstName, middleName, nickName, lastName }
}


function getBloodStatus(student, familyData) {
  const lastName = student.lastName;
  console.log('Family data:', familyData);
  console.log('Student last name:', lastName);

  if (familyData.pure.includes(lastName)) {
    return "Pure-blood";
  } else if (familyData.half.includes(lastName)) {
    return "Half-blood";
  } else {
    return "Muggle";
  }
}

function displayList(students) {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  // Table header
  const headers = ["First Name", "Last Name", "House"];
  const tr = document.createElement("tr");
tr.classList.add("student-row");
  headers.forEach(header => {
    const th = document.createElement("th");
    th.textContent = header;
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  table.appendChild(thead);

  // Table body
  students.forEach(student => {
    const tr = document.createElement("tr");
    tr.classList.add("student-row");
    const data = [student.firstName, student.lastName, student.house];
    data.forEach(datum => {
      const td = document.createElement("td");
      td.textContent = datum;
      tr.appendChild(td);
    });
    tr.addEventListener("click", () => showStudentDetails(student)); // Adds an event listener to the row
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  // Clear the existing list before displaying
  const studentList = document.querySelector("#student-list");
  studentList.innerHTML = "";
  studentList.appendChild(table);
}



function showStudentDetails(student) {
  // Create modal element
  const modal = document.createElement('div');
  modal.classList.add('modal');

  // Create modal content element
  const modalContent = document.createElement('div');
  modalContent.classList.add('modal-content');

  // Add house colors and crest
  const houseCrest = document.createElement('img');
  houseCrest.src = student.houseCrest;
  houseCrest.classList.add(student.house + '-crest'); // e.g. 'gryffindor-crest'
  modalContent.appendChild(houseCrest);

  // Add student details
  const studentDetails = ['firstName', 'middleName', 'lastName', 'bloodStatus', 'isPrefect', 'isExpelled', 'isInquisitorialSquad'];
  studentDetails.forEach(detail => {
    const paragraph = document.createElement('p');
    if (detail in student && student[detail]) { // Check if student has this property
      paragraph.textContent = `${detail}: ${student[detail]}`;
    } else if (detail in student) { // If property exists but is falsy (e.g. false, null)
      paragraph.textContent = `${detail}: No`;
    } else { // If property does not exist
      paragraph.textContent = `${detail}: Unknown`;
    }
    modalContent.appendChild(paragraph, modalContent.firstChild);
  });

  // Add photo if it exists
  if (student.photo) {
    const studentPhoto = document.createElement('img');
    studentPhoto.src = student.photo;
    studentPhoto.classList.add('student-photo');  // optional, if you want to add a class for styling purposes
    if (modalContent.firstChild) {  // if there's already an element inside modalContent
      modalContent.insertBefore(studentPhoto, modalContent.firstChild);  // insert the photo before the first child
    } else {
      modalContent.appendChild(studentPhoto);  // if modalContent is empty, append the photo
    }
  }

  // Append modal content to modal
  modal.appendChild(modalContent);

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  // Append modal to body
  document.body.appendChild(modal);
}


function attachEventListeners() {
  document.querySelector("#sortButton").addEventListener("click", () => {
    allStudents.sort(sortByFirstName);
    displayList(allStudents);
  });

  document.querySelector("#filter").addEventListener("change", (event) => {
    const house = event.target.value;
    const filteredStudents = filterByHouse(house);
    displayList(filteredStudents);
  });

  document.querySelector("#searchInput").addEventListener("input", (event) => {
    const query = event.target.value;
    const searchResults = searchStudent(query);
    displayList(searchResults);
  });
}

function capitalizeHouse(house) {
  if (!house) return null;

  const houseLowercase = house.toLowerCase();
  const houseCapitalized = houseLowercase.charAt(0).toUpperCase() + houseLowercase.slice(1);

  return houseCapitalized;
}

function createImageName(lastName, firstNameChar) {
  if (!lastName || !firstNameChar) return null;

  const imageName = `images/${lastName.toLowerCase()}_${firstNameChar.toLowerCase()}.png`;
  return imageName;
}

function sortByFirstName(a, b) {
  return a.firstName.localeCompare(b.firstName);
}

function filterByHouse(house) {
  return allStudents.filter((student) => student.house === house);
}

function searchStudent(query) {
  return allStudents.filter(
    (student) =>
      student.firstName.toLowerCase().includes(query.toLowerCase()) ||
      student.lastName.toLowerCase().includes(query.toLowerCase())
  );
}

function expelStudent(student) {
  const index = allStudents.indexOf(student);
  if (index > -1) {
    allStudents.splice(index, 1);
  }

  expelledStudents.push(student);
  displayList(allStudents);
}
