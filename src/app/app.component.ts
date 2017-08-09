import { Component } from '@angular/core';
import { FileInfo, FileRestrictions, SuccessEvent, RemoveEvent, UploadEvent } from '@progress/kendo-angular-upload';
import { Headers } from '@angular/http';
import { FormUploadService } from './services/';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  uploadSaveUrl: string = 'http://localhost:3000/api/file';
  uploadRemoveUrl: string = 'http://localhost:3000/api/remove';
  formEndpoint: string = 'http://localhost:3000/api/form';
  uploadedImageUrl: string;
  uploadedImageUid: string;
  uploadedBy: string;
  results: boolean = false;

  public myRestrictions: FileRestrictions = {
    allowedExtensions: ['jpg', 'jpeg', 'png']
  };

  public userName: string;
  public userImages: Array<FileInfo>;

  constructor(private formUploadService: FormUploadService) { }

  onSuccess(event: SuccessEvent) {
    this.uploadedImageUrl = event.response['_body'];
  }

  onUpload(event: UploadEvent) {
    event.data = {
      uid: event.files[0].uid
    };
  }

  onRemove(event: RemoveEvent) {
    event.data = {
      uid: event.files[0].uid
    };
  }

  save(value: any, valid: boolean) {
    if (valid) {
      let file = this.userImages[0];
      let postData = {
        userName: this.userName,
        fileUid: file.uid,
        fileName: file.name,
        fileUrl: this.uploadedImageUrl
       };

      this.formUploadService.postForm(
        this.formEndpoint,
        postData)
        .subscribe(result => {
          this.uploadedImageUrl = result.url;
          this.uploadedImageUid = result.fileUid;
          this.uploadedBy = result.username;
          this.results = true;
        });
    }
  }
}
