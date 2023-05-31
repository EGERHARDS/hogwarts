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
    const imageName = createImageName(firstName, lastName);

    const student = new Student(
      firstName,
      lastName,
      middleName !== '-' ? middleName : undefined,
      nickName !== '-' ? nickName : undefined,
      imageName,
      capitalizeHouse(studentData.house.trim()),
      getBloodStatus(studentData, families)
    );

    allStudents.push(student);
  });

  displayList(allStudents);
}

function createName(fullname) {
  let firstName = fullname.substring(0, fullname.indexOf(" ")) || "-";
  let lastName = fullname.substring(fullname.lastIndexOf(" ") + 1) || "-";
  let nickName = "-";
  let middleName;

  // this is for the first name
  const oneName = /[ ]/;
  let isOneName = fullname.search(oneName);
  if (isOneName === -1) {
    firstName = fullname;
    lastName = "-";
  }

  // this is for the nickname
  const nickn = /["]/;
  let isNick = fullname.search(nickn);
  if (isNick === -1) {
    middleName =
      fullname.substring(
        fullname.indexOf(" ") + 1,
        fullname.lastIndexOf(" ")
      ) || "-";
  } else {
    nickName = fullname.substring(isNick + 1, fullname.lastIndexOf('"')) || "-";
    middleName =
      fullname.substring(fullname.indexOf(" ") + 1, isNick - 1) || "-";
  }

  let nameParts = capitalizeNameParts([
    firstName,
    middleName,
    nickName,
    lastName,
  ]);
  return {
    firstName: nameParts[0],
    middleName: nameParts[1],
    nickName: nameParts[2],
    lastName: nameParts[3],
  };
}

function getBloodStatus(student, familyData) {
  const lastName = student.lastName;

  if (familyData.pure.includes(lastName)) {
    return "Pure";
  } else if (familyData.half.includes(lastName)) {
    return "Half-blood";
  } else {
    return "Muggle";
  }
}

function displayList(students) {
  //clear the list before displaying
  document.querySelector("#student-list").innerHTML = "";
  students.forEach((student) => {
    let li = document.createElement("li");
    li.textContent = `${student.firstName} ${student.lastName}`;
    li.dataset.id = student.id;
    li.addEventListener("click", () => showStudentDetails(student));
    document.querySelector("#student-list").appendChild(li);
  });
}

function showStudentDetails(student) {
  // Code to display student details
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

function createImageName(firstName, lastName) {
  if (!firstName || !lastName) return null;

  const nameParts = lastName.split("-");
  const imageName = `${nameParts[0]}_${firstName[0]}.png`.toLowerCase();
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
