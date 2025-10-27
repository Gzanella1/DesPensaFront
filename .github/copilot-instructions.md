
## Project Overview
DesPensaFront is a web application for managing pantry inventory and user profiles. The project is organized into clear front-end and back-end boundaries, with static assets and templates supporting the user interface.

## Architecture & Key Components
- **server.js**: Entry point for the Node.js backend server. Handles routing and serves static files.
- **front/**: Contains front-end logic and scripts.
- **templete/**: HTML templates for different pages (e.g., `index.html`, `perfilusuario.html`).
- **css/**: Stylesheets for UI components (e.g., `sidebar.css`).
- **asset/**: Static assets (images, icons, etc.).
- **database/**: Database-related files (structure, scripts, or configs).
- **back/**: Backend logic, likely for API endpoints or business rules.
- **scriptTemplete/**: JavaScript files for dynamic template behavior (e.g., `carregarSidebar.js`).

## Developer Workflows
- **Start Server**: Run `node server.js` from the project root to launch the backend and serve the front-end.
- **Static File Serving**: All HTML templates and assets are served statically via the backend.
- **No build step**: There is no evidence of a build system (e.g., Webpack, Babel). Code changes are reflected immediately.

## Patterns & Conventions
- **Templates**: All user-facing pages are in `templete/`. Use these as entry points for UI changes.
- **Sidebar**: Sidebar logic is modularized in `scriptTemplete/carregarSidebar.js` and styled via `css/sidebar.css`.
- **Separation of Concerns**: Keep front-end scripts in `front/` and template scripts in `scriptTemplete/`.
- **Routing**: Add new routes in `server.js` to serve additional templates or APIs.
- **User Data**: User profile and search pages (`perfilusuario.html`, `busca_usuario.html`) are the main touchpoints for user-related features.

## Integration Points
- **Backend API**: If adding new data flows, connect via backend logic in `back/` and expose endpoints in `server.js`.
- **Database**: Any persistent data should be managed via scripts/configs in `database/`.

## Examples
- To add a new page: Create an HTML file in `templete/`, add styles in `css/`, scripts in `front/` or `scriptTemplete/`, and update `server.js` to serve the new route.
- To update sidebar: Edit `scriptTemplete/carregarSidebar.js` and `css/sidebar.css`.

## External Dependencies
- Node.js (see `package.json` for dependencies)

---
**For AI agents:**
- Always reference the correct directory for changes (e.g., templates in `templete/`, scripts in `front/` or `scriptTemplete/`).
- When in doubt about data flow, check `server.js` for routing and integration logic.
- Avoid introducing build tools unless explicitly requested.
