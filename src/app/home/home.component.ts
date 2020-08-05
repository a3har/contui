import { Component, OnInit } from '@angular/core';
import { DataBaseService } from '../data-base.service'
import { AngularFirestore } from '@angular/fire/firestore'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {



  selectedindex: any
  selectedImgs = []
  selectedID: any
  images: any
  constructor(public db: DataBaseService, private firestore: AngularFirestore) {

  }


  ngOnInit(): void {
    // this.selectedindex = this.db.randomIDgen()
    // this.selectedID = this.selectedindex
    // this.images = this.db.allImgData[this.selectedID]['images']
    this.displayNextWord()
  }

  onClickNone() {
    this.selectedImgs = []
  }

  onImgClick(index) {
    if (!this.selectedImgs.includes(index)) {
      this.selectedImgs.push(index)
    }
    else {
      for (var i = 0; i < this.selectedImgs.length; i++) {
        if (this.selectedImgs[i] == index) {
          this.selectedImgs.splice(i, 1);
          break;
        }
      }
    }
  }
  displayNextWord() {

    // this.images = this.db.allImgData[this.selectedID]['images']
    // this.images = this.db.firebaseData[this.selectedindex].payload.doc.data().images
    // this.selectedID = this.db.firebaseData[this.selectedindex].payload.doc.data().wordID
    // this.updateFirebase().then(res => {
    this.selectedindex = this.db.randomIDgen()
    this.selectedID = this.selectedindex
    this.images = this.db.allImgData[this.selectedID]['images']
    console.log(this.selectedImgs)
    this.selectedImgs = []
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
    Object.keys(this.db.firebaseData).forEach(element => {
      this.firestore.collection("allImgs").add(this.db.firebaseData[element]).catch(err => {
        console.log(err)
      })
    })
  }

}
