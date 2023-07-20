import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Observable, map, startWith } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(
    private builder: FormBuilder, 
    private router: Router,
    private api: ApiService, 
    private toastr: ToastrService ,
    private datePipe: DatePipe
  ) { }
  
  selectedDate!: Date;
  tableData: any;
  data: any;
  dtOptions: any;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement!: DataTableDirective;
  postedByArray: any[] = [];
  postedControl = new FormControl();
  filteredByOptions: any;
  siteData: any[] = [];
  filteredOptions: any;
  mySiteName = new FormControl();
  filteredData:any
  searchName = new FormControl();


  ngOnInit() {  
   
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        paginate: {
          first: '',
          last: '',
          next: '<div class="right-arrow"><svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" id="right-arrow"> <path d="M17.92,11.62a1,1,0,0,0-.21-.33l-5-5a1,1,0,0,0-1.42,1.42L14.59,11H7a1,1,0,0,0,0,2h7.59l-3.3,3.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l5-5a1,1,0,0,0,.21-.33A1,1,0,0,0,17.92,11.62Z"> </path> </svg></div>',
          previous: '<div class="left-arrow"><svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24" id="left-arrow"> <path d="M17,11H9.41l3.3-3.29a1,1,0,1,0-1.42-1.42l-5,5a1,1,0,0,0-.21.33,1,1,0,0,0,0,.76,1,1,0,0,0,.21.33l5,5a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L9.41,13H17a1,1,0,0,0,0-2Z"> </path> </svg></div>'
        }
      },
      pageLength: 5,
      processing: true,      
      aaSorting: [],
      dom: 'tp',
      columns: [
        { title: 'S.No', data: 'sNo' },
        { title: 'Site Name', data: 'site_name' },
        { title: 'Time Stamp', data: 'timestamp',
          render: (data: any, type: any, row: any) => {
            return this.convertDateFormat(data);
          } 
        },
        { title: 'Text', data: 'issuenotes',
          render: (data: any) => {
            return (data[data.length-1].notes)??'';
          }  
        },
        { title: 'Posted By', data: 'postedByName',
          render: (data: any) => {
            return data ?? '';
          }  
        },
        { title: 'Action', data: '_id',
        render: (data: any) => {
          return `<a href='/logIssue/${data}'  class='btn btn-primary btn-sm'><i class="fas fa-eye"></i> View</a>`;
        }
      },        
      ],
    };
    this.loadData();
    this.setSiteNameBasedOnCoordinates()

    // this.filteredOptions = this.mySiteName.valueChanges.pipe(startWith(''),map(value => this._filter(value)));

    // this.filteredByOptions = this.postedControl.valueChanges.pipe(startWith(''),map(value => this._filters(value)));

  }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   return this.siteData.filter(option => option.sitename.toLowerCase().includes(filterValue));
  // }

  // private _filters(value: string): string[] {
  //   const filterValues = value.toLowerCase();
  //   return this.postedByArray.filter(option => option.toLowerCase().includes(filterValues));
  // }
  
  setSiteNameBasedOnCoordinates() {    
    this.api.getRequest('site-name').subscribe(item => {
      this.siteData = item;
      this.filteredOptions = item
    })
  }

  
  loadData() {
    this.api.getRequest('issue').subscribe(item => {
      this.tableData = item;
      this.postedByArray = [...new Set(this.tableData.map((items: { postedByName: any; }) => (items.postedByName)??'All'))];
      console.log(this.postedByArray);
      this.filteredByOptions = this.postedByArray
      
      if (this.tableData) {    
        if (this.datatableElement) {
          this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
            dtInstance.clear();
            const newData = this.tableData.map((rowData: any, index: number) => {
              rowData.sNo = index + 1;
              return rowData;
            });
            //dtInstance.rows.add(this.tableData);
            dtInstance.rows.add(newData);
            dtInstance.draw();
          });
        }
      }    
    })
  }

siteFilter() {
  console.log(this.postedControl.value);
  
  
  if((this.selectedDate) && (this.mySiteName.value)){
    
      const selectdate1 = this.selectedDate.toLocaleString('en-GB', { timeZone: 'Australia/Brisbane',  year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
      const dateArray1 = selectdate1.split(",")[0].split("/");
      const year1 = parseInt(dateArray1[2], 10);
      const month1 = parseInt(dateArray1[1], 10);
      const day1 = parseInt(dateArray1[0], 10);
      const selectDateData = `${day1}/${month1}/${year1}`;
      
      this.filteredData = this.tableData.filter((item: any) => {
        const dateArray = item.timestamp.split(",")[0].split("/");
        const year = parseInt(dateArray[2], 10);
        const month = parseInt(dateArray[1], 10);
        const day = parseInt(dateArray[0], 10);    
        const getDateData = `${day}/${month}/${year}`;
          
        return (selectDateData == getDateData) && (item.site_name == this.mySiteName.value)
      })
    }else if((this.selectedDate) && (this.mySiteName.value==null)){
      
      const selectdate1 = this.selectedDate.toLocaleString('en-GB', { timeZone: 'Australia/Brisbane',  year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
      const dateArray1 = selectdate1.split(",")[0].split("/");
      const year1 = parseInt(dateArray1[2], 10);
      const month1 = parseInt(dateArray1[1], 10);
      const day1 = parseInt(dateArray1[0], 10);
      const selectDateData = `${day1}/${month1}/${year1}`;
      
      this.filteredData = this.tableData.filter((item: any) => {
        const dateArray = item.timestamp.split(",")[0].split("/");
        const year = parseInt(dateArray[2], 10);
        const month = parseInt(dateArray[1], 10);
        const day = parseInt(dateArray[0], 10);    
        const getDateData = `${day}/${month}/${year}`;   
        return (selectDateData == getDateData)
      })
    }else if (this.searchName.value) {
      this.filteredData = this.tableData.filter((item: any) => {
        return item.issuenotes.some((note: any) => note.notes.toLowerCase().includes(this.searchName.value.toLowerCase()) );
      });
    }else if (this.postedControl.value) {
      this.filteredData = this.tableData.filter((item: any) => {
        if(this.postedControl.value === 'All'){
          return this.tableData
        } 
          return (item.postedByName == this.postedControl.value)
      })
    }else if(this.mySiteName.value){        
      this.filteredData = this.tableData.filter((item: any) => {  
        return (item.site_name == this.mySiteName.value)
      })
    }

    if (this.datatableElement) {
      this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.clear();
        const newData = this.filteredData.map((rowData: any, index: number) => {
          rowData.sNo = index + 1;
          return rowData;
        });
        dtInstance.rows.add(newData);
        dtInstance.draw();
      });
    }
    
  }
  convertDateFormat(dateString: string): string {
    if (!dateString) {
      return ''; // or handle the case when the dateString is not provided
    }
    const inputDateTime = moment(dateString, 'DD/MM/YYYY, h:mm:ss a');
    const formattedDateTime = inputDateTime.format('h:mm a, ddd., MMM Do YYYY');
    return ` ${formattedDateTime}`;
  }
  

  
}
