import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AngularFirestore } from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root'
})
export class DataBaseService {

  allImgData: any
  isDataFetched: boolean
  data: any
  dataToBeUploaded: any
  firebaseData: any
  // promise1 = new Promise((resolve, reject) => {
  //   this.getImgsFromJSON()
  //   resolve("Got all Imgs")
  // })
  constructor(public http: HttpClient, private firestore: AngularFirestore) {
    this.data = {
      link: "www.google.com",
      count: 0
    }
    this.getImgsFromJSON()
  }

  getImgsFromJSON() {
    this.firebaseData = []
    this.getData().subscribe((data: any) => {
      this.allImgData = data;
      this.isDataFetched = true
    });
    this.firebaseDataToBeUploaded().subscribe(data => {
      this.dataToBeUploaded = data;
    })
    // this.firestore.collection("allImgs", ref => ref
    //   .where("checked", "==", 0)).snapshotChanges().subscribe(res => {
    //     // console.log(res)
    //     this.firebaseData = res;
    //   })
  }

  firebaseDataToBeUploaded() {
    return this.http.get("assets/firebase.json");
  }

  getData() {
    return this.http.get("assets/all_data.json");
  }
  randomIDgen() {
    // return Math.floor(Math.random() * this.firebaseData.length);
    return Math.floor(Math.random() * 1211);

  }
}
