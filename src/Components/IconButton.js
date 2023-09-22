import PropTypes from 'prop-types';
import React from 'react';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';
import { Images } from '../Image';

const Icon = styled.Image`
  tint-color: ${({ theme, completed}) => completed? theme.done : theme.text};
  width: 30px;
  height: 30px;
  margin: 10px;
`;

const IconButton = ({ type, onPressOut, id }) => {
  const h_onPressOut = () => {
    onPressOut(id);
  };
  return (
    <Pressable onPressOut={h_onPressOut}>
      <Icon source={type} />
    </Pressable>
  );
};

IconButton.defaultProps = {
  onPressOut: () => {},
};

IconButton.propTypes = {
  type: PropTypes.oneOf(Object.values(Images)).isRequired,
  onPressOut: PropTypes.func,
  id: PropTypes.string,
  completed: PropTypes.bool,
};

export default IconButton;
