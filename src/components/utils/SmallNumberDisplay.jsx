import React from 'react';
import styled from 'styled-components';
import { formatSmallNumber } from '../../utils/formats';

const StyledNumber = styled.span`
  .subscript {
    font-size: 1.4rem;
    margin: -2;
  }
`;


const SmallNumberDisplay = ({ value }) => {
    const formattedValue = formatSmallNumber(value);
    
    let prefix = '', subscript = '', suffix = '';
  
    // Check if the formatted value matches our expected pattern
    const match = formattedValue.match(/^(0\.0)([₀₁₂₃₄₅₆₇₈₉]+)(.*)$/);
  
    if (match) {
      [, prefix, subscript, suffix] = match;
    } else {
      // If it doesn't match, just display the formatted value as is
      suffix = formattedValue;
    }
  
    return (
        <>
      <span>
        {/* <span>Original: {value}</span>
        <br /> */}
        <StyledNumber>
          {prefix}
          {subscript && <span className="subscript">{subscript}</span>}
          {suffix}
        </StyledNumber>
      </span>
      </>
    );
  };
  
export default SmallNumberDisplay;