import React from 'react';
import { FormattedMessage } from 'react-intl';

import A from 'components/A';
import LocaleToggle from 'containers/LocaleToggle';
import Wrapper from './Wrapper';
import Icon from './Icon';
import messages from './messages';

var dashboardLink = "https://twitter.com/hellofelixng" || process.env.DASHBOARD_LINK;

function Footer() {
  return (
    <Wrapper>
      <section>
        <FormattedMessage {...messages.triggerMessage} />
      </section>
      <section>
        <FormattedMessage
          {...messages.authorMessage}
          values={{
            dashboard: <A target="_blank" href={dashboardLink} strong>
                          Realtime Dashboard
                       </A>
          }}
        />
      </section>
    </Wrapper>
  );
}

export default Footer;
