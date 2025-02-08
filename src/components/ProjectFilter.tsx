import React from 'react';
import { useTaskStore } from '../store/taskStore';
import { Menu, Transition } from '@headlessui/react';
import { FaLayerGroup, FaCheck } from 'react-icons/fa';

const ProjectFilter: React.FC = () => {
  const { projects, selectedProjects, toggleProjectSelection } = useTaskStore();

  return (
    <Menu as="div" className="relative">
      <Menu.Button className="flex items-center px-4 py-2 text-[#323338] hover:bg-[#dcdfec] rounded-lg transition-colors">
        <FaLayerGroup className="mr-2" />
        <span>
          {selectedProjects.size === 0
            ? 'All Projects'
            : `${selectedProjects.size} Project${selectedProjects.size > 1 ? 's' : ''}`}
        </span>
      </Menu.Button>

      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 mt-2 w-56 origin-top-left rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="p-2">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-[#f5f6f8]' : ''
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm text-[#323338]`}
                  onClick={() => useTaskStore.setState({ selectedProjects: new Set() })}
                >
                  {selectedProjects.size === 0 && (
                    <FaCheck className="mr-2 h-4 w-4 text-[#0073ea]" />
                  )}
                  <span className={selectedProjects.size === 0 ? 'ml-6' : ''}>All Projects</span>
                </button>
              )}
            </Menu.Item>
            <div className="my-2 h-px bg-[#e6e9ef]" />
            {projects.map((project) => (
              <Menu.Item key={project.id}>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-[#f5f6f8]' : ''
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm text-[#323338]`}
                    onClick={() => toggleProjectSelection(project.id)}
                  >
                    {selectedProjects.has(project.id) && (
                      <FaCheck className="mr-2 h-4 w-4 text-[#0073ea]" />
                    )}
                    <span className={selectedProjects.has(project.id) ? 'ml-6' : ''}>
                      {project.name}
                    </span>
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ProjectFilter;
