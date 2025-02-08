export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Done';
  dueDate: string | null;
  groupId: string;
  priority: 'high' | 'medium' | 'low';
  assignee: string;
  progress: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  members: string[];
  color: string;
}

export interface Database {
  tasks: Task[];
  users: User[];
  projects: Project[];
}

// Read the database from localStorage
export const readDatabase = (): Database => {
  try {
    const data = localStorage.getItem('database');
    if (data) {
      return JSON.parse(data) as Database;
    } else {
      // Initialize with empty arrays if not present
      const initialData: Database = {
        tasks: [],
        users: [],
        projects: []
      };
      localStorage.setItem('database', JSON.stringify(initialData));
      return initialData;
    }
  } catch (error) {
    console.error('Error reading database:', error);
    throw error;
  }
};

// Write to the database in localStorage
export const writeDatabase = (db: Database): void => {
  try {
    const data = JSON.stringify(db, null, 2);
    localStorage.setItem('database', data);
  } catch (error) {
    console.error('Error writing to database:', error);
    throw error;
  }
};

// Add a new item to the database
export const addItem = <T extends Task | User | Project>(
  type: keyof Database,
  item: T
): void => {
  const db = readDatabase();
  db[type].push(item as any);
  writeDatabase(db);
};

// Update an existing item in the database
export const updateItem = <T extends Partial<Task> | Partial<User> | Partial<Project>>(
  type: keyof Database,
  id: string,
  updatedItem: T
): void => {
  const db = readDatabase();
  const index = db[type].findIndex(item => item.id === id);
  if (index === -1) {
    throw new Error(`${type.slice(0, -1)} with id ${id} not found.`);
  }
  db[type][index] = { ...db[type][index], ...updatedItem };
  writeDatabase(db);
};

// Delete an item from the database
export const deleteItem = (
  type: keyof Database,
  id: string
): void => {
  const db = readDatabase();
  const index = db[type].findIndex(item => item.id === id);
  if (index === -1) {
    throw new Error(`${type.slice(0, -1)} with id ${id} not found.`);
  }
  db[type].splice(index, 1);
  writeDatabase(db);
};
