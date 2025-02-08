import { create } from 'zustand';
import { readDatabase, writeDatabase, Task, Project } from '../utils/database';

interface TaskStore {
  tasks: Task[];
  projects: Project[];
  selectedProjects: Set<string>;
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  fetchData: () => Promise<void>;
  toggleProjectSelection: (projectId: string) => void;
  setSelectedProjects: (projectIds: string[]) => void;
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  projects: [],
  selectedProjects: new Set<string>(),
  isLoading: false,
  error: null,

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const db = await readDatabase();
      set({ tasks: db.tasks, projects: db.projects, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  toggleProjectSelection: (projectId: string) => {
    set((state) => {
      const newSelection = new Set(state.selectedProjects);
      if (newSelection.has(projectId)) {
        newSelection.delete(projectId);
      } else {
        newSelection.add(projectId);
      }
      return { selectedProjects: newSelection };
    });
  },

  setSelectedProjects: (projectIds: string[]) => {
    set({ selectedProjects: new Set(projectIds) });
  },

  addTask: async (taskData: Omit<Task, 'id'>) => {
    set({ isLoading: true, error: null });
    try {
      const newTask: Task = {
        ...taskData,
        id: String(Date.now()),
      };
      const db = await readDatabase();
      db.tasks.push(newTask);
      await writeDatabase(db);
      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  updateTask: async (taskId: string, updates: Partial<Task>) => {
    set({ isLoading: true, error: null });
    try {
      const db = await readDatabase();
      const taskIndex = db.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) throw new Error('Task not found');
      
      const updatedTask = { ...db.tasks[taskIndex], ...updates };
      db.tasks[taskIndex] = updatedTask;
      await writeDatabase(db);
      
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  deleteTask: async (taskId: string) => {
    set({ isLoading: true, error: null });
    try {
      const db = await readDatabase();
      db.tasks = db.tasks.filter((t) => t.id !== taskId);
      await writeDatabase(db);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  addProject: async (projectData: Omit<Project, 'id'>) => {
    set({ isLoading: true, error: null });
    try {
      const newProject: Project = {
        ...projectData,
        id: String(Date.now()),
      };
      const db = await readDatabase();
      db.projects.push(newProject);
      await writeDatabase(db);
      set((state) => ({
        projects: [...state.projects, newProject],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  updateProject: async (projectId: string, updates: Partial<Project>) => {
    set({ isLoading: true, error: null });
    try {
      const db = await readDatabase();
      const projectIndex = db.projects.findIndex((p) => p.id === projectId);
      if (projectIndex === -1) throw new Error('Project not found');
      
      const updatedProject = { ...db.projects[projectIndex], ...updates };
      db.projects[projectIndex] = updatedProject;
      await writeDatabase(db);
      
      set((state) => ({
        projects: state.projects.map((p) => (p.id === projectId ? updatedProject : p)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },

  deleteProject: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const db = await readDatabase();
      db.projects = db.projects.filter((p) => p.id !== projectId);
      // Also remove all tasks associated with this project
      db.tasks = db.tasks.filter((t) => t.groupId !== projectId);
      await writeDatabase(db);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== projectId),
        tasks: state.tasks.filter((t) => t.groupId !== projectId),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },
}));
