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
  