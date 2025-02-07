# monday-clone

A clone of the popular project management tool, Monday.com. This project aims to replicate the core features and functionality of Monday.com, providing users with a visual and intuitive way to manage their tasks and projects.

## Features

*   **Multiple Views:** Switch between Table, Kanban, Calendar, and Timeline views to visualize your project data in different ways.
*   **Sidebar Navigation:** Easily navigate between different sections of the application using the sidebar, including links to Home, Tasks, and Dashboard.
*   **Header:** The header provides quick access to search, creating new tasks, filtering, notifications, and user profile settings.
*   **Mobile-Responsive:** The application is designed to be responsive and work well on different screen sizes, with a toggleable sidebar for mobile devices.

## Technologies Used

*   [React](https://reactjs.org/): A JavaScript library for building user interfaces.
*   [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript that compiles to plain JavaScript.
*   [Vite](https://vitejs.dev/): A build tool that provides a fast and efficient development experience.
*   [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for rapidly styling HTML elements.
*   [Zustand](https://github.com/pmndrs/zustand): A small, fast, and scalable bearbones state-management solution.

## Installation and Usage

1.  Clone the repository:

    ```bash
    git clone [repository URL]
    ```
2.  Install dependencies:

    ```bash
    npm install
    ```
3.  Start the development server:

    ```bash
    npm run dev
    ```

    This will start the application in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Project Structure

The project structure is organized as follows:

*   `src/`: Contains the main source code of the application.
    *   `App.tsx`: The main application component that sets up the overall layout.
    *   `components/`: Contains reusable React components.
        *   `BoardView.tsx`: Handles switching between different views (Table, Kanban, Calendar, Timeline).
        *   `Header.tsx`: Defines the header section of the application.
        *   `Sidebar.tsx`: Defines the sidebar navigation.
        *   `TableView.tsx`: Implements the table view.
        *   `KanbanView.tsx`: Implements the kanban view.
        *   `CalendarView.tsx`: Implements the calendar view.
        *   `TimelineView.tsx`: Implements the timeline view.
    *   `store/`: Contains state management logic.
        *   `viewStore.ts`: Manages the current view state using Zustand.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please feel free to open an issue or submit a pull request.
