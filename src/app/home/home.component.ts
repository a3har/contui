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
  none = true
  constructor(public db: DataBaseService, private firestore: AngularFirestore) {

  }

  ngOnInit(): void {
  }

  onClickNone() {
    this.selectedImgs = []
    this.none = true;
  }

  onImgClick(index) {
    this.none = false;
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
  }

  displayNextWord() {
    this.firestore.collection("allImgs").doc(this.db.selectedWord.id).set(this.db.selectedWordData).then(res => {
      this.db.getNewWord();
      this.selectedImgs = []
      console.log("Word successfully added to firebase database");
    })
  }

}


