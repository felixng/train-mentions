/**
 * A link to a certain page, an anchor tag
 */

import styled from 'styled-components';
import { css } from 'styled-components';

const A = styled.a`
  color: rgba(194,68,72, 1);

  &:hover {
    color: rgba(194,68,72, 0.8);
  }

  ${props => props.strong && css`
  	font-weight: 400;
  `}
`;

export default A;
