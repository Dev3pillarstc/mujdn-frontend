import { ComponentFixture, TestBed } from '@angular/core/testing'
import { AppComponent } from './app.component'

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>
  let app: AppComponent
  let ele: HTMLElement
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents()
    fixture = TestBed.createComponent(AppComponent)
    app = fixture.componentInstance
    ele = fixture.nativeElement as HTMLElement
  })

  it('should create the app', () => {
    expect(app).toBeTruthy()
  })

  it(`should have router-outlet component`, () => {
    expect(ele.querySelector('router-outlet')).toBeTruthy()
  })
})
