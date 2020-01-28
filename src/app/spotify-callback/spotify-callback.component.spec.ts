import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyCallbackComponent } from './spotify-callback.component';

describe('SpotifyCallbackComponent', () => {
  let component: SpotifyCallbackComponent;
  let fixture: ComponentFixture<SpotifyCallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpotifyCallbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpotifyCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
