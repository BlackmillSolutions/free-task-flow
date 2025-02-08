import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { Task } from '../../utils/database';
import StatusSelect from '../StatusSelect';
import PrioritySelect from '../PrioritySelect';
import ProgressBar from '../ProgressBar';
import ProjectSelect from '../ProjectSelect';
import { Project } from '../../utils/database';

const columnHelper = createColumnHelper<Task>();

export const createTableColumns = (
  projects: Project[],
  handleSaveEdit: (taskId: string, columnId: keyof Task, value: Task[keyof Task]) => void
): ColumnDef<Task, any>[] => [
  columnHelper.accessor((row) => row.title, {
    id: 'title',
    header: 'Title',
    cell: info => <div className="font-medium text-[#323338]">{info.getValue()}</div>,
    size: 200,
  }),
  columnHelper.accessor((row) => row.groupId, {
    id: 'groupId',
    header: 'Project',
    cell: info => (
      <div className="w-[140px]">
        <ProjectSelect
          value={info.getValue()}
          projects={projects}
          onChange={(value) => handleSaveEdit(info.row.original.id, 'groupId', value)}
        />
      </div>
    ),
    size: 140,
  }),
  columnHelper.accessor((row) => row.status, {
    id: 'status',
    header: 'Status',
    cell: info => (
      <div className="w-[140px]">
        <StatusSelect
          value={info.getValue()}
          onChange={(value) => handleSaveEdit(info.row.original.id, 'status', value)}
        />
      </div>
    ),
    size: 160,
  }),
  columnHelper.accessor((row) => row.priority, {
    id: 'priority',
    header: 'Priority',
    cell: info => (
      <div className="w-[140px]">
        <PrioritySelect
          value={info.getValue()}
          onChange={(value) => handleSaveEdit(info.row.original.id, 'priority', value)}
        />
      </div>
    ),
    size: 160,
  }),
  columnHelper.accessor((row) => row.dueDate, {
    id: 'dueDate',
    header: 'Due Date',
    cell: info => (
      <div className="text-[#676879]">
        {info.getValue() ? new Date(info.getValue()).toLocaleDateString() : '-'}
      </div>
    ),
    size: 120,
  }),
  columnHelper.accessor((row) => row.assignee, {
    id: 'assignee',
    header: 'Assignee',
    cell: info => (
      <div className="text-[#676879]">
        {info.getValue() || '-'}
      </div>
    ),
    size: 120,
  }),
  columnHelper.accessor((row) => row.description, {
    id: 'description',
    header: 'Description',
    cell: info => (
      <div className="text-[#676879] line-clamp-2">
        {info.getValue() || '-'}
      </div>
    ),
    size: 200,
  }),
  columnHelper.accessor((row) => row.progress, {
    id: 'progress',
    header: 'Progress',
    cell: info => (
      <div className="w-[140px]">
        <ProgressBar
          value={info.getValue()}
          onChange={(value) => handleSaveEdit(info.row.original.id, 'progress', value)}
        />
      </div>
    ),
    size: 100,
  }),
];
