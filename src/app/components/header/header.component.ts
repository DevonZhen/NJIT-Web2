import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import moment from 'moment';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  currentTime: string = moment().format('M/D/YY hh:mm a');
  display = true;
  constructor() {
  }
}
