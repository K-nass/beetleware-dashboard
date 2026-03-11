# Component Organization Guide

## Overview

This document explains the component organization structure for this Next.js application. All components are organized in a single, hierarchical structure under the `components/` directory at the project root.

## Directory Structure

```
components/
├── ui/                    # Shared, reusable UI components
│   ├── forms/            # Form-related components
│   ├── navigation/       # Navigation components
│   └── layout/           # Layout and structural components
├── features/             # Feature-specific component groups
│   ├── dashboard/        # Dashboard-related components
│   ├── listings/         # Listings management components
│   └── auth/             # Authentication components
└── locale/              # Internationalization components
    └── LocaleSwitcher/   # Locale switching functionality
```

## Component Placement Rules

### UI Components (`components/ui/`)

**Purpose**: Shared, reusable UI building blocks that can be used across multiple features.

**Characteristics**:
- No business logic
- Highly reusable
- Prop-driven
- No direct API calls
- No feature-specific dependencies

**Examples**:
- `FormDropdown.tsx` - Generic dropdown component for forms
- `CityRegionDropdowns.tsx` - Location selection components
- `ProtectedRoute.tsx` - Route protection wrapper

**When to use**: Place components here when they are:
- Used by multiple features
- Generic UI elements
- Form controls and inputs
- Layout components
- Navigation elements

### Feature Components (`components/features/`)

**Purpose**: Feature-specific components that contain business logic and are tied to particular application features.

**Characteristics**:
- Contains business logic
- Feature-specific functionality
- May use UI components
- Can make API calls
- Tied to specific data models

**Examples**:
- `dashboard/charts/CommissionByLocation.tsx` - Dashboard-specific chart
- `listings/ListingCard.tsx` - Listing display component
- `dashboard/statistics/StatisticsCard.tsx` - Dashboard statistics

**When to use**: Place components here when they are:
- Specific to a particular feature (dashboard, listings, etc.)
- Contain business logic
- Handle feature-specific data
- Implement feature workflows

### Locale Components (`components/locale/`)

**Purpose**: Components that handle internationalization and locale-specific functionality.

**Characteristics**:
- Handles locale context
- Translation logic
- Language switching
- Locale-aware formatting

**Examples**:
- `LocaleSwitcher/LocaleSwitcher.tsx` - Language selection component

**When to use**: Place components here when they:
- Handle language switching
- Manage locale context
- Provide locale-specific formatting
- Deal with internationalization

## Import Patterns

### TypeScript Path Mappings

The following path mappings are configured in `tsconfig.json`:

```typescript
{
  "paths": {
    "@/components/*": ["./components/*"],
    "@/components/ui/*": ["./components/ui/*"],
    "@/components/features/*": ["./components/features/*"],
    "@/components/locale/*": ["./components/locale/*"]
  }
}
```

### Import Examples

```typescript
// UI Components
import { FormDropdown } from '@/components/ui/forms/FormDropdown';
import { CityRegionDropdowns } from '@/components/ui/forms/CityRegionDropdowns';
import { ProtectedRoute } from '@/components/ui/layout/ProtectedRoute';

// Feature Components
import { CommissionByLocation } from '@/components/features/dashboard/charts/CommissionByLocation';
import { ListingCard } from '@/components/features/listings/ListingCard';
import { StatisticsCard } from '@/components/features/dashboard/statistics/StatisticsCard';

// Locale Components
import { LocaleSwitcher } from '@/components/locale/LocaleSwitcher/LocaleSwitcher';
```

## Decision Tree for Component Placement

When adding a new component, ask these questions:

1. **Is this component reusable across multiple features?**
   - Yes → Place in `components/ui/`
   - No → Continue to question 2

2. **Does this component handle internationalization or locale-specific functionality?**
   - Yes → Place in `components/locale/`
   - No → Continue to question 3

3. **Is this component specific to a particular business feature?**
   - Yes → Place in `components/features/{feature-name}/`
   - No → Reconsider if it should be in `components/ui/`

## Subdirectory Guidelines

### UI Subdirectories

- `forms/` - Form controls, inputs, dropdowns, validation components
- `navigation/` - Navbar, sidebar, breadcrumbs, menu components
- `layout/` - Page layouts, wrappers, containers, route protection

### Feature Subdirectories

- `dashboard/` - Dashboard-specific components (charts, statistics, widgets)
- `listings/` - Listing management components (cards, filters, forms)
- `auth/` - Authentication-related components (login forms, user profiles)

## Best Practices

### Component Naming

- Use PascalCase for component files: `ComponentName.tsx`
- Use descriptive names that indicate purpose
- Avoid generic names like `Component.tsx` or `Item.tsx`

### Directory Naming

- Use lowercase with hyphens for multi-word directories: `page-header/`
- Use singular nouns for feature directories: `dashboard/`, not `dashboards/`
- Group related components in subdirectories when there are 3+ related components

### Import Organization

- Use absolute imports with TypeScript path mappings
- Group imports by category (UI, features, locale)
- Prefer named imports over default imports for consistency

### Component Dependencies

- UI components should not depend on feature components
- Feature components can use UI components
- Locale components should be independent when possible
- Avoid circular dependencies between components

## Migration Notes

This structure was created by consolidating two previous component directories:
- `app/[locale]/components/` (locale-specific, page-level components)
- `lib/components/` (shared utility components)

All existing functionality has been preserved, and import statements have been automatically updated throughout the application.