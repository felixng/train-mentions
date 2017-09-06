import styled from 'styled-components';
import { css } from 'styled-components';

const H1 = styled.h1`
  font-size: 2em;
  margin: 0 auto;
  width: 100%;
  text-align: center;
  margin-bottom: 0.25em;

  a {
  	text-decoration: none;
  	color: inherit;
  }

  ${props => props.logo && css`
  	font-size: 4em;
  	font-weight: 100;
  	font-family: 'Lato', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;

    @media (max-width: 400px) {
      font-size: 3em;
      margin: 0em;
    }
  `}
`;

export default H1;
