/*
 * Copyright (c) 2020 the original author or authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

import { Store } from '@ngrx/store';
import { ChangeDetectionStrategy } from '@angular/core';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppState } from 'src/app/store';
import { uploadFace } from 'src/app/store/model/actions';
import { AVAILABLE_IMAGE_EXTENSIONS, MAX_IMAGE_SIZE, getFileExtension } from 'src/app/core/constants';
import { SnackBarService } from '../snackbar/snackbar.service';
import { selectPendingModel } from 'src/app/store/model/selectors';

@Component({
  selector: 'app-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadDialogComponent {
  initialName: string;
  apiKey: string;
  subject: string;
  files: Array<File>;
  fileAttr: string = 'Choose File';

  get isUploadDisabled(): any {
    return !this.subject || !this.files || this.files.length == 0;
  }

  constructor(private store: Store<AppState>,
    public dialogRef: MatDialogRef<UploadDialogComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any, 
  private snackBarService: SnackBarService) {
    this.initialName = data.entityName;
    this.apiKey = data.apiKey;
  }

  subjectEvt(event: any) {
    this.subject = event.target.value
  }

  uploadFileEvt(imgFile: any) {
    let fs = imgFile.target.files
    if (fs && fs.length > 0) {
      this.fileAttr = ''
      this.files = []

      Array.from(fs).forEach((file: File) => {
        if (!AVAILABLE_IMAGE_EXTENSIONS.includes(getFileExtension(file))) {
          this.snackBarService.openNotification({
            messageText: 'face_collection.file_unavailable_extension',
            messageOptions: {filename: file.name},
            type: 'error'
          });
        } else if (file.size > MAX_IMAGE_SIZE) {
          this.snackBarService.openNotification({ messageText: 'face_collection.file_size_error', type: 'error' });
        } else {
          this.files.push(file)
        }
      });

      this.fileAttr += this.files[0].name;
    } else {
      this.fileAttr = 'Choose File';
    }
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onUploadClick(): void {
    if (!this.subject) {
      this.snackBarService.openNotification({
        messageText: 'face_collection.subject_empty',
        type: 'error'
      });
      return
    }

    if (this.files && this.files.length > 0) {
        this.store.dispatch(
        uploadFace({
        apiKey: this.apiKey,
        subject: this.subject,
        file: this.files[0]
      }))
      
    }

    this.dialogRef.close();
  }
}
