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
  minimumchecked: any
  isUserViewing = false;
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
    this.firestore.collection("otherVariables").doc('DNgi5YZLq7RHrFNS4xHR').snapshotChanges().subscribe(res => {
      this.minimumchecked = res.payload.data()
      this.getNewWord()
    })
  }

  getNewWord() {
    this.isDataFetched = false;
    this.firestore.collection("allImgsNew", ref => ref
      .where("checked", "<=", this.minimumchecked.minimum_checked).orderBy('checked').orderBy('images').limitToLast(1)).snapshotChanges().subscribe(res => {
        if (this.isUserViewing) {
          return;
        }
        this.firebaseData = res;
        this.selectedindex = this.randomIDgen()
        this.selectedWord = this.firebaseData[this.selectedindex].payload.doc
        this.selectedWordData = this.selectedWord.data();
        this.selectedID = this.selectedWordData.wordID
        this.isDataFetched = true;
        this.isUserViewing = true;
      })
  }

  // only manual operation to sync image data with firebase;
  uploadImageData() {
    let count = 0;
    for (let oneImageID of Object.keys(this.dataToBeUploaded)) {
      // if (count > 10) {
      //   break;
      // }
      let oneImageData = this.dataToBeUploaded[oneImageID]; // to be updated in the firebase doc
      let docId = this.allImgData[oneImageID]["wordDetails"][0];
      let usersRef = this.firestore.collection('allImgsNew').doc(docId);

      usersRef.get().subscribe((docSnapshot) => {
        if (!docSnapshot.exists) {
          usersRef.set(oneImageData).then(res => {
            console.log(res);
          })
        } else {
          console.log("skipping the word:", docId, "   already Exist!!!")
        }
      });
      count++;

    }

  }

  updateMinimumCount() {
    this.minimumchecked.minimum_checked += 1;
    this.firestore.collection("otherVariables").doc("DNgi5YZLq7RHrFNS4xHR").set(this.minimumchecked).then(res => {
      console.log("count has been updated to :", this.minimumchecked.minimum_checked);
    })
  }

  firebaseDataToBeUploaded() {
    return this.http.get("assets/image_data.json");
  }

  getData() {
    return this.http.get("assets/all_data.json");
  }
  randomIDgen() {
    return Math.floor(Math.random() * this.firebaseData.length);
  }
}
