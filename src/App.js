import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Trash } from 'react-bootstrap-icons';
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  ListGroup,
  Tabs,
  Tab,
  Dropdown,
  Modal,
} from 'react-bootstrap';

const TodoApp = () => {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    return storedTasks
  });
  const [taskInput, setTaskInput] = useState('');
  const [categories, setCategories] = useState(() => {
    const storedCategories = JSON.parse(localStorage.getItem('categories')) || [];
    return storedCategories
  });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [newTaskCategory, setNewTaskCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [categoryToRemove, setCategoryToRemove] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const addTask = () => {
    if (taskInput.trim() !== '' && newTaskCategory.trim() !== '') {
      const newTask = {
        id: Date.now(),
        text: taskInput,
        category: newTaskCategory,
        completed: false,
      };

      setTasks((prevTasks) => [...prevTasks, newTask]);
      setTaskInput('');
      setNewTaskCategory('');
      setShowModal(false);
    }
  };

  const removeTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  const toggleCompleted = (taskId) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const addCategory = () => {
    if (newCategory.trim() !== '' && newCategory.trim().toLowerCase() !== 'all') {
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      setNewCategory('');
    }
  };

  const removeCategory = (category) => {
    const associatedTasks = tasks.filter((task) => task.category === category);
    if (associatedTasks.length > 0) {
      setCategoryToRemove(category);
      setShowWarning(true);
    } else {
      handleRemoveCategory(category);
    }
  };

  const handleRemoveCategory = (category) => {
    const updatedCategories = categories.filter((c) => c !== category);
    setCategories(updatedCategories);
    const updatedTasks = tasks.filter((task) => task.category !== category);
    setTasks(updatedTasks);
    setSelectedCategory('All');
    setShowWarning(false);
  };

  const filterByCategory = (category) => {
    setSelectedCategory(category);
  };

  const isAddTaskDisabled = taskInput.trim() === '' || newTaskCategory.trim() === '' || newTaskCategory.trim().toLowerCase() === 'all';

  const completedTasks = tasks.filter((task) => task.completed);
  const remainingTasks = tasks.filter((task) => !task.completed);

  return (
    <Container className="mt-5 todo-container">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h1 className="text-center mb-4">To-Do List</h1>
          <Tabs defaultActiveKey="taskList" id="todo-tabs">
          <Tab eventKey="taskList" title="Task List">
              <Form className="mt-3 d-flex align-items-center todo-form">
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="filter-category-dropdown">
                    {selectedCategory || 'Select Category'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => filterByCategory('All')}>
                      All
                    </Dropdown.Item>
                    {categories.map((category) => (
                      <Dropdown.Item
                        key={category}
                        onClick={() => filterByCategory(category)}
                      >
                        {category}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                <Button
                  className="ms-2"
                  variant="primary"
                  onClick={() => setShowModal(true)}
                >
                  Add Task
                </Button>
              </Form>
              <ListGroup className="mt-4 task-list">
                {remainingTasks.filter(
                  (task) =>
                    selectedCategory === 'All' || task.category === selectedCategory
                ).map((task) => (
                  <ListGroup.Item key={task.id} className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <Form.Check
                        type="checkbox"
                        label={
                          <span className={task.completed ? 'text-muted text-decoration-line-through' : ''}>
                            {task.text}
                          </span>
                        }
                        checked={task.completed}
                        onChange={() => toggleCompleted(task.id)}
                      />
                      <small className="text-muted ms-2">{task.category}</small>
                    </div>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeTask(task.id)}
                    >
                      <Trash />
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              {completedTasks.length > 0 && (
                <div className="mt-4 completed-section">
                  <h5>Completed</h5>
                  <ListGroup>
                    {completedTasks.filter(
                  (task) =>
                    selectedCategory === 'All' || task.category === selectedCategory
                ).map((task) => (
                      <ListGroup.Item key={task.id} className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <Form.Check
                            type="checkbox"
                            label={
                              <span className="text-muted text-decoration-line-through">
                                {task.text}
                              </span>
                            }
                            checked={task.completed}
                            onChange={() => toggleCompleted(task.id)}
                          />
                          <small className="text-muted ms-2">{task.category}</small>
                        </div>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeTask(task.id)}
                        >
                          <Trash />
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              )}
            </Tab>
            <Tab eventKey="categories" title="Categories">
            <Form className="mt-4 category-form">
                <Form.Group className="mb-3 d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Enter a new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                  <Button
                    variant="success"
                    className="ms-2"
                    onClick={addCategory}
                  >
                    Add Category
                  </Button>
                </Form.Group>
              </Form>
              <ListGroup className="mt-4 category-list">
                {categories.map((category) => (
                  <ListGroup.Item key={category} className="d-flex justify-content-between">
                    {category}
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeCategory(category)}
                      >
                        <Trash />
                      </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Tab>
          </Tabs>
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Add a new task"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="secondary"
                      id="task-category-dropdown"
                    >
                      {newTaskCategory || 'Select Category'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {categories.map((category) => (
                        <Dropdown.Item
                          key={category}
                          onClick={() => setNewTaskCategory(category)}
                        >
                          {category}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
                <Button
                  variant="primary"
                  onClick={addTask}
                  disabled={isAddTaskDisabled}
                >
                  Add Task
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
          <Modal show={showWarning} onHide={() => setShowWarning(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Warning</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {`This category has ${tasks.filter(task => task.category === categoryToRemove).length} associated tasks. Are you sure you want to remove it?`}
            </Modal.Body>
            <Modal.Footer>
              <Button
                  variant="danger"
                  className="mt-3"
                  onClick={() => handleRemoveCategory(categoryToRemove)}
                >
                  Yes, remove category and tasks
                </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
};

export default TodoApp;