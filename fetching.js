"use strict"

export function fetchStudents() {
    return fetch("https://petlatkea.dk/2021/hogwarts/students.json")
      .then(response => response.json())
      .catch((error) => console.error("Error:", error));
}

export function fetchFamilies() {
    return fetch("https://petlatkea.dk/2021/hogwarts/families.json")
        .then(response => response.json())
        .catch((error) => console.error("Error:", error));
}