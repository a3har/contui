import { Component } from '@angular/core';
import { DataBaseService } from './data-base.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'contui';
  // public isAppReady = false;
  constructor(public db: DataBaseService) {
    this.db.loadData.then(res => {
      this.db.isDataFetched = true;
    })
  }

}
