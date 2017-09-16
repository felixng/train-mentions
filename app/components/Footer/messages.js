/*
 * Footer Messages
 *
 * This contains all the text for the Footer component.
 */
import { defineMessages } from 'react-intl';

export default defineMessages({
  licenseMessage: {
    id: 'boilerplate.components.Footer.license.message',
    defaultMessage: 'This project is licensed under the MIT license.',
  },
  triggerMessage: {
    id: 'boilerplate.components.Footer.trigger.message',
    defaultMessage: 'What are people tweeting?',
  },
  authorMessage: {
    id: 'boilerplate.components.Footer.author.message',
    defaultMessage: `
      Check out our {dashboard}
    `,
  },
});
