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
  filter,
} from 'rxjs/operators';
import { ListingService } from '../common/listing.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css'],
})
export class ListingComponent implements OnInit, AfterViewInit {
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
  model: string;
  constructor(
    private readonly listingService: ListingService,
    private router: Router,
  ) {
    this.router.events
      .pipe(filter(route => route instanceof NavigationEnd))
      .subscribe((route: NavigationEnd) => {
        this.model = route.url.split('/')[1];
      });
  }

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
          return this.listingService.getModels(
            this.paginator.pageIndex,
            this.paginator.pageSize,
            this.search.value,
            this.model,
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
