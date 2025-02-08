import React from 'react';
import { Project } from '../utils/database';

interface ProjectSelectProps {
  value: string;
  projects: Project[];
  onChange: (value: string) => void;
}

const ProjectSelect: React.FC<ProjectSelectProps> = ({ value, projects, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const currentProject = projects.find(p => p.id === value);

  if (!currentProject) return null;

  return (
    <div className="relative inline-block w-full">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-full px-3 py-1.5 text-sm font-medium rounded-full flex items-center justify-between gap-2 transition-all duration-200 hover:opacity-80"
        style={{
          backgroundColor: currentProject.color,
          color: 'white'
        }}
      >
        <span>{currentProject.name}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="fixed z-50 w-[inherit] mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1"
          style={{
            width: 'var(--select-width)',
            top: 'var(--select-position-y)',
            left: 'var(--select-position-x)'
          }}
          ref={(el) => {
            if (el) {
              const button = el.previousElementSibling as HTMLElement;
              const rect = button.getBoundingClientRect();
              const spaceBelow = window.innerHeight - rect.bottom;
              const spaceAbove = rect.top;
              const dropdownHeight = el.offsetHeight;
              
              el.style.setProperty('--select-width', `${button.offsetWidth}px`);
              
              // Position above if not enough space below
              if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
                el.style.setProperty('--select-position-y', `${rect.top - dropdownHeight - 5}px`);
              } else {
                el.style.setProperty('--select-position-y', `${rect.bottom + 5}px`);
              }
              el.style.setProperty('--select-position-x', `${rect.left}px`);
            }
          }}
        >
          {projects.map((project) => (
            <button
              key={project.id}
              onClick={(e) => {
                e.stopPropagation();
                onChange(project.id);
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2"
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: project.color }}
              />
              {project.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectSelect;
