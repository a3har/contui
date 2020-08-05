import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AngularFirestore } from '@angular/fire/firestore'

@Injectable({
  providedIn: 'root'
})
export class DataBaseService {

  allImgData: any
  isDataFetched = false
  dataToBeUploaded: any
  firebaseData: any
  loadData = new Promise((resolve, reject) => {
    this.getImgsFromJSON();
    resolve("Got all Imgs")
  })
  constructor(public http: HttpClient, private firestore: AngularFirestore) {
  }

  getImgsFromJSON() {
    this.firebaseData = []
    this.getData().subscribe((data: any) => {
      this.allImgData = data;
    });
    this.firebaseDataToBeUploaded().subscribe(data => {
      this.dataToBeUploaded = data;
    })
    // this.firestore.collection("allImgs", ref => ref
    //   .where("checked", "==", 0).limitToLast(1)).snapshotChanges().subscribe(res => {
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
