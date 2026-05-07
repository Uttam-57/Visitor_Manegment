# VMS Frontend

## Purpose
React UI for authentication, dashboards, gate passes, users, settings, and reports.

## Entry and routing
- src/main.jsx: App bootstrap and root render.
- src/App.jsx: RouterProvider wrapper.
- src/app/router.jsx: Primary route configuration.
- src/app/router/index.jsx: Route helpers and extensions.
- src/shared/constants/routes.js: Central route constants.

## File map
### App
- src/app/router.jsx: Application router.

### Pages
- src/pages/NotFound.jsx: 404 page.
- src/pages/gatepass/GatePassList.jsx: Gate pass listing.
- src/pages/users/UsersList.jsx: Users listing.
- src/pages/settings/Settings.jsx: Settings page.
- src/pages/reports/Reports.jsx: Reports screen (gate pass report today).
- src/pages/dashboard/Dashboard.jsx: Dashboard placeholder.
- src/pages/projects/ProjectsList.jsx: Projects list and create form.
- src/pages/tasks/TasksList.jsx: Tasks list and create form.
- src/pages/entries/Entries.jsx: Daily entry creation and listing.
- src/pages/chat/Chat.jsx: Chat conversations and messaging.
- src/pages/auth/Login.jsx: Login page.
- src/pages/auth/Login.test.jsx: Login tests.
- src/pages/auth/ForgotPassword.jsx: Forgot password page.
- src/pages/auth/ResetPassword.jsx: Reset password page.
- src/pages/auth/ChangePassword.jsx: Change password page.

### Features
- src/features/gatepass/hooks/useGatePasses.js: Gate pass data hook.
- src/features/settings/hooks/useSettings.js: Settings data hook.
- src/features/users/hooks/useUsers.js: Users data hook.
- src/features/projects/hooks/useProjects.js: Project data hook.
- src/features/tasks/hooks/useTasks.js: Task data hook.
- src/features/entries/hooks/useEntries.js: Entry data hook.
- src/features/reports/hooks/useReports.js: Report data hook.
- src/features/chat/hooks/useChatSocket.js: Socket.IO chat connection.

### Shared config and services
- src/shared/config/env.js: Frontend env configuration.
- src/shared/services/api.js: Axios client with auth refresh.
- src/shared/services/apiClient.js: Axios client with metrics logging.
- src/shared/constants/api.js: API endpoint constants.
- src/shared/constants/app.js: App constants.

### Shared store
- src/shared/store/authStore.js: Auth store and session state.

### Shared layouts
- src/shared/layouts/AuthLayout.jsx: Auth layout wrapper.
- src/shared/layouts/MainLayout.jsx: Authenticated layout wrapper.

### Shared utils
- src/shared/utils/cn.js: Classname utilities.
- src/shared/utils/logger.js: Frontend logger wrapper.

### Shared UI atoms
- src/shared/ui/atoms/Alert/Alert.jsx: Alert component.
- src/shared/ui/atoms/Alert/index.js: Alert export.
- src/shared/ui/atoms/Badge/Badge.jsx: Badge component.
- src/shared/ui/atoms/Badge/index.js: Badge export.
- src/shared/ui/atoms/Button.jsx: Legacy button component.
- src/shared/ui/atoms/Button/Button.jsx: Button component.
- src/shared/ui/atoms/Button/index.js: Button export.
- src/shared/ui/atoms/Card/Card.jsx: Card component.
- src/shared/ui/atoms/Card/index.js: Card export.
- src/shared/ui/atoms/Checkbox/Checkbox.jsx: Checkbox component.
- src/shared/ui/atoms/Checkbox/index.js: Checkbox export.
- src/shared/ui/atoms/Divider/Divider.jsx: Divider component.
- src/shared/ui/atoms/Divider/index.js: Divider export.
- src/shared/ui/atoms/Icon/Icon.jsx: Icon component.
- src/shared/ui/atoms/Input.jsx: Legacy input component.
- src/shared/ui/atoms/Input/Input.jsx: Input component.
- src/shared/ui/atoms/Input/index.js: Input export.
- src/shared/ui/atoms/Label/Label.jsx: Label component.
- src/shared/ui/atoms/Label/index.js: Label export.
- src/shared/ui/atoms/Spinner/spinner.jsx: Spinner component.
- src/shared/ui/atoms/Spinner/index.js: Spinner export.
- src/shared/ui/atoms/Toggle/Toggle.jsx: Toggle component.
- src/shared/ui/atoms/Toggle/index.js: Toggle export.
- src/shared/ui/atoms/Typography/Typography.jsx: Typography component.
- src/shared/ui/atoms/Typography/index.js: Typography export.
- src/shared/ui/atoms/index.js: Atom exports.

### Shared UI molecules
- src/shared/ui/molecules/Drawer/Drawer.jsx: Drawer component.
- src/shared/ui/molecules/Drawer/index.js: Drawer export.
- src/shared/ui/molecules/FormField/FormField.jsx: Form field component.
- src/shared/ui/molecules/FormField/index.js: Form field export.
- src/shared/ui/molecules/KeyValueRow/KeyValueRow.jsx: Key value row component.
- src/shared/ui/molecules/Pagination/Pagination.jsx: Pagination component.
- src/shared/ui/molecules/Pagination/index.js: Pagination export.
- src/shared/ui/molecules/PasswordField/PasswordField.jsx: Password field component.
- src/shared/ui/molecules/PasswordField/index.js: Password field export.
- src/shared/ui/molecules/QuantityInput/QuantityInput.jsx: Quantity input component.
- src/shared/ui/molecules/QuantityInput/Index.js: Quantity input export.
- src/shared/ui/molecules/SearchBar/SearchBar.jsx: Search bar component.
- src/shared/ui/molecules/SearchBar/index.js: Search bar export.
- src/shared/ui/molecules/Tabs/Tabs.jsx: Tabs component.
- src/shared/ui/molecules/Tabs/index.js: Tabs export.

### Shared UI organisms
- src/shared/ui/organisms/ErrorBoundary.jsx: Error boundary.
- src/shared/ui/organisms/Header.jsx: Top header.
- src/shared/ui/organisms/RouteErrorBoundary.jsx: Router error boundary.
- src/shared/ui/organisms/PageHeader/PageHeader.jsx: Page header.
- src/shared/ui/organisms/PageLoadingState/PageLoadingState.jsx: Loading state.
- src/shared/ui/organisms/PageMessageState/PageMessageState.jsx: Message state.
- src/shared/ui/organisms/Sidebar.jsx: Sidebar component.
- src/shared/ui/organisms/Sidebar/Sidebar.jsx: Sidebar content.
- src/shared/ui/organisms/Sidebar/index.js: Sidebar export.
- src/shared/ui/organisms/Table.jsx: Table component.
- src/shared/ui/organisms/ToastStack.jsx: Toast stack.
- src/shared/ui/organisms/Navbar/Navbar.jsx: Navbar component.
- src/shared/ui/organisms/Navbar/Navbar.icons.jsx: Navbar icons.
- src/shared/ui/organisms/Navbar/Navbar.utils.js: Navbar helpers.
- src/shared/ui/organisms/Navbar/index.js: Navbar export.
- src/shared/ui/organisms/Footer/Footer.jsx: Footer component.
- src/shared/ui/organisms/Footer/index.js: Footer export.
- src/shared/ui/index.js: UI barrel exports.

### Styles and tests
- src/styles/index.css: Global styles.
- src/setupTests.js: Test setup.

## Notes
- Reports, projects, tasks, entries, and chat are wired to backend endpoints.
