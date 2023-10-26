import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UploadImageComponent} from "./upload-image/upload-image.component";
import {WebcamComponent} from "./webcam/webcam.component";
import {ObjectDetectionComponent} from "./object-detection/object-detection.component";
import {FaceDetectionComponent} from "./face-detection/face-detection.component";

const routes: Routes = [
  { path: 'upload-image', component: UploadImageComponent },
  { path: 'webcam', component: WebcamComponent},
  { path: 'object-detection', component: ObjectDetectionComponent},
  { path: 'face-detection', component: FaceDetectionComponent},
  { path: '', redirectTo: '/upload-image', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
