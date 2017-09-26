import { injectGlobal } from 'styled-components';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    overflow-x: auto;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Lato', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    position: absolute;
    min-height: 100%;
    max-width: 100%;
    width: 100%;
    color: #fff;
    background: radial-gradient(ellipse farthest-corner at center top, #4b4b4b 0%, #484848 100%);
  }

  p,
  label {
    font-family: Georgia, Times, 'Times New Roman', serif;
    line-height: 1.5em;
  }

  article{
    height: 100%;
    width: 100%;
  }

  .tweets {
    margin: 0 auto;
  }

  .tweets > div {
    min-width: 300px;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`;
