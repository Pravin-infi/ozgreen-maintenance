import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent {
  userData: any[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  isLoadingTeam: boolean = true;;

  constructor(
    private builder: FormBuilder, 
    private router: Router,
    private api: ApiService, 
    private toastr: ToastrService ,
    private datePipe: DatePipe
  ) { }


  ngOnInit() {
    this.setSiteNameBasedOnCoordinates();
  }
  setSiteNameBasedOnCoordinates() {    
    this.api.getRequest('auth').subscribe(item => {
      this.userData = item
    })
  }

  // pagination related code start
  getPaginatedUsersData(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.userData.slice(startIndex, endIndex);
  }

  totalPages(): number {
    return Math.ceil(this.userData.length / this.itemsPerPage);
  }
  
  previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
  }
  
  nextPage() {
      if (this.currentPage < this.totalPages()) {
        this.currentPage++;
      }
  }
  // pagination related code end


  changestatus(id: string){
    this.api.getRequest('auth/'+ id).subscribe(item => {
      console.log(item);
      this.setSiteNameBasedOnCoordinates();
      
    })
  }

}
