import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskList from '../components/TaskList';

describe('TaskList Component', () => {
  describe('Renderizado inicial', () => {
    it('debe renderizar correctamente con el título "Mis Tareas"', () => {
      render(<TaskList userRole="Jefe" />);
      expect(screen.getByText('Mis Tareas')).toBeInTheDocument();
      expect(screen.getByText('Tareas de mi Equipo')).toBeInTheDocument();
    });

    it('debe mostrar mensaje cuando no hay tareas asignadas', () => {
      render(<TaskList userRole="RolInexistente" />);
      expect(screen.getByText('No tienes tareas asignadas.')).toBeInTheDocument();
    });

    it('debe renderizar formulario para agregar tareas', () => {
      render(<TaskList userRole="Jefe" />);
      expect(screen.getByPlaceholderText('Nueva tarea')).toBeInTheDocument();
      expect(screen.getByText('Agregar Tarea')).toBeInTheDocument();
    });
  });

  describe('Filtrado de tareas por rol', () => {
    it('debe mostrar solo las tareas del Jefe cuando el rol es Jefe', () => {
      render(<TaskList userRole="Jefe" />);
      
      // Buscar la sección "Mis Tareas"
      const myTasksSection = screen.getAllByText('Mis Tareas')[0].parentElement;
      
      // Verificar que las tareas del Jefe están en "Mis Tareas"
      expect(myTasksSection).toHaveTextContent('Revisar informes');
      expect(myTasksSection).toHaveTextContent('Preparar presentación');
      
      // Verificar que las tareas de otros NO están en "Mis Tareas"
      expect(myTasksSection).not.toHaveTextContent('Supervisar proyecto A');
    });

    it('debe mostrar solo las tareas del Supervisor cuando el rol es Supervisor', () => {
      render(<TaskList userRole="Supervisor" />);
      
      const myTasksSection = screen.getAllByText('Mis Tareas')[0].parentElement;
      
      expect(myTasksSection).toHaveTextContent('Supervisar proyecto A');
      expect(myTasksSection).toHaveTextContent('Coordinar equipo');
      expect(myTasksSection).not.toHaveTextContent('Revisar informes');
    });

    it('debe mostrar solo las tareas del Analista cuando el rol es Analista', () => {
      render(<TaskList userRole="Analista" />);
      
      const myTasksSection = screen.getAllByText('Mis Tareas')[0].parentElement;
      
      expect(myTasksSection).toHaveTextContent('Analizar datos');
      expect(myTasksSection).toHaveTextContent('Recopilar información');
      expect(myTasksSection).not.toHaveTextContent('Revisar informes');
    });
  });

  describe('Tareas del equipo según rol', () => {
    it('Jefe debe ver todas las tareas excepto las suyas', () => {
      render(<TaskList userRole="Jefe" />);
      const teamSection = screen.getAllByText(/Tareas de mi Equipo/)[0].parentElement;
      expect(teamSection).toHaveTextContent('Supervisar proyecto A');
      expect(teamSection).toHaveTextContent('Analizar datos');
    });

    it('Supervisor debe ver solo las tareas del Analista', () => {
      render(<TaskList userRole="Supervisor" />);
      const teamSection = screen.getAllByText(/Tareas de mi Equipo/)[0].parentElement;
      expect(teamSection).toHaveTextContent('Analizar datos');
      expect(teamSection).toHaveTextContent('Recopilar información');
    });

    it('Analista no debe ver tareas de equipo', () => {
      render(<TaskList userRole="Analista" />);
      expect(screen.getByText('No hay tareas de equipo para mostrar.')).toBeInTheDocument();
    });
  });

  describe('Agregar tareas', () => {
    it('debe agregar una nueva tarea cuando se envía el formulario', async () => {
      const user = userEvent.setup();
      render(<TaskList userRole="Jefe" />);

      const input = screen.getByPlaceholderText('Nueva tarea');
      const button = screen.getByText('Agregar Tarea');

      await user.type(input, 'Nueva tarea de prueba');
      await user.click(button);

      expect(screen.getByText('Nueva tarea de prueba')).toBeInTheDocument();
    });

    it('debe limpiar el input después de agregar una tarea', async () => {
      const user = userEvent.setup();
      render(<TaskList userRole="Jefe" />);

      const input = screen.getByPlaceholderText('Nueva tarea');
      const button = screen.getByText('Agregar Tarea');

      await user.type(input, 'Otra tarea');
      await user.click(button);

      expect(input).toHaveValue('');
    });

    it('no debe agregar una tarea si el título está vacío', async () => {
      const user = userEvent.setup();
      render(<TaskList userRole="Jefe" />);

      const initialTasks = screen.getAllByRole('listitem');
      const button = screen.getByText('Agregar Tarea');

      await user.click(button);

      const finalTasks = screen.getAllByRole('listitem');
      expect(finalTasks.length).toBe(initialTasks.length);
    });

    it('debe agregar la tarea con estado "Pendiente"', async () => {
      const user = userEvent.setup();
      render(<TaskList userRole="Jefe" />);

      const input = screen.getByPlaceholderText('Nueva tarea');
      await user.type(input, 'Tarea nueva');
      await user.click(screen.getByText('Agregar Tarea'));

      // Verificar que la tarea se agregó con el título correcto
      expect(screen.getByText('Tarea nueva')).toBeInTheDocument();
      
      // Verificar que está en la sección "Mis Tareas" y tiene estado "Pendiente"
      const myTasksSection = screen.getAllByText('Mis Tareas')[0].parentElement;
      expect(myTasksSection).toHaveTextContent('Tarea nueva');
      expect(myTasksSection).toHaveTextContent('Estado: Pendiente');
    });
  });

  describe('Eliminar tareas', () => {
    it('debe eliminar una tarea cuando se hace clic en el botón Eliminar', async () => {
      const user = userEvent.setup();
      render(<TaskList userRole="Jefe" />);

      expect(screen.getByText('Revisar informes')).toBeInTheDocument();

      const deleteButtons = screen.getAllByText('Eliminar');
      await user.click(deleteButtons[0]);

      expect(screen.queryByText('Revisar informes')).not.toBeInTheDocument();
    });

    it('debe mantener las demás tareas después de eliminar una', async () => {
      const user = userEvent.setup();
      render(<TaskList userRole="Jefe" />);

      const deleteButtons = screen.getAllByText('Eliminar');
      await user.click(deleteButtons[0]);

      expect(screen.getByText('Preparar presentación')).toBeInTheDocument();
    });
  });

  describe('Cambiar estado de tareas', () => {
    it('debe cambiar el estado de Pendiente a Completada', async () => {
      const user = userEvent.setup();
      render(<TaskList userRole="Jefe" />);

      const completarButton = screen.getAllByText('Completar')[0];
      await user.click(completarButton);

      expect(screen.getByText('Reabrir')).toBeInTheDocument();
    });

    it('debe cambiar el estado de Completada a Pendiente', async () => {
      const user = userEvent.setup();
      render(<TaskList userRole="Analista" />);

      // La tarea "Analizar datos" está completada inicialmente
      const completedTask = screen.getByText(/Analizar datos/);
      expect(completedTask).toBeInTheDocument();

      const reabrirButton = screen.getByText('Reabrir');
      await user.click(reabrirButton);

      // Ahora debe mostrar "Completar" en lugar de "Reabrir"
      expect(screen.getAllByText('Completar').length).toBeGreaterThan(0);
    });

    it('debe aplicar la clase "completed" cuando el estado es Completada', async () => {
      const user = userEvent.setup();
      render(<TaskList userRole="Jefe" />);

      const completarButton = screen.getAllByText('Completar')[0];
      await user.click(completarButton);

      const taskElement = screen.getByText(/Revisar informes/).closest('span');
      expect(taskElement).toHaveClass('completed');
    });
  });

  describe('Editar tareas', () => {
    it('debe mostrar el prompt al hacer clic en Editar', async () => {
      const user = userEvent.setup();
      const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue('Tarea editada');

      render(<TaskList userRole="Jefe" />);

      const editButton = screen.getAllByText('Editar')[0];
      await user.click(editButton);

      expect(promptSpy).toHaveBeenCalledWith('Editar tarea:', 'Revisar informes');
      expect(screen.getByText('Tarea editada')).toBeInTheDocument();

      promptSpy.mockRestore();
    });

    it('no debe cambiar la tarea si se cancela el prompt', async () => {
      const user = userEvent.setup();
      const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue(null);

      render(<TaskList userRole="Jefe" />);

      const editButton = screen.getAllByText('Editar')[0];
      await user.click(editButton);

      expect(screen.getByText('Revisar informes')).toBeInTheDocument();

      promptSpy.mockRestore();
    });
  });

  describe('Interacción con el formulario', () => {
    it('debe actualizar el input cuando se escribe en él', async () => {
      const user = userEvent.setup();
      render(<TaskList userRole="Jefe" />);

      const input = screen.getByPlaceholderText('Nueva tarea');
      await user.type(input, 'Texto de prueba');

      expect(input).toHaveValue('Texto de prueba');
    });

    it('debe eliminar espacios al agregar una tarea', async () => {
      const user = userEvent.setup();
      render(<TaskList userRole="Jefe" />);

      const input = screen.getByPlaceholderText('Nueva tarea');
      await user.type(input, '   Tarea con espacios   ');
      await user.click(screen.getByText('Agregar Tarea'));

      expect(screen.getByText('Tarea con espacios')).toBeInTheDocument();
    });
  });

  describe('Contadores y validaciones', () => {
    it('debe incrementar correctamente el ID de las nuevas tareas', async () => {
      const user = userEvent.setup();
      render(<TaskList userRole="Jefe" />);

      const input = screen.getByPlaceholderText('Nueva tarea');
      
      await user.type(input, 'Tarea 1');
      await user.click(screen.getByText('Agregar Tarea'));
      
      await user.type(input, 'Tarea 2');
      await user.click(screen.getByText('Agregar Tarea'));

      expect(screen.getByText('Tarea 1')).toBeInTheDocument();
      expect(screen.getByText('Tarea 2')).toBeInTheDocument();
    });

    it('debe mostrar los botones correctos para cada tarea', () => {
      render(<TaskList userRole="Jefe" />);

      const myTasksList = screen.getAllByRole('list')[0];
      const buttons = myTasksList.querySelectorAll('button');

      // Por cada tarea debe haber 3 botones: Editar, Eliminar, Completar/Reabrir
      expect(buttons.length).toBe(3 * 2); // 2 tareas del Jefe, 3 botones cada una
    });
  });
});
