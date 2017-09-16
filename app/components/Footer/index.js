import React from 'react';
import { FormattedMessage } from 'react-intl';

import A from 'components/A';
import LocaleToggle from 'containers/LocaleToggle';
import Wrapper from './Wrapper';
import Icon from './Icon';
import messages from './messages';
import styled from 'styled-components';

var dashboardLink = "https://twitter.com/hellofelixng" || process.env.DASHBOARD_LINK;

const Section = styled.section`
  margin: 0 0.25em;
`

function Footer() {
  return (
    <Wrapper>
      <Section>
        <FormattedMessage {...messages.triggerMessage} />
      </Section>
      <Section style={{textAlign:'right'}}>
        <FormattedMessage
          {...messages.authorMessage}
          values={{
            dashboard: <A target="_blank" href={dashboardLink} strong>
                          Realtime Dashboard
                       </A>
          }}
        />
      </Section>
    </Wrapper>
  );
}

export default Footer;
