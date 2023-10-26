import {
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import * as facedet from '@tensorflow-models/blazeface';
// import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';


@Component({
  selector: 'app-face-detection',
  templateUrl: './face-detection.component.html',
  styleUrls: ['./face-detection.component.scss']
})
export class FaceDetectionComponent {
  model: any;
  loading: boolean = false;
  img: any;
  predictions: any;
  videoShow = false;
  streamGlobal:any;

  constructor() {}

  @ViewChild('vidEl') video: ElementRef<HTMLVideoElement> | undefined;
  @ViewChild('canvEl') canvas: ElementRef<HTMLCanvasElement> | undefined;
  @ViewChild('liveView', {static: false}) liveView: ElementRef<HTMLElement> | undefined;


  async ngOnInit() {
    this.loading = true;
    this.model = await facedet.load();
    this.loading = false;

    setTimeout(() => {
        setInterval(async () => {
          // @ts-ignore
          this.model.estimateFaces(this.video.nativeElement).then((predictions: any) => {
              console.log(predictions);
              this.addFace(predictions);
            }
          );
        }, 100);
    }, 2000);
  }

  addFace(predictions: any) {
    this.clearHeads();
    predictions.forEach((prediction: any) => {
        const head = document.createElement('div');
        head.style.position = 'absolute';
        head.style.top = `${prediction.topLeft[1]}px`;
        head.style.left = `${prediction.topLeft[0]}px`;
        head.style.width = `${prediction.bottomRight[0] - prediction.topLeft[0]}px`;
        head.style.height = `${prediction.bottomRight[1] - prediction.topLeft[1]}px`;
        //head.style.border = '2px solid red';
        head.style.backgroundImage = 'url(../../assets/head.png)';
        head.style.backgroundPosition = 'center';
        head.style.backgroundSize = 'cover';

        this.liveView?.nativeElement.appendChild(head);
    }
    );

  }

  clearHeads() {
    const elementListLength = this.liveView?.nativeElement.children.length;
    // @ts-ignore
    for (let i = 1; i < elementListLength; i++) {
      // @ts-ignore
      if(this.liveView?.nativeElement.children.length < 2) {
        break;
      }
      this.liveView?.nativeElement.removeChild(this.liveView?.nativeElement.children[i]);
      i--;
      //this.liveView?.nativeElement.removeChild(this.liveView?.nativeElement.children[i]);
    }
  }

  ngAfterViewInit() {
    // @ts-ignore
    const videoEl = this.video.nativeElement;
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          this.streamGlobal = stream
          videoEl.srcObject = stream;
        })
        .catch((error) => {
          console.log('Error: ', error);
        });
    }
  }

  async fileChange(event: { target: { files: any[] } }) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = (res: any) => {
        this.img = res.target.result;
        console.log(this.img);
      };
    }
  }
}
