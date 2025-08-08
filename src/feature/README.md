# Feature Layer

This directory contains all feature components that manage the integration logic and data fetching for the application. Each feature component is responsible for:

1. **Data Integration**: Using hooks from the data layer
2. **Business Logic**: Handling user interactions and state management
3. **Component Orchestration**: Combining UI components to create complete features

## Structure

```
feature/
├── auth/                 # Authentication features
├── user-dashboard/       # User dashboard feature
├── user-transactions/    # User transaction management
├── admin-dashboard/      # Admin dashboard feature
├── admin-users/         # Admin user management
├── manage-admins/       # Super admin user management
├── admin-transfers/     # Admin transfer management
├── settings/           # Shared settings component
└── index.ts           # Feature exports
```

## Pattern

Each feature follows this pattern:

### 1. Feature Component
```tsx
// feature/example-feature/ExampleFeature.tsx
interface ExampleFeatureProps {
  className?: string;
}

export const ExampleFeature: React.FC<ExampleFeatureProps> = ({ className }) => {
  // Data integration with hooks
  const { data, loading, error } = useExampleData();
  
  // Business logic and event handlers
  const handleAction = () => {
    // Handle user action
  };

  // UI orchestration
  return (
    <div className={className}>
      {/* Combine UI components */}
    </div>
  );
};
```

### 2. Index Export
```tsx
// feature/example-feature/index.ts
export * from "./ExampleFeature";
```

### 3. Page Integration
```tsx
// app/example/page.tsx
"use client";

import { ExampleFeature } from "../../feature/example-feature";

export default function ExamplePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <ExampleFeature />
    </div>
  );
}
```

## Benefits

1. **Separation of Concerns**: Pages only handle routing and layout
2. **Reusability**: Features can be used in multiple contexts
3. **Testability**: Each feature can be tested in isolation
4. **Maintainability**: Business logic is centralized in features
5. **Consistency**: All pages follow the same pattern

## Guidelines

1. **Keep pages simple**: Only handle layout and routing
2. **Feature components handle logic**: All data fetching and business logic
3. **Use the data layer**: Never make direct API calls in features
4. **Consistent props**: Always include `className?: string` for styling flexibility
5. **Clear naming**: Feature names should match their purpose