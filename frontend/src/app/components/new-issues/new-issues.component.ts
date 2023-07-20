
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject, map, startWith } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
declare var google: any;
@Component({
  selector: 'app-new-issues',
  templateUrl: './new-issues.component.html',
  styleUrls: ['./new-issues.component.scss']
})
export class NewIssuesComponent implements OnInit {
  public cameraPermissionGranted = false;
  readonly imageTrigger: Subject<void> = new Subject<void>();
  error?: string;
  
  buttonTimestamp: any;
  formattedTimestamp: any;
  siteName: any;  
  siteData: any[] = [];
  google: any;
  result: any;
  issues: any;
  issueId: any
  notes: any;
  postedByName: any
  myFiles: string[] = [];
  data: any[] = [];
  webcamId!: string; 
  webcam: string | any ;
  imageSource: string = '';
  isCaptured: any;
  mySiteName = new FormControl();
  filteredOptions: any;
  sysImage: any;
  
  constructor(private api: ApiService, private toastr: ToastrService, private router: Router,private builder: FormBuilder, ) {}
  
  
  ngOnInit() { 

    

    this.setSiteNameBasedOnCoordinates();
    this.onButtonPress()
    

    //this.filteredOptions = this.mySiteName.valueChanges.pipe(startWith(),map(value => this._filter(value)));


  }

  
  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.siteData.filter(option => option.sitename.toLowerCase().includes(filterValue));
  // }

  setSiteNameBasedOnCoordinates() {
    
    this.api.getRequest('site-name').subscribe(item => {
      this.siteData = item;
      this.filteredOptions = item
      console.log(item);

    })

  }
  
  onButtonPress() {
    const datetimeWithZone = new Date().toLocaleString('en-GB', { timeZone: 'Australia/Brisbane',  year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });

    this.buttonTimestamp = datetimeWithZone;
  }

  proceedData() {
    if(this.notes==undefined){
      this.toastr.warning('Please Write Your Notes.')
      return;
    }
    if(this.postedByName==undefined){
      this.toastr.warning('Please Enter Your Name.')
      return;
    }
    //postedByName
    let paylod: any = {
      site_name: this.mySiteName.value,
      timestamp: this.buttonTimestamp,
      postedByName: this.postedByName,
      user_id: sessionStorage.getItem('userid')
    }
    //console.log(paylod);

    this.api.postRequest('issue/new', paylod ).subscribe((item: any) => {      
      this.result = item; 
      if (this.result) {
        this.issueId = this.result._id
        this.saveNotes()
        this.uploadFile()
        if(this.webcam != undefined){
          this.capturedImageUpload()
        }
        this.toastr.success('issue create succesfully ');
        this.router.navigate(['home']);
      } else {
        this.toastr.error('Some thing is wrong');
      }
    },()=> {        
      this.toastr.warning('Please enter valid data.')
    });
    
  }

  saveNotes() {
    
      let paylod: any = {
        issue_id: this.issueId,
        notes: this.notes,
        user_id: sessionStorage.getItem('userid')
      }
      console.log(paylod);
      this.api.postRequest('issue-notes/new', paylod ).subscribe((item: any) => {
        this.result = item; 
        if (this.result) {
          console.log(this.result);        
        } else {
          console.log('Some thing is wrong');
        }
      },()=> {        
        console.log('Please enter valid file data.')
      });
    
  }

  getFileDetails(e: any) {
    
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
    
  }
  uploadFile() {
    //console.log(this.myFiles);
    if(this.myFiles.length > 0){
      const frmData = new FormData();
      
      for (var i = 0; i < this.myFiles.length; i++) { 
        frmData.append("files", this.myFiles[i]);

      }
      frmData.append("issue_id", this.issueId);

      console.log(frmData);
      
      this.api.postRequest('upload', frmData ).subscribe((item: any) => {
        // console.log(item);
        this.result = item; 
        if (this.result) {
          console.log(this.result);        
        } else {
          console.log('Some thing is wrong');
        }
      },()=> {        
        console.log('Please enter valid file data.')
      });
    }
  }
  
  public requestCameraPermission(): void {
    this.cameraPermissionGranted = true;
  }

  captureImage(webcamImage: WebcamImage): void {
    
    this.webcam = webcamImage.imageAsBase64;
    document.getElementById('webcamId')!.style.display ='none';
    this.imageSource = "data:image/png;base64," + webcamImage.imageAsBase64;
  }

  triggerSnapshot(): void {
    this.isCaptured = true;
    this.imageTrigger.next();
  }

  handleInitError(error: WebcamInitError): void {
    console.warn(error);
    this.error = JSON.stringify(error);
  }

  removeCurrent() {
    
    document.getElementById('webcamId')!.style.display ='inline';
    this.isCaptured = false;
  }
  
  removeCameraPermission(): void {
    this.cameraPermissionGranted = false;
    this.isCaptured = false;
    console.log("ngOnDestroy completed");
  }

  capturedImageUpload() {
    let paylod: any = {
      issue_id: this.issueId,
      binaryImage: 'data:image/png;base64,' + this.webcam,
    }    
    this.cameraPermissionGranted = false;   
    this.api.postRequest('upload/capture', paylod ).subscribe((item: any) => {
      console.log(item);
      this.result = item; 
      if (this.result) {
        console.log(this.result);        
      } else {
        console.log('Some thing is wrong');
      }
    },()=> {        
      console.log('Please enter valid file data.')
    });
  }
}
