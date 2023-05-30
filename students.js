"use strict"

export class Student {
    constructor(firstName, lastName, middleName, nickName, image, house) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.middleName = middleName;
      this.nickName = nickName;
      this.image = image;
      this.house = house;
      this.expelled = false;
      this.prefect = false;
      this.bloodStatus = "";
    }
  }