import { Component, OnInit } from '@angular/core';
import { DataBaseService } from '../data-base.service'
import { AngularFirestore } from '@angular/fire/firestore'
import { toBase64String } from '@angular/compiler/src/output/source_map';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  selectedImgs = []
  images: any
  constructor(public db: DataBaseService, private firestore: AngularFirestore) {

  }


  ngOnInit(): void {
    // this.selectedindex = this.db.randomIDgen()
    // this.selectedID = this.selectedindex
    // this.images = this.db.allImgData[this.selectedID]['images']
    // this.displayNextWord()
  }

  onClickNone() {
    this.selectedImgs = []
  }

  onImgClick(index) {
    if (!this.selectedImgs.includes(index)) {
      this.selectedImgs.push(index)
      this.db.selectedWordData.images[index]['count'] += 1
    }
    else {
      for (var i = 0; i < this.selectedImgs.length; i++) {
        if (this.selectedImgs[i] == index) {
          this.selectedImgs.splice(i, 1);
          this.db.selectedWordData.images[index]['count'] -= 1
          break;
        }
      }
    }
    // console.log(this.db.selectedWordData.images);
  }
  displayNextWord() {

    // this.images = this.db.allImgData[this.selectedID]['images']
    // this.images = this.db.firebaseData[this.selectedindex].payload.doc.data().images
    // this.selectedID = this.db.firebaseData[this.selectedindex].payload.doc.data().wordID
    // this.updateFirebase().then(res => {
    this.testing()
    // this.db.getNewWord();
    // console.log(this.db.selectedWordData)
    // }).catch(err => {
    //   console.log(err)
    // })

  }

  // updateFirebase() {
  //   return new Promise((resolve, reject) => {
  //     this.selectedImgs.forEach(index => {
  //       this.images[index]['count'] += 1
  //     })
  //     console.log(this.images)
  //     resolve("fetched all words data");
  //   })

  // }

  addAlltodatabase() {
    Object.keys(this.db.dataToBeUploaded).forEach(element => {
      this.firestore.collection("allImgs").add(this.db.dataToBeUploaded[element]).catch(err => {
        console.log(err)
      })
    })
  }

  testing() {
    // getNextset
    this.firestore.collection("allImgs").doc(this.db.selectedWord.id).set(this.db.selectedWordData).then(res => {
      this.db.getNewWord();
      console.log(this.db.selectedWordData)
      this.selectedImgs = []

      console.log("Word successfully added to firebase database");
    })
  }

}


