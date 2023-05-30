"use strict"

export function fetchStudents() {
    fetch("https://petlatkea.dk/2021/hogwarts/students.json")
      .then((response) => response.json())
      .then((data) => processData(data))
      .catch((error) => console.error("Error:", error));
    }