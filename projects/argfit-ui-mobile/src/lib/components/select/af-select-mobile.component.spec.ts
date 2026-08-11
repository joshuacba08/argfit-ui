import { TestBed } from '@angular/core/testing';
import { provideIonicAngular } from '@ionic/angular/standalone';

import type { AfSelectLoadMoreEvent } from '@argfit-ui/core';

import { AfSelectMobileComponent } from './af-select-mobile.component';

describe('AfSelectMobileComponent', () => {
  it('emits one load request per page and stops when there are no more results', async () => {
    await TestBed.configureTestingModule({
      imports: [AfSelectMobileComponent],
      providers: [provideIonicAngular()],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfSelectMobileComponent);
    fixture.componentRef.setInput(
      'options',
      Array.from({ length: 20 }, (_, index) => ({ value: `${index}`, label: `Player ${index}` })),
    );
    fixture.componentRef.setInput('scrollLoad', true);
    fixture.componentRef.setInput('hasMore', true);
    fixture.detectChanges();

    const requests: AfSelectLoadMoreEvent[] = [];
    fixture.componentInstance.loadMore.subscribe((event) => requests.push(event));
    const harness = fixture.componentInstance as unknown as {
      onListScroll(event: Event): void;
    };
    const event = {
      target: { scrollTop: 160, clientHeight: 40, scrollHeight: 200 },
    } as unknown as Event;

    harness.onListScroll(event);
    harness.onListScroll(event);
    expect(requests).toEqual([{ query: '', offset: 20 }]);

    fixture.componentRef.setInput('hasMore', false);
    fixture.detectChanges();
    harness.onListScroll(event);
    expect(requests).toHaveLength(1);
  });
});
