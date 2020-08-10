import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { AngularFirestore } from '@angular/fire/firestore'
import { dataMuseQuery, wordObject } from "./datamuse"
import { forkJoin } from 'rxjs';

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
  allWordsData;
  constructor(public http: HttpClient, private firestore: AngularFirestore) {
    this.http.get("assets/csvToJsonData.json").subscribe(data => {
      this.allWordsData = data;


    })
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

  async processData() {
    let keys = Object.keys(this.allWordsData);
    let allData = {};
    let notProperWord = [];
    let maxL = keys.length;
    let index = 0;
    for (let key of keys) {
      index++;
      let crntIndex = index
      let word = this.allWordsData[key][1];
      let selectedData = this.allWordsData[key]
      let dataMuseParms = new dataMuseQuery();
      dataMuseParms.sp = word // here goes the word
      let params = new HttpParams();
      for (let key of Object.keys(dataMuseParms)) {
        params = params.append(key, dataMuseParms[key]);
      }
      let promise1 = new Promise((resolve, reject) => {
        this.http.get("https://api.datamuse.com/words", { params: params }).subscribe(data => {
          //console.log(data[0]);
          resolve(data[0]);
        })

      });
      let promise2 = new Promise((resolve, reject) => {
        let merriamURL: string = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + word + "?key=f26e324a-8a14-4a65-a015-293095c16a70"

        this.http.get(merriamURL).subscribe(data => {
          let dataObj = {};
          dataObj['shortdef'] = data[0]['shortdef'];
          let allExample = data[0]['def'][0]['sseq'][0] // in the sense first, there will be multiple example in this
          let onlyExamples = []
          //console.log(allExample)
          for (let oneex of allExample) {
            let exampleString: string = oneex[1]['dt'][1][1][0]['t'];
            onlyExamples.push(exampleString.replace('{wi}', "").replace('{/wi}', ''))
          }
          //console.log();
          dataObj['examples'] = onlyExamples
          //console.log(dataObj);
          resolve(dataObj);
        })


      });
      let forkjoin_data = forkJoin(promise1, promise2);
      await forkJoin
      forkjoin_data.subscribe((data: any) => {
        console.log(word);
        let wordData = new wordObject();
        wordData.id = key;
        wordData.word = word;
        wordData.pos = selectedData[3];
        wordData.defs = data[1]['shortdef']; // from merriam definitions 
        wordData.wordNetDef = data[0]['defs']; // from wordNet definations        
        wordData.shortExample = data[1]['examples']; // these are merriam examples in 2-3 words like very short and crisp example for every word...
        wordData.examples = [selectedData[4]];
        wordData.synonyms = selectedData[6];
        wordData.podcastLink = selectedData[5];
        wordData.imageUrls = selectedData[7];
        wordData.nGramFreq = data[0]['tags'][2].split(":")[1];
        if ((selectedData[4] == "" || selectedData[4] == null) || Array.isArray(selectedData[4])) {
          notProperWord.push(word)
        }
        allData[key] = wordData;
        if (crntIndex >= maxL) {
          console.log(JSON.stringify(allData));
          console.log(JSON.stringify(notProperWord));
        }
      }
      )

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
