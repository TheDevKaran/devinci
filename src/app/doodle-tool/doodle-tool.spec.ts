import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoodleTool } from './doodle-tool';

describe('DoodleTool', () => {
  let component: DoodleTool;
  let fixture: ComponentFixture<DoodleTool>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoodleTool]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoodleTool);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
