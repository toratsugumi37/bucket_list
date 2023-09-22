import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { Images } from '../Image';
import IconButton from './IconButton';
import Input from './Input';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.itemBackground};
  border-radius: 10px;
  padding: 5px;
  margin: 3px 0px;
`;

const Contents = styled.Text`
  flex: 1;
  font-size: 24px;
  color: ${({ theme, completed }) => (completed ? theme.done : theme.text)};
  text-decoration-line: ${({ completed }) =>
    completed ? 'line-through' : 'none'};
`;

const Task = ({ item, deleteTask, toggleTask, updateTask, onBlur }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(item.text);

  const h_onBlur = () => {
    if (isEditing) {
      setIsEditing(false);
      setText(item.text);
    }
  };
  const h_updateButtonPress = () => {
    setIsEditing(true);
  };
  const h_onSubmitEditing = () => {
    if (isEditing) {
      const editedTask = Object.assign({}, item, { text });
      setIsEditing(false);
      updateTask(editedTask);
    }
  };
  return isEditing ? (
    <Input
      value={text}
      onChangeText={text => setText(text)}
      onSubmitEditing={h_onSubmitEditing}
      onBlur={h_onBlur}
    />
  ) : (
    <Container>
      <IconButton
        type={item.completed ? Images.completed : Images.uncompleted}
        id={item.id}
        onPressOut={toggleTask}
        completed={item.completed}
      />
      <Contents completed={item.completed}>{item.text}</Contents>
      {item.completed || (
        <IconButton type={Images.update} onPressOut={h_updateButtonPress} />
      )}
      <IconButton
        type={Images.delete}
        id={item.id}
        onPressOut={deleteTask}
        completed={item.completed}
      />
    </Container>
  );
};

Task.propTypes = {
  item: PropTypes.object.isRequired,
  deleteTask: PropTypes.func.isRequired,
  toggleTask: PropTypes.func.isRequired,
  updateTask: PropTypes.func.isRequired,
};

export default Task;
