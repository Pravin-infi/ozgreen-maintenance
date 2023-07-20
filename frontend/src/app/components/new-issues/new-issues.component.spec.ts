import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewIssuesComponent } from './new-issues.component';

describe('NewIssuesComponent', () => {
  let component: NewIssuesComponent;
  let fixture: ComponentFixture<NewIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewIssuesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
