import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import { React, useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';
import { ThemeProvider, styled } from 'styled-components/native';
import Input from './Components/Input';
import Task from './Components/Task';
import { theme } from './theme';

const width = Dimensions.get('window').width;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  align-items: center;
  justify-content: flex-start;
`;

const Title = styled.Text`
  font-size: 40px;
  font-weight: 600;
  /* background-color: ${({ theme }) => theme.itemBackground}; */
  color: ${({ theme }) => theme.title};
  margin: 0px 20px;
  text-align: center;
`;

const TitleBack = styled.View`
  width: ${({ height }) => width - 40}px;
  background-color: ${({ theme }) => theme.itemBackground};
  border-radius: 10px;
  margin: 3px 0;
`;

const List = styled.ScrollView`
  flex: 1;
  width: ${({ width }) => width - 40}px;
`;

const ButtonContainer = styled(Pressable)`
  width: ${width - 40}px;
  height: 50px;
  background-color: ${({ theme }) => theme.main};
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: ${({ theme }) => theme.title};
`;

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [tasks, setTasks] = useState({});

  // 목록에 추가하기
  const h_addTask = () => {
    const ID = Date.now().toString();
    const newTaskObject = {
      [ID]: { id: ID, text: newTask, completed: false },
    };
    setNewTask('');
    h_saveTasks({ ...tasks, ...newTaskObject });
  };
  // 글자 바꾸기
  const h_textChange = text => {
    setNewTask(text);
  };

  // 목록 삭제하기
  let delete_question = false;

  const h_deleteTask = id => {
    const currentTasks = Object.assign({}, tasks);
    Alert.alert('삭제할거야?', '진짜루?', [
      {
        text: '취소할거양',
        onPress: () => console.log('취소했엉'),
      },
      {
        text: '삭제할거양',
        onPress: () => (delete currentTasks[id], h_saveTasks(currentTasks)),
      },
    ]);
  };

  // 목록 완료하기
  const h_toggleTask = id => {
    const currentTasks = Object.assign({}, tasks);
    currentTasks[id]['completed'] = !currentTasks[id]['completed'];
    h_saveTasks(currentTasks);
  };

  // 목록 수정하기
  const h_updateTask = item => {
    const currentTasks = Object.assign({}, tasks);
    currentTasks[item.id] = item;
    h_saveTasks(currentTasks);
  };

  // 수정중 취소하기
  const h_onBlur = () => {
    setNewTask('');
  };

  const h_deleteCompletedTasks = () => {
    const currentTasks = Object.assign({}, tasks);
    Alert.alert('삭제할거야?', '진짜루?', [
      {
        text: '취소할거양',
        onPress: () => console.log('취소했엉'),
      },
      {
        text: '삭제할거양',
        onPress: () => {
          Object.values(currentTasks).forEach(item => {
            if (item.completed) {
              delete currentTasks[item.id];
            }
          });
          h_saveTasks(currentTasks);
        },
      },
    ]);
  };

  // 저장하기
  const h_saveTasks = async tasks => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      setTasks(tasks);
    } catch (e) {
      console.error(e);
    }
  };

  // 불러오기
  const h_loadTasks = async () => {
    try {
      const loadedTasks = await AsyncStorage.getItem('tasks');
      setTasks(JSON.parse(loadedTasks || '{}'));
    } catch (e) {
      console.error(e);
    }
  };

  // 로딩준비
  useEffect(() => {
    async function appReady() {
      try {
        await h_loadTasks();
      } catch (e) {
        console.error(e);
      } finally {
        setIsReady(true);
      }
    }
    appReady();
  }, []);

  // 리로딩시 로딩준비
  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container onLayout={onLayoutRootView}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.background} />
        <TitleBack>
          <Title>버킷 리스트</Title>
        </TitleBack>
        <Input
          placeholder="+항목추가"
          value={newTask}
          onChangeText={h_textChange}
          onSubmitEditing={h_addTask}
        />
        <List width={width}>
          {Object.values(tasks)
            .reverse()
            .map(item => (
              <Task
                key={item.id}
                item={item}
                deleteTask={h_deleteTask}
                toggleTask={h_toggleTask}
                updateTask={h_updateTask}
                onBlur={h_onBlur}
              />
            ))}
        </List>
        <ButtonContainer onPress={h_deleteCompletedTasks}>
          <Text>완료항목 전체삭제</Text>
        </ButtonContainer>
      </Container>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
