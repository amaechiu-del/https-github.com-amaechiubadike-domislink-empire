# DomisLink Empire - Development Guidelines

## Code Quality Standards

### TypeScript Usage
- **Strict typing enforced**: All files use TypeScript with proper type definitions
- **Interface definitions**: External API responses and component props are properly typed
- **Type assertions**: Use `as any` sparingly, prefer proper type definitions
- **Optional chaining**: Consistent use of `?.` for safe property access

### Component Architecture
- **Client-side components**: Use `'use client'` directive for interactive components
- **Functional components**: All React components use function syntax, not class-based
- **Hook patterns**: useState and useEffect are primary state management tools
- **Component composition**: Large components broken into smaller, reusable pieces

### File Organization Patterns
- **Page components**: Simple wrapper components that import main functionality
- **API routes**: Follow Next.js 13+ app router structure (`route.ts` files)
- **Component separation**: Business logic separated from presentation components
- **Consistent imports**: External libraries imported first, then internal modules

## Naming Conventions

### Variables and Functions
- **camelCase**: All variables and functions use camelCase (`formData`, `createListing`)
- **Descriptive names**: Variables clearly indicate their purpose (`filteredListings`, `selectedTemplate`)
- **Boolean prefixes**: Boolean variables use `is`, `has`, `show` prefixes (`showCreateListing`, `ready`)
- **Event handlers**: Use descriptive action names (`handleSubmit`, `loadListings`)

### Components and Files
- **PascalCase**: Component names use PascalCase (`RealEstateApp`, `CreateListingModal`)
- **Descriptive filenames**: Files named after their primary export or purpose
- **Route naming**: API routes use descriptive paths (`/api/flights/search`, `/api/airports`)

### Constants and Configuration
- **UPPER_SNAKE_CASE**: Constants use uppercase with underscores (`PRICING`, `TEMPLATES`)
- **Grouped constants**: Related constants organized in objects
- **Template naming**: Consistent template naming pattern (`TEMPLATE_1`, `TEMPLATE_2`)

## Styling Patterns

### CSS-in-JS with styled-jsx
- **Inline styles**: Use styled-jsx for component-specific styling
- **Scoped styling**: Each component contains its own style block
- **Responsive design**: Grid layouts with `repeat(auto-fit, minmax())` pattern
- **Color consistency**: Consistent color palette across components

### Style Organization
```jsx
<style jsx>{`
  .component-name {
    /* Main container styles */
  }
  .element-class {
    /* Element-specific styles */
  }
`}</style>
```

### Common Style Patterns
- **Grid layouts**: `display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))`
- **Card components**: Consistent border-radius, box-shadow, and padding
- **Button styling**: Consistent padding, border-radius, and hover effects
- **Color schemes**: Dark themes with accent colors (`#EEFF00`, `#4CAF50`)

## API Design Patterns

### Route Structure
- **RESTful endpoints**: Follow REST conventions for API routes
- **Error handling**: Consistent error response format with status codes
- **Parameter validation**: Input validation before processing requests
- **Response format**: Standardized response structure with `success`, `data`, `error` fields

### Request/Response Patterns
```typescript
// Request validation
if (!requiredParam) {
  return NextResponse.json(
    { error: 'Missing required parameter' },
    { status: 400 }
  )
}

// Success response
return NextResponse.json({
  success: true,
  data: results,
  count: results.length
})
```

### Error Handling
- **Try-catch blocks**: All API routes wrapped in try-catch
- **Console logging**: Errors logged to console for debugging
- **User-friendly messages**: Generic error messages for client consumption
- **Status codes**: Appropriate HTTP status codes (400, 500, etc.)

## State Management Patterns

### React Hooks Usage
- **useState**: Primary state management for component-level state
- **useEffect**: Used for data loading and side effects
- **State initialization**: Proper initial state values with correct types
- **State updates**: Immutable state updates using spread operator

### Form Handling
```typescript
const [formData, setFormData] = useState({
  field1: '',
  field2: '',
  // ... other fields
})

const handleChange = (field: string, value: string) => {
  setFormData({...formData, [field]: value})
}
```

### Data Loading Patterns
- **Async functions**: Database operations use async/await pattern
- **Loading states**: Components track loading states for better UX
- **Error states**: Proper error handling and user feedback
- **Data refetching**: Functions to reload data after mutations

## Database Integration

### Supabase Patterns
- **Client initialization**: Consistent Supabase client setup across components
- **Query patterns**: Use of select, insert, update with proper chaining
- **Relationship queries**: Join queries using select with related table syntax
- **Real-time subscriptions**: Prepared for real-time data updates

### Data Operations
```typescript
// Query pattern
const { data } = await supabase
  .from('table_name')
  .select('*, related_table(field)')
  .eq('status', 'active')
  .order('created_at', { ascending: false })

// Insert pattern
const { data } = await supabase
  .from('table_name')
  .insert(insertData)
  .select()
```

## Payment Integration

### Paystack Implementation
- **Dynamic script loading**: Paystack script loaded dynamically when needed
- **Ready state tracking**: Component tracks when payment library is ready
- **Configuration object**: Consistent payment configuration structure
- **Callback handling**: Proper success and error callback implementation

### Payment Flow
```typescript
const handler = (window as any).PaystackPop.setup({
  key: "pk_test_...",
  email: userEmail,
  amount: amountInKobo,
  currency: "NGN",
  ref: "PREFIX" + Date.now(),
  callback: handleSuccess,
  onClose: handleCancel
})
```

## Performance Optimization

### Component Optimization
- **Conditional rendering**: Use of conditional operators for dynamic content
- **Event handler optimization**: Inline functions used judiciously
- **State minimization**: Only necessary state stored in components
- **Effect dependencies**: Proper dependency arrays for useEffect

### Data Handling
- **Filtering patterns**: Client-side filtering for better user experience
- **Pagination ready**: Structure supports pagination implementation
- **Caching considerations**: Prepared for data caching strategies

## Security Practices

### Environment Variables
- **API key protection**: Sensitive keys stored in environment variables
- **Client-side exposure**: Only public keys exposed to client-side code
- **Test keys**: Use of test keys in development environment

### Input Validation
- **Required field validation**: Form validation before submission
- **Type checking**: Proper type validation for numeric inputs
- **Sanitization**: Input sanitization for database operations

## Development Workflow

### Code Organization
- **Single responsibility**: Each component has a clear, single purpose
- **Reusable components**: Common functionality extracted into reusable components
- **Configuration separation**: Constants and configuration separated from logic
- **Import organization**: Consistent import statement organization

### Testing Considerations
- **Testable structure**: Components structured for easy unit testing
- **Mock-friendly**: External dependencies easily mockable
- **Error boundaries**: Prepared for error boundary implementation
- **Accessibility**: Basic accessibility considerations in component structure