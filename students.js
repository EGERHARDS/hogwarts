"use strict"

export class Student {
    constructor(studentData) {
      this.firstName = studentData.firstName;
      this.lastName = studentData.lastName;
      this.middleName = studentData.middleName;
      this.nickName = studentData.nickName;
      this.photo = studentData.imageName;
      this.house = studentData.house;
      this.bloodStatus = studentData.bloodStatus;
    }

    // Method to set blood status
    setBloodStatus(families) {
        // logic here to set the blood status based on families data
    }

    // Method to set role
    setRole(role) {
        this.role = role;
    }
}
