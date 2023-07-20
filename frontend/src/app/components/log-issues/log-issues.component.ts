import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject, map, startWith } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environment/environment';
declare var window: any;

declare var $: any; 
@Component({
  selector: 'app-log-issues',
  templateUrl: './log-issues.component.html',
  styleUrls: ['./log-issues.component.scss']
})
export class LogIssuesComponent {
  apiUrl = environment.baseUrl
  public cameraPermissionGranted = false;
  readonly imageTrigger: Subject<void> = new Subject<void>();
  error?: string;
  webcamId!: string; 
  webcam: string | any ;
  logIssueId = this.route.snapshot.params['id'];
  buttonTimestamp: any;
  postedBy: any
  notes: any;
  myFiles: string[] = [];
  siteData: any[] = [];
  filteredOptions: Observable<any[]> | undefined;
  result: any;
  data: any[] = [];
  currentIndex: number = -1;
  issuesImagelog: any;
  mySiteName = new FormControl({value: '', disabled: true});
  sysImage: any;
  isCaptured: any;
  imageSource: string = '';
  formModal: any;
  imgSrc: any;
  imageId: any;

  constructor(private api: ApiService, private toastr: ToastrService, private route: ActivatedRoute, private router: Router) {}
  
  ngOnInit() { 

    this.getSiteNameBasedOnCoordinates()

    this.filteredOptions = this.mySiteName.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );

      this.formModal = new window.bootstrap.Modal(
        document.getElementById('myModal3')
      );

  }
  private _filter(value: any): any[] {
    const filterValue = value.toLowerCase();

    return this.siteData.filter(option => option.sitename.toLowerCase().includes(filterValue));
  }
  getSiteNameBasedOnCoordinates(){
    
    return this.api.getRequest('issue/'+ this.logIssueId).subscribe((res: any) => {
      this.result = res;
      this.data = [];
      const inputDateTime = moment(this.result[0].timestamp, 'DD/MM/YYYY, h:mm:ss a');
      const formattedDateTime = inputDateTime.format('h:mm a, ddd., MMM Do YYYY');
      
      this.buttonTimestamp = formattedDateTime
      
      this.postedBy = this.result[0].postedByName     
      this.issuesImagelog =  this.result[0].uploads;
      this.mySiteName.patchValue(this.result[0].site_name);
      
      this.data.push(...this.result[0].issuenotes);
      this.currentIndex = this.data.length - 1;
      this.notes = this.data[this.currentIndex].notes
          

    });
  }
  
  
  undo(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.notes =this.data[this.currentIndex].notes
    }
  }

  redo(): void {
    if (this.currentIndex < this.data.length - 1) {
      this.currentIndex++;
      this.notes =this.data[this.currentIndex].notes
    }
  }

  proceedLogData() {   
    if(this.notes != undefined){     
      let paylod: any = {
        issue_id: this.logIssueId,
        notes: this.notes,
        user_id: sessionStorage.getItem('userid')
      }
      console.log(sessionStorage.getItem('userid'),paylod);
      this.api.postRequest('issue-notes/new', paylod ).subscribe((item: any) => { 
        if (item) {
          console.log(item); 
          this.toastr.success('issue updated succesfully ');
          this.router.navigate(['home']);       
        }
      },()=> {        
        console.log('Please enter valid file data.')
      });
    }else{
      this.toastr.warning('Please enter some notation.')
    }
    // here image store api 
    if(this.myFiles.length > 0){
      const frmData = new FormData();
      
      for (var i = 0; i < this.myFiles.length; i++) { 
        frmData.append("files", this.myFiles[i]);

      }
      frmData.append("issue_id", this.logIssueId);      
      this.api.postRequest('upload', frmData ).subscribe((item: any) => {
        if (item) {
          console.log(item);        
        }
      },error =>{        
        console.log(error)
      });
    }
    
  }

  getFileDetails(e: any) {
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
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
      issue_id: this.logIssueId,
      binaryImage: 'data:image/png;base64,' + this.webcam,
    }
    this.cameraPermissionGranted = false;  
    this.api.postRequest('upload/capture', paylod ).subscribe((item: any) => {
      console.log(item);
      this.getSiteNameBasedOnCoordinates()
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

  

  deleteIssueData(){    
    return this.api.deleteRequest('issue/'+ this.logIssueId).subscribe((res: any) => {     
      console.log(res); 
      if(res){
        this.toastr.success('Issue updated succesfully ');
        this.router.navigate(['home']);
      }else{
        this.toastr.warning('Some thing is wrong.')
      }
    });
  }

  openFormModal(thisimgSrc:any) {
    this.imgSrc = thisimgSrc.target.currentSrc;
    let filename1 = this.imgSrc.substring(this.imgSrc.lastIndexOf('/') + 1);    
    let objData = this.issuesImagelog.find((itemId:any) => itemId.fileName == filename1) 
    this.imageId = objData._id   
    this.formModal.show();
  }

  deleteImage(){
    return this.api.deleteRequest('upload/'+ this.imageId).subscribe((res: any) => {
      this.getSiteNameBasedOnCoordinates()
      this.toastr.success('File delete succesfully ');      
    })
  }

}


