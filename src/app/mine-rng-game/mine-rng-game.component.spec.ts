import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MineRngGameComponent } from './mine-rng-game.component';

describe('MineRngGameComponent', () => {
  let component: MineRngGameComponent;
  let fixture: ComponentFixture<MineRngGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MineRngGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MineRngGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
