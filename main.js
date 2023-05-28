"use strict";

class Student {
  constructor(firstName, lastName, middleName, nickName, image, house) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.middleName = middleName;
    this.nickName = nickName;
    this.image = image;
    this.house = house;
  }
}
fetch("https://petlatkea.dk/2021/hogwarts/students.json")
  .then((response) => response.json())
  .then((data) => processData(data))
  .catch((error) => console.error("Error:", error));

function processData(data) {
  let students = [];

  data.forEach((rawStudent) => {
    let fullName = rawStudent.fullname.trim();

    // Split the full name into parts
    let nameParts = fullName.split(" ");
    let firstName = nameParts[0];
    let lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
    let middleName =
      nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : "";

    // Extract nickname if present
    let nickName = "";
    if (middleName.includes('"')) {
      nickName = middleName.replace(/"/g, "");
      middleName = "";
    }

    // Capitalize names
    firstName = capitalize(firstName);
    lastName = capitalize(lastName);
    middleName = capitalize(middleName);
    nickName = capitalize(nickName);

    // Handle the house
    let house = capitalize(rawStudent.house.trim());

    // Handle the image
    let image = `${lastName.toLowerCase()}_${firstName
      .toLowerCase()
      .charAt(0)}.png`;

    // Create a new student object
    let student = new Student(
      firstName,
      lastName,
      middleName,
      nickName,
      image,
      house
    );

    // Add the new student object to the array
    students.push(student);
  });

  // Display the cleaned data
  console.table(students);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function displayList() {
  students = students.filter(student => !student.isExpelled);
  students.forEach((student) => {
    let li = document.createElement("li");
    li.textContent = `${student.firstName} ${student.lastName}`;
    document.querySelector("#student-list").appendChild(li);
  });
}
function sortList() {
  students.sort((a, b) => a.firstName.localeCompare(b.firstName));
  displayList(); // re-display the list after sorting
}

function filterList(house) {
  let filteredStudents = students.filter((student) => student.house === house);
  displayList(filteredStudents); // re-display the list after filtering
}
function searchList(query) {
  let searchedStudents = students.filter(
    (student) =>
      student.firstName.includes(query) || student.lastName.includes(query)
  );
  displayList(searchedStudents); // re-display the list after search
}
function displayPopup(student) {
  // create and display a popup with student details
}
function expelStudent(student) {
  let index = students.indexOf(student);
  students.splice(index, 1);
  expelledStudents.push(student);
  displayList(); // re-display the list after expelling a student
}

function makePrefect(student) {
  let prefectsInHouse = students.filter(
    (s) => s.house === student.house && s.isPrefect
  );
  if (prefectsInHouse.length < 2) {
    student.isPrefect = true;
  } else {
    // handle the case when there are already two prefects
  }
  displayList(); // re-display the list after making a student prefect
}
fetch("https://petlatkea.dk/2021/hogwarts/families.json")
  .then((response) => response.json())
  .then((data) => handleBloodData(data));

function handleBloodData(bloodData) {
  // assign blood status to each student
}
function assignBloodStatus(student, bloodData) {
  if (bloodData.pure.includes(student.lastName)) {
    student.bloodStatus = "pure";
  } else if (bloodData.half.includes(student.lastName)) {
    student.bloodStatus = "half";
  } else {
    student.bloodStatus = "muggle";
  }
}
function addToInquisitorialSquad(student) {
  if (student.bloodStatus === "pure" || student.house === "Slytherin") {
    student.inInquisitorialSquad = true;
  }
  displayList();
}
function hackTheSystem() {
  if (!systemHacked) {
    systemHacked = true; // a global variable to prevent multiple hacks
    injectSelf();
    corruptBloodStatus();
    temporaryInquisitorialSquad();
  }
}
function injectSelf() {
  let hacker = {
    firstName: "Your",
    lastName: "Name",
    // add other necessary properties
  };
  students.push(hacker);
  displayList(); // re-display the list after adding yourself
}
function corruptBloodStatus() {
  students.forEach((student) => {
    if (student.bloodStatus === "pure") {
      // randomize blood status
      let statuses = ["pure", "half", "muggle"];
      student.bloodStatus =
        statuses[Math.floor(Math.random() * statuses.length)];
    } else {
      student.bloodStatus = "pure";
    }
  });
  displayList(); // re-display the list after corrupting blood statuses
}
function temporaryInquisitorialSquad() {
  setInterval(() => {
    students.forEach((student) => {
      if (student.inInquisitorialSquad) {
        student.inInquisitorialSquad = false;
      }
    });
    displayList(); // re-display the list after removing all students from Inquisitorial Squad
  }, 5000); // change students' Inquisitorial Squad status every 5 seconds
}

function sortByFirstName(a, b) {
  if (a.firstName < b.firstName) {
      return -1;
  } else if (a.firstName > b.firstName) {
      return 1;
  } else {
      return 0;
  }
}
document.querySelector("#sortButton").addEventListener("click", () => {
  allStudents.sort(sortByFirstName);
  displayList(allStudents);
});

function sortByLastName(a, b) {
  if (a.lastName < b.lastName) {
      return -1;
  } else if (a.lastName > b.lastName) {
      return 1;
  } else {
      return 0;
  }
}

document.querySelector("#sortButton").addEventListener("click", () => {
  allStudents.sort(sortByLastName);
  displayList(allStudents);
});

function filterByHouse(house) {
  return allStudents.filter(student => student.house === house);
}

document.querySelector("#filter").addEventListener("change", (event) => {
  const house = event.target.value;
  const filteredStudents = filterByHouse(house);
  displayList(filteredStudents);
});

function searchStudent(query) {
  return allStudents.filter(student => student.firstName.toLowerCase().includes(query.toLowerCase()) || student.lastName.toLowerCase().includes(query.toLowerCase()));
}

document.querySelector("#searchInput").addEventListener("input", (event) => {
  const query = event.target.value;
  const searchResults = searchStudent(query);
  displayList(searchResults);
});

function showStudentDetails(student) {
  // TODO: Fill in the details based on the student object
  const expelButton = document.createElement("button");
  expelButton.textContent = "Expel";
  expelButton.addEventListener("click", () => {
      student.isExpelled = true;
      // Refresh the list to hide expelled students
      displayList(allStudents.filter(student => !student.isExpelled));
  const prefectButton = document.createElement("button");
    prefectButton.textContent = "Make Prefect";
    prefectButton.addEventListener("click", () => {
        const prefectsInSameHouse = allStudents.filter(otherStudent => otherStudent.isPrefect && otherStudent.house === student.house);
        if (prefectsInSameHouse.length < 2) {
            student.isPrefect = true;
            prefectButton.textContent = "Remove Prefect";
        } else {
            alert("There are already two prefects in this house.");
        }
    });
    const bloodStatusElement = document.createElement("p");
    bloodStatusElement.textContent = `Blood Status: ${student.bloodStatus}`;
    const squadButton = document.createElement("button");
    squadButton.textContent = student.isInSquad ? "Remove from Squad" : "Add to Squad";
    squadButton.addEventListener("click", () => {
        if (student.bloodStatus === "Pure-blood" || student.house === "Slytherin") {
            student.isInSquad = !student.isInSquad;
            squadButton.textContent = student.isInSquad ? "Remove from Squad" : "Add to Squad";
        } else {
            alert("Only pure-blood students or students from Slytherin can join the Inquisitorial Squad.");
        }
    });


    // Append the button to the details popup
    popupElement.appendChild(prefectButton);
}
  );

  // Append the button to the details popup
  // Replace 'popupElement' with the actual variable name for your popup element
  popupElement.appendChild(expelButton);
  popupElement.appendChild(bloodStatusElement);
  popupElement.appendChild(squadButton);
}

studentElement.addEventListener("click", () => showStudentDetails(student));

let families;

fetch("https://petlatkea.dk/2021/hogwarts/families.json")
.then(response => response.json())
.then(data => {
    families = data;
    allStudents.forEach(determineBloodStatus);
});

function determineBloodStatus(student) {
  if (families.pure.includes(student.lastName)) {
      student.bloodStatus = "Pure-blood";
  } else if (families.half.includes(student.lastName)) {
      student.bloodStatus = "Half-blood";
  } else {
      student.bloodStatus = "Muggle";
  }
}


