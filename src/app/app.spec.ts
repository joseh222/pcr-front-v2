import { TestBed } from '@angular/core/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App]
    }).compileComponents();
  });

  it('should create the application', () => {
    const fixture = TestBed.createComponent(App);

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the application title', () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('PCR Front V2');
  });

  it('should render the Angular Material verification button', async () => {
    const fixture = TestBed.createComponent(App);

    fixture.detectChanges();

    const loader =
      TestbedHarnessEnvironment.loader(fixture);

    const button =
      await loader.getHarness(
        MatButtonHarness.with({
          text: 'Material listo'
        })
      );

    expect(await button.getText())
      .toBe('Material listo');
  });
});