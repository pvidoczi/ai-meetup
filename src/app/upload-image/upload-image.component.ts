import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as mobilenet from "@tensorflow-models/mobilenet";
import {Prediction} from "../app.component";

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent implements OnInit{
  imageSrc: string | undefined;
  @ViewChild('img') imageEl: ElementRef | undefined;

  predictions: Prediction[] = [];

  model: any;
  loading = true;


  constructor() { }

  async ngOnInit() {
    console.log('loading mobilenet model...');
    this.model = await mobilenet.load();
    console.log('Sucessfully loaded model');
    this.loading = false;
  }

  async fileChangeEvent(event: any) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (res: any) => {
        this.imageSrc = res.target.result;
        setTimeout(async () => {
          // @ts-ignore
          const imgEl = this.imageEl.nativeElement;
          this.predictions = await this.model.classify(imgEl);
        }, 0);

      };
    }

  }
}
