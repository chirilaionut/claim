import styled from 'styled-components';

export const Text = styled.p`
  color: ${(props) => props.theme.colors.text};

  user-select: none;

  &:hover {
    text-decoration: none;
  }
`;

export const Span = styled.span`
  color: ${(props) => props.theme.colors.text};

  &:hover {
    text-decoration: none;
  }
`;

export const A = styled.a`
  color: ${(props) => props.theme.colors.text};

  &:hover {
    color: ${(props) => props.theme.colors.text};
    text-decoration: none;
  }
`;
