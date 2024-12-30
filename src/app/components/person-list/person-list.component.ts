import { Component, inject, OnInit } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';
import { personList } from '../../interfaces/personList';
import { CommonModule } from '@angular/common';

export interface PeriodicElement {
  firstName: number;
  lastName: string;
  ssn: number;
  birthday: string;
  personType: string;
  phone: string;
}


@Component({
  selector: 'app-person-list',
  imports: [MatTableModule, MatSelectModule, MatInputModule, MatFormFieldModule, CommonModule, RouterLink],
  templateUrl: './person-list.component.html',
  styleUrl: './person-list.component.css'
})
export class PersonListComponent implements OnInit{
  displayedColumns: string[] = ['firstName', 'lastName', 'ssn', 'birthday', 'personType', 'phone', 'delete'];
  dataSource;

  personList: personList[] =[];
  result:any;

  private apiService = inject(DataService);

  //Adding the service (ie. apiService) in the constructor is also an option
  constructor(){}
  
  ngOnInit() {
    this.getPerson();
  }

  getPerson(){
    this.apiService.getPersonAllData().subscribe((data: any)=>{
      this.dataSource = data;
      this.result = JSON.stringify(data);
      // console.log("Results: "+JSON.stringify(this.dataSource))
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onClickDelete(id: any){
    console.log("Deleting Person "+id);
  }
}
