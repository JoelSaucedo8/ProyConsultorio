import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeUsuariosComponent } from './home-usuario.component';

describe('HomeUsuarioComponent', () => {
  let component: HomeUsuariosComponent;
  let fixture: ComponentFixture<HomeUsuariosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeUsuariosComponent]
    });
    fixture = TestBed.createComponent(HomeUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
