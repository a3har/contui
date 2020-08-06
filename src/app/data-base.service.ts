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
  selectedindex: any
  selectedWord: any
  selectedWordData: any
  selectedID: any
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
    //     this.firebaseData = res;
    //   })
    this.getNewWord()
  }

  getNewWord() {
    this.firestore.collection("allImgs", ref => ref
      .where("checked", "==", 0).orderBy('images').limitToLast(3)).snapshotChanges().subscribe(res => {
        this.firebaseData = res;
        this.selectedindex = this.randomIDgen()
        this.selectedWord = this.firebaseData[this.selectedindex].payload.doc
        this.selectedWordData = this.selectedWord.data();
        this.selectedID = this.selectedWordData.wordID
        this.selectedWordData.checked += 1
      })

  }

  firebaseDataToBeUploaded() {
    return this.http.get("assets/firebase.json");
  }

  getData() {
    return this.http.get("assets/all_data.json");
  }
  randomIDgen() {
    return Math.floor(Math.random() * this.firebaseData.length);
    // return Math.floor(Math.random() * 3);

  }
}
