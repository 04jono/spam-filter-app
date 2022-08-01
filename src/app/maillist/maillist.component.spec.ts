import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaillistComponent } from './maillist.component';

describe('MaillistComponent', () => {
  let component: MaillistComponent;
  let fixture: ComponentFixture<MaillistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaillistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaillistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
