import React, { useState, useEffect } from 'react';

const initialTasks = [
  { id: 1, title: 'Revisar informes', assignedTo: 'Jefe', status: 'En progreso' },
  { id: 2, title: 'Supervisar proyecto A', assignedTo: 'Supervisor', status: 'Pendiente' },
  { id: 3, title: 'Analizar datos', assignedTo: 'Analista', status: 'Completada' },
  { id: 4, title: 'Preparar presentación', assignedTo: 'Jefe', status: 'Pendiente' },
  { id: 5, title: 'Coordinar equipo', assignedTo: 'Supervisor', status: 'En progreso' },
  { id: 6, title: 'Recopilar información', assignedTo: 'Analista', status: 'En progreso' },
];

function TaskList({ userRole }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const myTasks = tasks.filter(task => task.assignedTo === userRole);
  const teamTasks = getTeamTasks(userRole);

  function getTeamTasks(role) {
    switch (role) {
      case 'Jefe':
        return tasks.filter(task => task.assignedTo !== 'Jefe');
      case 'Supervisor':
        return tasks.filter(task => task.assignedTo === 'Analista');
      case 'Analista':
      default:
        return [];
    }
  }

  function addTask(event) {
    event.preventDefault();
    if (newTaskTitle.trim()) {
      const newTask = {
        id: tasks.length + 1,
        title: newTaskTitle.trim(),
        assignedTo: userRole,
        status: 'Pendiente'
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  }

  function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    const newTitle = prompt('Editar tarea:', task.title);
    if (newTitle !== null) {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, title: newTitle.trim() } : t));
    }
  }

  function deleteTask(taskId) {
    setTasks(tasks.filter(t => t.id !== taskId));
  }

  function toggleTaskStatus(taskId) {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: t.status === 'Completada' ? 'Pendiente' : 'Completada' } : t));
  }

  return (
    <div className="task-container">
      <div className="task-list">
        <h2>Mis Tareas</h2>
        {myTasks.length === 0 ? (
          <p>No tienes tareas asignadas.</p>
        ) : (
          <ul>
            {myTasks.map(task => (
              <li key={task.id}>
                <span className={task.status === 'Completada' ? 'completed' : ''}>
                  <strong>{task.title}</strong> - Estado: {task.status}
                </span>
                <button onClick={() => editTask(task.id)}>Editar</button>
                <button onClick={() => deleteTask(task.id)}>Eliminar</button>
                <button onClick={() => toggleTaskStatus(task.id)}>
                  {task.status === 'Completada' ? 'Reabrir' : 'Completar'}
                </button>
              </li>
            ))}
          </ul>
        )}
        <form onSubmit={addTask}>
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Nueva tarea"
            required
          />
          <button type="submit">Agregar Tarea</button>
        </form>
      </div>

      <div className="task-list">
        <h2>Tareas de mi Equipo</h2>
        {teamTasks.length === 0 ? (
          <p>No hay tareas de equipo para mostrar.</p>
        ) : (
          <ul>
            {teamTasks.map(task => (
              <li key={task.id}>
                <strong>{task.title}</strong> - Asignado a: {task.assignedTo} - Estado: {task.status}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TaskList;