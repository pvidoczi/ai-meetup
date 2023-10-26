import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UploadImageComponent } from './upload-image/upload-image.component';
import { WebcamComponent } from './webcam/webcam.component';
import { ObjectDetectionComponent } from './object-detection/object-detection.component';
import { FaceDetectionComponent } from './face-detection/face-detection.component';

@NgModule({
  declarations: [
    AppComponent,
    UploadImageComponent,
    WebcamComponent,
    ObjectDetectionComponent,
    FaceDetectionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
