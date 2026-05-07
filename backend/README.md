# VMS Backend

## Purpose
API and real-time services for auth, company structure, projects, tasks, daily entries, reports, and chat.

## Runtime flow
- src/server.js: Connects to MongoDB, starts HTTP server, attaches Socket.IO.
- src/app.js: Express app, middleware, route registration, error handling.

## API routes (base paths)
- /api/auth: authentication, tokens, sessions
- /api/users: user profile and admin user management
- /api/company: company profile data
- /api/departments: department CRUD
- /api/employees: employee records
- /api/gate-passes: gate pass workflows
- /api/settings: configurable settings data
- /api/projects: project CRUD
- /api/tasks: task CRUD
- /api/entries: daily entries with strict timeline rules
- /api/reports: reporting endpoints
- /api/chat: conversation and message APIs

## File map
### Core
- src/app.js: Express app setup, middleware, routes.
- src/server.js: HTTP server startup and Socket.IO registration.

### Config
- src/config/db.js: MongoDB connection helper.

### Middleware
- src/middleware/authMiddleware.js: JWT auth, role and permission checks.
- src/middleware/errorHandler.js: Centralized error handling.
- src/middleware/ratelimite.middleware.js: Rate limiting.
- src/middleware/sanitize.middleware.js: Input sanitization.
- src/middleware/validation.middleware.js: Zod validation wrapper.

### Utils
- src/utils/appError.js: Application error helper.
- src/utils/date.utils.js: Date normalization and range helpers.
- src/utils/email.utils.js: Email sending helpers.
- src/utils/jwt.utils.js: JWT and refresh cookie helpers.
- src/utils/logger.utils.js: Winston logger setup.

### Seed
- src/seed_data/adminSeeder.js: Seed default admin user.

### Features
#### Auth
- src/features/auth/auth.controller.js: Auth endpoints logic.
- src/features/auth/auth.model.js: Session and password reset models.
- src/features/auth/auth.routes.js: Auth routes.
- src/features/auth/auth.service.js: Auth business logic.
- src/features/auth/auth.validation.js: Auth request validation.

#### Users
- src/features/user/user.controller.js: User endpoints logic.
- src/features/user/user.model.js: User schema and role permissions.
- src/features/user/user.routes.js: User routes.
- src/features/user/user.service.js: User business logic.
- src/features/user/user.validation.js: User request validation.

#### Company
- src/features/company/company.controller.js: Company endpoints logic.
- src/features/company/company.model.js: Company schema.
- src/features/company/company.routes.js: Company routes.
- src/features/company/company.service.js: Company business logic.
- src/features/company/company.validation.js: Company request validation.

#### Department
- src/features/department/department.controller.js: Department endpoints logic.
- src/features/department/department.model.js: Department schema.
- src/features/department/department.routes.js: Department routes.
- src/features/department/department.service.js: Department business logic.
- src/features/department/department.validation.js: Department request validation.

#### Employee
- src/features/employee/employee.controller.js: Employee endpoints logic.
- src/features/employee/employee.model.js: Employee schema.
- src/features/employee/employee.routes.js: Employee routes.
- src/features/employee/employee.service.js: Employee business logic.
- src/features/employee/employee.validation.js: Employee request validation.

#### Gate Pass
- src/features/gate_pass/gate_pass.controller.js: Gate pass endpoints logic.
- src/features/gate_pass/gate_pass.model.js: Gate pass schema.
- src/features/gate_pass/gate_pass.routes.js: Gate pass routes.
- src/features/gate_pass/gate_pass.service.js: Gate pass business logic.
- src/features/gate_pass/gate_pass.validation.js: Gate pass request validation.

#### Settings
- src/features/settings/setting.controller.js: Settings endpoints logic.
- src/features/settings/setting.model.js: Setting schema.
- src/features/settings/setting.routes.js: Settings routes.
- src/features/settings/setting.service.js: Settings business logic.
- src/features/settings/setting.validation.js: Settings request validation.
- src/features/settings/settingTemplate.model.js: Setting template schema.

#### Projects
- src/features/project/project.controller.js: Project endpoints logic.
- src/features/project/project.model.js: Project schema.
- src/features/project/project.routes.js: Project routes.
- src/features/project/project.service.js: Project business logic.
- src/features/project/project.validation.js: Project request validation.

#### Tasks
- src/features/task/task.controller.js: Task endpoints logic.
- src/features/task/task.model.js: Task schema.
- src/features/task/task.routes.js: Task routes.
- src/features/task/task.service.js: Task business logic.
- src/features/task/task.validation.js: Task request validation.

#### Entries
- src/features/entry/entry.controller.js: Entry endpoints logic.
- src/features/entry/entry.model.js: Entry schema with timeline blocks.
- src/features/entry/entry.routes.js: Entry routes.
- src/features/entry/entry.service.js: Entry business rules and validation.
- src/features/entry/entry.validation.js: Entry request validation.

#### Reports
- src/features/reports/reports.controller.js: Reports endpoints logic.
- src/features/reports/reports.routes.js: Reports routes.
- src/features/reports/reports.service.js: Report data aggregation.
- src/features/reports/reports.validation.js: Reports request validation.

#### Chat
- src/features/chat/chat.controller.js: Chat REST endpoints.
- src/features/chat/chat.model.js: Conversation and message schemas.
- src/features/chat/chat.routes.js: Chat routes.
- src/features/chat/chat.service.js: Chat business logic.
- src/features/chat/chat.socket.js: Socket.IO real-time handlers.
- src/features/chat/chat.validation.js: Chat request validation.
