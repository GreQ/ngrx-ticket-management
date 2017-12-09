import {
  animate,
  keyframes,
  query,
  style,
  transition,
  trigger
} from '@angular/animations';

export const fadeInItem = name =>
  trigger(name, [
    transition(':enter', [
      animate(
        '525ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        keyframes([
          style({
            minHeight: '0px',
            overflow: 'hidden',
            height: '0px',
            opacity: 0
          }),
          style({
            minHeight: '*',
            overflow: 'inherit',
            height: '*',
            opacity: 1
          })
        ])
      )
    ])
  ]);

export const fadeInList = name =>
  trigger(name, [
    transition(':increment', [
      query(':enter', [
        animate(
          '525ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          keyframes([
            style({
              minHeight: '0px',
              overflow: 'hidden',
              height: '0px',
              opacity: 0
            }),
            style({
              minHeight: '*',
              overflow: 'inherit',
              height: '*',
              opacity: 1
            })
          ])
        )
      ])
    ])
  ]);
