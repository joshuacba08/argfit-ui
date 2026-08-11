import { TestBed } from '@angular/core/testing';
import { providePrimeNG } from 'primeng/config';

import type { AfSelectLoadMoreEvent } from '@argfit-ui/core';

import { AfSelectDesktopComponent } from './af-select-desktop.component';

describe('AfSelectDesktopComponent', () => {
  it('emits one load request per query and offset near the end of the list', async () => {
    await TestBed.configureTestingModule({
      imports: [AfSelectDesktopComponent],
      providers: [providePrimeNG()],
    }).compileComponents();

    const fixture = TestBed.createComponent(AfSelectDesktopComponent);
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
      currentFilterQuery: string;
      onListScroll(event: Event): void;
    };
    harness.currentFilterQuery = 'player';
    const event = {
      target: { scrollTop: 160, clientHeight: 40, scrollHeight: 200 },
    } as unknown as Event;

    harness.onListScroll(event);
    harness.onListScroll(event);
    expect(requests).toEqual([{ query: 'player', offset: 20 }]);

    fixture.componentRef.setInput(
      'options',
      Array.from({ length: 40 }, (_, index) => ({ value: `${index}`, label: `Player ${index}` })),
    );
    fixture.detectChanges();
    harness.onListScroll(event);
    expect(requests.at(-1)).toEqual({ query: 'player', offset: 40 });

    fixture.componentRef.setInput('hasMore', false);
    fixture.detectChanges();
    harness.onListScroll(event);
    expect(requests).toHaveLength(2);
  });
});
