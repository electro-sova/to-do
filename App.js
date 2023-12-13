import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const App = () => {
  const [tasks, setTasks] = useState([]); 
  const [newTask, setNewTask] = useState(''); 
  const [showCompleted, setShowCompleted] = useState(false); 
  const [editableTaskId, setEditableTaskId] = useState(null); 
  const [editedTaskText, setEditedTaskText] = useState(''); 

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    storeData(tasks);
  }, [tasks]);


  const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('todolist', jsonValue);
    } catch (e) {
      // обработка ошибки 
    }
  }

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('todolist');
      if (jsonValue !== null) {
        setTasks(JSON.parse(jsonValue)) // загрузка данных
      }
    } catch (e) {
      // 
    }
  };

  // Добавление новой задачи
  const addTask = () => {
    if (newTask !== '') {
      const newTaskItem = { id: Math.random().toString(), title: newTask, completed: false };
      setTasks([...tasks, newTaskItem]);
      setNewTask('');
    }
  };

  // Редактирование задачи
  const editTask = (id, newTitle) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, title: newTitle };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  // Сохранение отредактированной задачи
  const saveEditedTask = () => {
    editTask(editableTaskId, editedTaskText);
    setEditableTaskId(null);
  };

  // Выполнение или снятие выполнения задачи
  const toggleTaskCompletion = (id, completed) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  // Удаление задачи
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  // Рендер элемента списка задач
  const renderTaskItem = ({ item }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
      <TouchableOpacity onPress={() => toggleTaskCompletion(item.id, item.completed)}>
        <Text>{item.completed ? '✅' : '⬜️'}</Text>
      </TouchableOpacity>
      {editableTaskId === item.id ? (
        <TextInput
          value={editedTaskText}
          onChangeText={(text) => setEditedTaskText(text)}
          style={{ marginLeft: 8 }}
        />
      ) : (
        <Text style={{ marginLeft: 8 }}>{item.title}</Text>
      )}
      {editableTaskId !== item.id && (
        <TouchableOpacity onPress={() => {
          setEditableTaskId(item.id);
          setEditedTaskText(item.title);
        }}>
          <Text>✏️</Text>
        </TouchableOpacity>
      )}
      {editableTaskId === item.id && (
        <TouchableOpacity onPress={saveEditedTask}>
          <Text>💾</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Text>❌</Text>
      </TouchableOpacity>
    </View>
  );

  // Фильтрация задач по статусу выполнения
  const filteredTasks = showCompleted ? tasks.filter(task => task.completed) : tasks;

  return (
    <View style={{ flex: 1, padding: 25 }}>
      <Text style={{ fontSize: 40, fontWeight: 'bold', marginBottom: 25 }}>
        Список задач
      </Text>

      {tasks.length === 0 ? (
        <Text>Нет задач</Text>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          style={{ marginBottom: 16 }}
        />
      )}

      <TextInput
        value={newTask}
        onChangeText={(text) => setNewTask(text)}
        placeholder="Новая задача"
        style={{ borderWidth: 1, borderColor: 'gray', marginBottom: 15, padding: 15 }}
      />

      <TouchableOpacity onPress={addTask} style={{ backgroundColor: 'blue', padding: 15 }}>
        <Text style={{ color: 'white' }}>Добавить задачу</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setShowCompleted(!showCompleted)}
        style={{ marginTop: 16 }}
      >
        <Text>{showCompleted ? 'Показать текущие задачи' : 'Показать выполненные задачи'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;