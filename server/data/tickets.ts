export const tickets = [
  {
    id: '0',
    title: 'Install a monitor arm',
    description: trim(
      '\n      Nor again is there anyone who loves or pursues or desires to obtain pain of itself, \n      because it is pain, but because occasionally circumstances occur in which toil and \n      pain can procure him some great pleasure.\n    '
    ),
    assigneeId: '1',
    imageURL: '',
    completed: false
  },
  {
    id: '1',
    title: 'Move the desk to the new location',
    description: trim(
      '\n      These cases are perfectly simple and easy to distinguish. In a free hour, \n      when our power of choice is untrammelled and when nothing prevents our being able to \n      do what we like best, every pleasure is to be welcomed and every pain avoided.\n    '
    ),
    assigneeId: '3',
    imageURL: '',
    completed: true
  },
  {
    id: '2',
    title: 'Recharge Tesla car battery',
    description: trim(
      '\n      Et harum quidem rerum facilis est et expedita distinctio. \n      Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus \n      id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor \n      repellendus. \n    '
    ),
    assigneeId: '2',
    imageURL: '',
    completed: false
  },
  {
    id: '3',
    title: 'Recycle furniture',
    description: trim(
      'Ut justo felis donec nunc sed, suscipit anim in, vivamus quisque ut fames, elit vestibulum varius. Est placeat vel ante, litora nascetur, integer nunc nam. Eu lorem felis, vestibulum urna vitae, in mattis.'
    ),
    assigneeId: '5',
    imageURL: '',
    completed: false
  },
  {
    id: '4',
    title: 'Christmas Presents',
    description: trim(
      'Eros nibh et semper, vitae eu sit dapibus in tincidunt, habitant sagittis, laoreet venenatis blandit varius, porta ipsum sit erat.'
    ),
    assigneeId: '7',
    imageURL: '',
    completed: true
  },
  {
    id: '5',
    title: 'Water Plants',
    description: trim(
      `Eget hac libero ut. Ex sem, eget mi, mi aliquam odio urna elit. 
          Gravida orci viverra aliquam arcu ut malesuada, interdum id morbi dictum mauris semper id, vel ipsum non integer. 
          Et nisl fusce mollis quam pellentesque amet, risus curabitur sociis in quisque ante accumsan. 
          Eget urna aliquam imperdiet rutrum mauris, nam scelerisque consectetuer eleifend donec imperdiet, nisl massa, molestie felis, laoreet molestie congue.
          `
    ),
    assigneeId: '9',
    imageURL: '',
    completed: false
  }
];

var MULTI_SPACES = /\s\s+/g;

function trim(target) {
  return target.replace(MULTI_SPACES, ' ').replace(/^\s+/g, '');
}
