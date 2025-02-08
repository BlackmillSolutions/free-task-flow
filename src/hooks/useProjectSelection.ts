import { useMemo } from 'react';
import { useTaskStore } from '../store/taskStore';

export const useProjectSelection = () => {
  const { projects, selectedProjects } = useTaskStore();

  const defaultProject = useMemo(() => {
    // First try to get the selected project
    if (selectedProjects.size === 1) {
      return Array.from(selectedProjects)[0];
    }
    
    // If no project is selected or multiple are selected,
    // use the first project as default
    return projects[0]?.id;
  }, [projects, selectedProjects]);

  return {
    defaultProject,
    projects,
  };
};
