import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from  '@angular/common/http/testing';
import { CountriesComponent } from '../countries/countries.component';
import { of } from 'rxjs';

import { DiagramService } from '../diagram.service';

describe('CountriesComponent', () => {
  let component: CountriesComponent;
  let fixture: ComponentFixture<CountriesComponent>;

  let service: DiagramService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [DiagramService],
      declarations: [ CountriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    service = TestBed.inject(DiagramService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have csv parse', (() => {

    const response: string = "#  \r\n# Start date: 20231001\r\n# End date: 20231031\r\nCountry ID,Users\r\nAE,85\r\nAT,3734\r\nAU,115\r\nBA,41\r\nBE,302\r\nBR,71\r\nCA,327\r\nCH,823\r\nCN,110\r\nCY,111\r\nCZ,230\r\nDE,5476\r\nDK,185\r\nEG,135\r\nES,538\r\nFI,103\r\nFR,635\r\nGB,2050\r\nGR,120\r\nHR,135\r\nHU,288742\r\nID,1043\r\nIE,460\r\nIL,42\r\nIS,37\r\nIT,533\r\nJP,42\r\nLU,92\r\nMT,88\r\nNL,997\r\nNO,135\r\nNZ,217\r\nPL,173\r\nPT,92\r\nRO,2886\r\nRS,778\r\nSE,571\r\nSI,57\r\nSK,3172\r\nTH,49\r\nTR,213\r\nUA,320\r\nUS,1722";

    spyOn(service, "getDiagram").and.returnValue(of(response));

    component.parseCSVAndBuildDiagram();

    expect(component.dataArray).toBeDefined();

    expect(component.dataArray.length).toBe(component.contries.length);
    
  }));
});
