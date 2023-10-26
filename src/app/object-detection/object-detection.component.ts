import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Injector,
  Renderer2,
  ViewChild
} from '@angular/core';
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

@Component({
  selector: 'app-object-detection',
  templateUrl: './object-detection.component.html',
  styleUrls: ['./object-detection.component.scss']
})
export class ObjectDetectionComponent {
  @ViewChild('video') video: ElementRef | undefined;
  predictions: any[] | undefined;
  model: any;
  loading = true;
  @ViewChild('liveView', {static: false}) liveView: ElementRef<HTMLElement> | undefined;


  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer:Renderer2,
    private appRef: ApplicationRef,
  ) { }

  async ngOnInit() {
    console.log('loading mobilenet model...');
    this.model = await cocoSsd.load();
    console.log('Sucessfully loaded model');
    this.loading = false;

    setInterval(async () => {
      // @ts-ignore
      this.predictions = await this.model.detect(this.video.nativeElement);
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
      // @ts-ignore
      this.predictions.forEach(prediction => {
        this.createDetectedObjectElement(prediction);
      })
      await tf.nextFrame();
    }, 500);
  }

  // Create a function that creates and html element and append it to lifeView
  private createDetectedObjectElement(prediction: any) {
    const score = Math.round(prediction.score * 100);

    // Create a label element
    const label = document.createElement('div');
    label.classList.add('label');
    label.innerText = `${prediction.class} ${score}%`;

    // Create a wrapper element
    const wrapper = document.createElement('div');
    wrapper.classList.add('wrapper');
    wrapper.style.position = 'absolute';
    wrapper.style.left = `${prediction.bbox[0]}px`;
    wrapper.style.top = `${prediction.bbox[1]}px`;
    wrapper.style.width = `${prediction.bbox[2]}px`;
    wrapper.style.height = `${prediction.bbox[3]}px`;
    wrapper.style.border = 'solid 1px #FFF';
    wrapper.style.backgroundColor = 'rgba(212, 255, 184, 0.27)';

    // Append the label and wrapper to the liveView element
    wrapper.appendChild(label);
    this.liveView?.nativeElement.appendChild(wrapper);
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
