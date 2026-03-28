---
inclusion: always
---

# Performance Optimization Rules

## React Performance Rules
- ALWAYS use React.memo for components that re-render frequently
- ALWAYS use useCallback for functions passed to child components
- ALWAYS use useMemo for expensive calculations
- ALWAYS use React.startTransition for non-urgent state updates
- ALWAYS use lazy loading for routes and heavy components
- NEVER create objects or functions inside render methods
- ALWAYS use proper dependency arrays in useEffect and hooks

## Memory Management Rules
- ALWAYS clean up subscriptions, timers, and event listeners in useEffect
- ALWAYS use AbortController for cancelable API requests
- ALWAYS implement proper cleanup in custom hooks
- ALWAYS use WeakMap/WeakSet for object references
- ALWAYS avoid memory leaks in event handlers
- ALWAYS use proper key props for list items

## Bundle Optimization Rules
- ALWAYS implement code splitting for routes
- ALWAYS use dynamic imports for heavy libraries
- ALWAYS optimize images and assets
- ALWAYS use tree shaking for unused code elimination
- ALWAYS implement proper chunk splitting
- ALWAYS use compression for production builds

## Data Fetching Rules
- ALWAYS implement proper caching strategies
- ALWAYS use optimistic updates for better UX
- ALWAYS implement proper loading states
- ALWAYS handle error states gracefully
- ALWAYS use debouncing for search inputs
- ALWAYS implement proper retry logic for failed requests

## Quiz-Specific Performance Rules
- ALWAYS virtualize long quiz lists
- ALWAYS implement progressive loading for large quiz sets
- ALWAYS cache quiz questions and answers
- ALWAYS optimize quiz state updates
- ALWAYS implement proper quiz session management
- ALWAYS use efficient algorithms for quiz scoring

## Rendering Optimization Rules
- ALWAYS avoid unnecessary re-renders
- ALWAYS use proper key props for dynamic lists
- ALWAYS implement proper conditional rendering
- ALWAYS use CSS-in-JS sparingly
- ALWAYS optimize CSS animations and transitions
- ALWAYS use proper loading skeletons

## State Management Rules
- ALWAYS use local state for component-specific data
- ALWAYS use context for global state sparingly
- ALWAYS implement proper state normalization
- ALWAYS use immutable state updates
- ALWAYS avoid deeply nested state objects
- ALWAYS implement proper state persistence
## Advanced Performance Patterns
- ALWAYS implement virtual scrolling for large quiz lists
- ALWAYS use React.lazy() for code splitting quiz components
- ALWAYS implement service workers for offline quiz functionality
- ALWAYS use Intersection Observer for lazy loading quiz content
- ALWAYS implement proper memory management for quiz sessions
- ALWAYS use Web Workers for heavy quiz calculations
- ALWAYS implement proper cleanup for quiz timers and intervals

## Quiz-Specific Performance Rules
- ALWAYS preload next quiz question while current is displayed
- ALWAYS implement quiz answer caching to reduce API calls
- ALWAYS use efficient algorithms for quiz scoring calculations
- ALWAYS implement progressive loading for large quiz datasets
- ALWAYS optimize quiz image loading with proper formats and sizes
- ALWAYS implement quiz session state compression for storage
- ALWAYS use efficient data structures for quiz question lookup

## Performance Monitoring Rules
- ALWAYS track Core Web Vitals for quiz pages
- ALWAYS monitor quiz loading performance metrics
- ALWAYS track quiz interaction response times
- ALWAYS monitor quiz memory usage patterns
- ALWAYS track quiz network request efficiency
- ALWAYS monitor quiz rendering performance
- ALWAYS implement performance budgets for quiz features

description:
globs:
alwaysApply: false
---
