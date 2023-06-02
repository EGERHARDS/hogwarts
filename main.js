"use strict";
import { Student } from "./students.js";
import { fetchStudents, fetchFamilies } from "./fetching.js";

function capitalizeNameParts(names) {
  return names.map((name) => {
    if (!name || name === "-") {
      return name;
    }

    return name
      .split(" ")
      .map(
        (part) => part.charAt(0).toUpperCase() + part.substring(1).toLowerCase()
      )
      .join(" ");
  });
}

let allStudents = [];
let expelledStudents = [];

window.addEventListener("DOMContentLoaded", init);

function init() {
  fetchData();
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
    const imageName = createImageName(lastName, firstName.charAt(0));

    const student = new Student({
      firstName,
      lastName,
      middleName: middleName !== "-" ? middleName : undefined,
      nickName: nickName !== "-" ? nickName : undefined,
      imageName,
      house: capitalizeHouse(studentData.house.trim()),
      bloodStatus: getBloodStatus(nameParts.lastName, families),
    });

    allStudents.push(student);
  });

  updateHouseCounts();
  updateEnrollmentCounts();

  attachEventListeners();
  displayList(allStudents);
}

function createName(fullname) {
  fullname = fullname.trim(); // Remove white space

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

  const cleanedNameParts = capitalizeNameParts([
    firstName,
    middleName,
    lastName,
    nickName,
  ]);
  firstName = cleanedNameParts[0];
  middleName = cleanedNameParts[1];
  lastName = cleanedNameParts[2];
  nickName = cleanedNameParts[3];

  return { firstName, middleName, nickName, lastName };
}

function getBloodStatus(lastName, familyData) {
  lastName = lastName.toLowerCase();
  if (familyData.pure.map((name) => name.toLowerCase()).includes(lastName)) {
    return "Pure-blood";
  } else if (
    familyData.half.map((name) => name.toLowerCase()).includes(lastName)
  ) {
    return "Half-blood";
  } else {
    return "Muggle";
  }
}

function convertCamelCaseToRegular(str) {
  const words = str.split(/(?=[A-Z])/).map((word) => word.toLowerCase());

  return words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function displayList(students) {
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  // Table header
  const headers = ["First Name", "Last Name", "House"];
  const tr = document.createElement("tr");
  tr.classList.add("student-row");
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  table.appendChild(thead);

  // Table body
  students.forEach((student) => {
    const tr = document.createElement("tr");
    tr.classList.add("student-row");
    if (student.isExpelled) {
      tr.classList.add("expelled");
    }
    const data = [student.firstName, student.lastName, student.house];
    data.forEach((datum) => {
      const td = document.createElement("td");
      td.textContent = datum;
      tr.appendChild(td);
    });
    tr.addEventListener("click", () => showStudentDetails(student));
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  const studentList = document.querySelector("#student-list");
  studentList.innerHTML = "";
  studentList.appendChild(table);
}

function showStudentDetails(student) {
  // Create modal element
  const modal = document.createElement("div");
  modal.classList.add("modal");

  // Create modal content element
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");

  // Add house colors and crest
  const houseCrest = document.createElement("img");
  houseCrest.src = student.houseCrest;
  houseCrest.classList.add(student.house + "-crest");
  modalContent.appendChild(houseCrest);

  // Add student details
  const studentDetails = [
    "firstName",
    "middleName",
    "lastName",
    "bloodStatus",
    "isPrefect",
    "isExpelled",
    "isInquisitorialSquad",
  ];
  studentDetails.forEach((detail) => {
    const paragraph = document.createElement("p");
    const readableDetail = convertCamelCaseToRegular(detail);
    if (detail in student && student[detail]) {
      paragraph.textContent = `${readableDetail}: ${student[detail]}`;
    } else if (detail in student) {
      paragraph.textContent = `${readableDetail}: No`;
    } else {
      paragraph.textContent = `${readableDetail}: Unknown`;
    }
    modalContent.appendChild(paragraph, modalContent.firstChild);
  });

  const expelButton = document.createElement("button");
  expelButton.textContent = "Expel";
  expelButton.classList.add("expel-button");
  expelButton.addEventListener("click", () => {
    expelStudent(student);
    modal.style.display = "none"; // close the modal after expelling the student
  });
  modalContent.appendChild(expelButton);

  // Add photo if it exists
  if (student.photo) {
    const studentPhoto = document.createElement("img");
    studentPhoto.src = student.photo;
    studentPhoto.classList.add("student-photo");
    if (modalContent.firstChild) {
      modalContent.insertBefore(studentPhoto, modalContent.firstChild);
    } else {
      modalContent.appendChild(studentPhoto);
    }
  }

  // Append modal content to modal
  modal.appendChild(modalContent);

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  // Append modal to body
  document.body.appendChild(modal);
}

function attachEventListeners() {
  document.querySelector("#sortButton").addEventListener("click", () => {
    allStudents.sort(sortByFirstName);
    displayList(allStudents);
  });

  document.querySelector("#searchInput").addEventListener("input", (event) => {
    const query = event.target.value;
    const searchResults = searchStudent(query);
    displayList(searchResults);
  });
  const houseButtons = document.querySelectorAll(".filter");

  houseButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const house = event.target.dataset.filter;
      const filteredStudents = allStudents.filter(
        (student) => student.house.toLowerCase() === house
      );
      displayList(filteredStudents);
    });
  });

  const statusButtons = document.querySelectorAll(
    '.filter[data-filter="enrolled"], .filter[data-filter="expelled"]'
  );

  statusButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const status = event.target.dataset.filter;
      let filteredStudents;

      if (status === "enrolled") {
        filteredStudents = allStudents.filter(
          (student) => student.isExpelled === false
        );
      } else if (status === "expelled") {
        filteredStudents = allStudents.filter(
          (student) => student.isExpelled === true
        );
      }

      displayList(filteredStudents);
    });
  });
}

function capitalizeHouse(house) {
  if (!house) return null;

  const houseLowercase = house.toLowerCase();
  const houseCapitalized =
    houseLowercase.charAt(0).toUpperCase() + houseLowercase.slice(1);

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
      (student.firstName &&
        student.firstName.toLowerCase().includes(query.toLowerCase())) ||
      (student.middleName &&
        student.middleName.toLowerCase().includes(query.toLowerCase())) ||
      (student.nickName &&
        student.nickName.toLowerCase().includes(query.toLowerCase())) ||
      (student.lastName &&
        student.lastName.toLowerCase().includes(query.toLowerCase()))
  );
}

function expelStudent(student) {
  student.isExpelled = true;
  displayList(allStudents);
  updateEnrollmentCounts();
  /* const index = allStudents.indexOf(student);
  if (index > -1) {
    allStudents.splice(index, 1);
  }

  expelledStudents.push(student);
  displayList(allStudents); */
}

function updateHouseCounts() {
  const houses = ["Gryffindor", "Slytherin", "Ravenclaw", "Hufflepuff"];
  houses.forEach((house) => {
    const count = allStudents.filter(
      (student) => student.house === house
    ).length;
    document.querySelector(`#${house.toLowerCase()}-count`).textContent = count;
  });
}

function updateEnrollmentCounts() {
  const enrolledCount = allStudents.filter(
    (student) => student.isExpelled === false
  ).length;
  const expelledCount = allStudents.filter(
    (student) => student.isExpelled === true
  ).length;

  document.querySelector("#enrolled-count").textContent = enrolledCount;
  document.querySelector("#expelled-count").textContent = expelledCount;
}

function filterStudentsByHouse(house) {
  return allStudents.filter((student) => student.house === house);
}
