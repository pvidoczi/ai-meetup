import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tf from '@tensorflow/tfjs';
import {Prediction} from "../app.component";

@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss']
})
export class WebcamComponent implements OnInit, AfterViewInit {
  @ViewChild('video') video: ElementRef | undefined;
  predictions: Prediction[] | undefined;
  model: any;
  loading = true;
  constructor() { }

  async ngOnInit() {
    console.log('loading mobilenet model...');
    this.model = await mobilenet.load({version: 2, alpha: 1.0});
    console.log('Sucessfully loaded model');
    this.loading = false;

    setInterval(async () => {
      // @ts-ignore
      this.predictions = await this.model.classify(this.video.nativeElement);
      await tf.nextFrame();
    }, 3000);
  }



  async ngAfterViewInit() {
    // @ts-ignore
    const vid = this.video.nativeElement;

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          vid.srcObject = stream;

        })
        .catch((err0r) => {
          console.log('Something went wrong!');
        });
    }
  }
}
