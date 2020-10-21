import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ClaimsListingDataSource } from './claims-listing-datasource';
import { ClaimsListingService } from './claims-listing.service';

@Component({
  selector: 'claims-listing',
  templateUrl: './claims-listing.component.html',
  styleUrls: ['./claims-listing.component.css'],
})
export class ClaimsListingComponent {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: ClaimsListingDataSource;
  stringify = JSON.stringify;
  @Input('uuid') uuid: string;

  displayedColumns = ['name', 'scope', 'value'];
  search: string = '';

  constructor(private listingService: ClaimsListingService) {}

  ngOnInit() {
    this.dataSource = new ClaimsListingDataSource(
      this.listingService,
      this.uuid,
    );
    this.dataSource.loadItems();
  }

  getUpdate(event) {
    this.dataSource.loadItems(
      this.search,
      this.sort.direction,
      event.pageIndex,
      event.pageSize,
    );
  }

  setFilter() {
    this.dataSource.loadItems(
      this.search,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
    );
  }

  snakeToTitleCase(string: string) {
    if (!string) return;

    return string
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
