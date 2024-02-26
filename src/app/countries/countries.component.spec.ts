import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from  '@angular/common/http/testing';
import { CountriesComponent } from '../countries/countries.component';

import * as d3 from "d3";

describe('CountriesComponent', () => {
  let component: CountriesComponent;
  let fixture: ComponentFixture<CountriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [ CountriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have svg element', (() => {
    const spy = spyOn(component, "parseCSVAndBuildDiagram");
    component.parseCSVAndBuildDiagram();
    expect(component.parseCSVAndBuildDiagram).toHaveBeenCalled();
  }));
});
