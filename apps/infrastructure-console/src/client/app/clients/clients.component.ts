import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { merge, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';
import { ClientService } from '../client/client.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css'],
})
export class ClientsComponent implements OnInit, AfterViewInit {
  displayedColumns = ['name'];

  dataSource = new MatTableDataSource();
  resultsLength = 0;
  _isLoadingResults = true;
  _hasError = false;
  errorText = '';
  _skipLoading = false;

  search = new FormControl('');

  @ViewChild(MatPaginator)
  paginator: MatPaginator;
  @ViewChild(MatSort)
  sort: MatSort;

  constructor(private readonly clientService: ClientService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    if (this._skipLoading) {
      return;
    }

    merge(
      this.sort.sortChange,
      this.paginator.page,
      this.search.valueChanges.pipe(debounceTime(1000)),
    )
      .pipe(
        startWith({}),
        switchMap(() => {
          this._isLoadingResults = true;
          return this.clientService.getClients(
            this.paginator.pageSize,
            this.paginator.pageIndex,
            this.search.value,
          );
        }),
        map((data: any) => {
          this._isLoadingResults = false;
          this._hasError = false;
          this.resultsLength = data.length;
          return data.docs;
        }),
        catchError(err => {
          this._isLoadingResults = false;
          this._hasError = true;
          this.errorText = err;
          return of([]);
        }),
      )
      .subscribe(data => (this.dataSource.data = data));
  }

  get isLoadingResults() {
    return this._isLoadingResults;
  }

  get hasError() {
    return this._hasError;
  }
}
