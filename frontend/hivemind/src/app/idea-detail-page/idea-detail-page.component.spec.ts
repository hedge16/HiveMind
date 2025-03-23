import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaDetailPageComponent } from './idea-detail-page.component';

describe('IdeaDetailPageComponent', () => {
  let component: IdeaDetailPageComponent;
  let fixture: ComponentFixture<IdeaDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeaDetailPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdeaDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
