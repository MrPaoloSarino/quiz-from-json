---
inclusion: always
---

# Error Handling & Debugging Rules

## Error Boundary Rules
- ALWAYS implement error boundaries around major feature components
- ALWAYS provide meaningful error messages to users
- ALWAYS log errors to monitoring services
- ALWAYS implement fallback UI for error states
- ALWAYS handle different types of errors appropriately
- ALWAYS provide recovery options when possible

## Async Error Handling Rules
- ALWAYS use try-catch blocks for async operations
- ALWAYS handle Promise rejections properly
- ALWAYS implement proper error recovery strategies
- ALWAYS provide user feedback for async errors
- ALWAYS implement retry mechanisms for transient failures
- ALWAYS handle network errors gracefully

## Debugging Rules
- ALWAYS use structured logging with context
- ALWAYS implement proper debug modes
- ALWAYS use meaningful console messages
- ALWAYS include relevant data in error logs
- ALWAYS implement proper stack trace handling
- ALWAYS use development-only debugging features

## Quiz-Specific Error Rules
- ALWAYS handle quiz loading failures gracefully
- ALWAYS validate quiz data before rendering
- ALWAYS handle AI service failures properly
- ALWAYS implement quiz state recovery mechanisms
- ALWAYS handle storage failures with fallbacks
- ALWAYS validate user input before processing

## Error Prevention Rules
- ALWAYS validate data at boundaries
- ALWAYS use proper type guards
- ALWAYS implement proper null checks
- ALWAYS handle edge cases explicitly
- ALWAYS use defensive programming techniques
- ALWAYS implement proper input sanitization

## Monitoring Rules
- ALWAYS track error rates and patterns
- ALWAYS implement performance monitoring
- ALWAYS track user interactions that lead to errors
- ALWAYS implement proper error categorization
- ALWAYS set up alerts for critical errors
- ALWAYS implement error trend analysis

## Development Debugging Rules
- ALWAYS use React DevTools for component debugging
- ALWAYS use proper source maps for debugging
- ALWAYS implement debug logging in development
- ALWAYS use proper breakpoints and debugging tools
- ALWAYS implement proper error reproduction steps
- ALWAYS document known issues and workarounds

## Production Error Rules
- ALWAYS sanitize error messages in production
- ALWAYS implement proper error reporting
- ALWAYS handle errors without exposing sensitive data
- ALWAYS implement proper error recovery in production
- ALWAYS monitor error impact on user experience
- ALWAYS implement proper error escalation procedures
description:
globs:
alwaysApply: false
---
