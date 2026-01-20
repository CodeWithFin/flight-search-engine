# Flight Search Engine - Product Requirements Document

## 1. Overview

### 1.1 Product Vision
Build a modern, responsive flight search engine that delivers an intuitive booking research experience with real-time price insights and powerful filtering capabilities. The application will leverage the Amadeus Self-Service API to provide comprehensive flight data while offering a cleaner, more focused UX than traditional flight search tools.

### 1.2 Success Metrics
- Users can complete a flight search in under 30 seconds
- Filter interactions update results in under 500ms
- 100% responsive experience across mobile (320px+) and desktop (1440px+)
- Zero-crash rate during normal operation
- Clear visual feedback for all loading and error states

### 1.3 Timeline & Scope
- **Delivery Window**: 4 days (max 16 work hours)
- **API**: Amadeus Self-Service API (Test Environment)
- **Deliverables**: GitHub repo, live hosted link, 3-4 min Loom demo

---

## 2. User Stories & Requirements

### 2.1 Core User Flows

#### Primary Flow: Flight Search
**As a traveler**, I want to search for flights between two cities on specific dates so that I can find the best options for my trip.

**Acceptance Criteria**:
- Input fields for Origin (airport/city), Destination (airport/city)
- Date picker for departure date (and optional return date for round-trip)
- Passenger count selector (adults, children, infants)
- Cabin class selector (Economy, Premium Economy, Business, First)
- One-way vs Round-trip toggle
- Search button triggers API call to Amadeus
- Loading state displays while fetching results
- Error handling for invalid inputs or API failures

#### Secondary Flow: Browse & Filter Results
**As a user reviewing flight options**, I want to filter and sort results dynamically so that I can quickly find flights matching my preferences.

**Acceptance Criteria**:
- Results display in a scannable list format showing:
  - Airline logo and name
  - Departure/arrival times with duration
  - Number of stops
  - Price per passenger
  - Aircraft type (optional enhancement)
- Filters update results instantly without page reload:
  - **Price range**: Min/max slider
  - **Number of stops**: Nonstop, 1 stop, 2+ stops
  - **Airlines**: Multi-select checkboxes
  - **Departure/arrival time ranges**: Morning, afternoon, evening, night
  - **Duration**: Max flight time slider
- Sort options: Price (low to high), Duration (shortest first), Departure time, Arrival time
- Filter count badge shows active filters
- "Clear all filters" option
- Results count displays (e.g., "Showing 47 of 120 flights")

#### Tertiary Flow: Price Trend Analysis
**As a price-conscious traveler**, I want to see price trends across available flights so that I can understand if I'm getting a good deal.

**Acceptance Criteria**:
- Line or bar chart displays price distribution across all search results
- X-axis: Price ranges or time-based groupings
- Y-axis: Number of flights or aggregated metrics
- Chart updates in real-time when filters are applied
- Visual indicators for lowest/highest prices
- Hover states show detailed price breakdowns
- Responsive chart scales appropriately on mobile

---

## 3. Functional Requirements

### 3.1 Search Interface

#### Search Form Components
| Component | Type | Validation | Default |
|-----------|------|------------|---------|
| Origin | Autocomplete text input | Required, must be valid airport/city | User's location or empty |
| Destination | Autocomplete text input | Required, must be valid airport/city, different from origin | Empty |
| Departure Date | Date picker | Required, cannot be in the past | Today |
| Return Date | Date picker (optional) | Must be after departure date | Empty (one-way) |
| Passengers | Number input/dropdown | Min: 1, Max: 9 | 1 adult |
| Cabin Class | Dropdown | Required | Economy |
| Trip Type | Toggle/Radio | One-way or Round-trip | Round-trip |

#### Search Behavior
- Autocomplete for origin/destination uses airport codes and city names
- Date pickers prevent past date selection
- Return date auto-adjusts if before departure date
- Form validation prevents submission with incomplete/invalid data
- Loading spinner replaces search button during API call
- Search parameters persist in URL for shareability

### 3.2 Results Display

#### Flight Card Information Architecture
```
┌─────────────────────────────────────────────────┐
│ [Airline Logo] Airline Name                     │
│                                                  │
│ 08:00 AM → 02:30 PM    Duration: 6h 30m         │
│ JFK         SFO        1 stop (ORD)             │
│                                                  │
│ Economy • Boeing 737                            │
│                                    $347 per person│
└─────────────────────────────────────────────────┘
```

**Required Fields**:
- Carrier name and logo
- Departure/arrival airports and times
- Total duration
- Number and location of stops
- Base fare price
- Cabin class

**Optional Enhancements**:
- Baggage allowance
- Wi-Fi availability
- Seat availability indicator
- Carbon emissions estimate
- "Best value" or "Fastest" badges

#### Empty & Error States
- **No results found**: Suggest relaxing filters or alternative dates
- **API error**: Display friendly error message with retry option
- **Network error**: Offline indicator with guidance
- **Loading**: Skeleton screens for flight cards

### 3.3 Filtering System

#### Filter Categories & Logic

**Price Range Filter**
- Dual-handle slider with min/max bounds
- Dynamically sets based on search results (e.g., $200 - $1,500)
- Updates in real-time as user drags handles
- Display current range values above slider

**Stops Filter**
- Checkbox group: Nonstop, 1 stop, 2+ stops
- Allow multiple selections (OR logic)
- Show flight count next to each option
- Disable options with zero results

**Airlines Filter**
- Searchable multi-select list
- Sort alphabetically
- Show airline logos
- Display flight count per airline
- "Select all" / "Clear all" options

**Time of Day Filters**
- Separate filters for departure and arrival times
- Segments: Early morning (12am-6am), Morning (6am-12pm), Afternoon (12pm-6pm), Evening (6pm-12am)
- Multi-select checkboxes

**Duration Filter**
- Single-handle slider
- Shows maximum duration in search results
- Display value in hours and minutes

#### Filter Interaction Patterns
- All filters applied simultaneously (AND logic between categories, OR within)
- Instant updates (no "Apply" button needed)
- Filter state persists during session
- URL updates with filter parameters for sharing
- Mobile: Filters in expandable drawer/modal

### 3.4 Price Graph

#### Graph Specifications
- **Library**: Recharts (preferred) or D3.js
- **Chart Type**: Line chart, bar chart, or histogram
- **Update Frequency**: Real-time on filter change (debounced 300ms)
- **Data Groupings**: 
  - Option A: Price buckets ($50 increments showing flight count)
  - Option B: Timeline showing cheapest flight per day (for flexible dates)
  - Option C: Scatter plot of price vs. duration

#### Graph Features
- Responsive sizing (scales to container)
- Hover tooltips showing detailed information
- X and Y axis labels with clear units
- Legend if multiple data series
- Highlight current filter range or selection
- Accessibility: Keyboard navigable, screen reader friendly

#### Graph Updates
- Smooth transitions when data changes
- Loading indicator for async updates
- Graceful handling of empty datasets

---

## 4. Technical Specifications

### 4.1 Architecture

#### Tech Stack
- **Framework**: React with hooks (useState, useEffect, useCallback, useMemo)
- **Visualization**: Recharts (primary) or D3.js
- **Styling**: Tailwind CSS utility classes (core utilities only)
- **API Integration**: Amadeus Self-Service API (test environment)
- **State Management**: React Context or local component state
- **Date Handling**: Native Date API or lightweight library
- **Deployment**: Vercel, Netlify, or similar

#### Component Structure
```
App
├── SearchForm
│   ├── LocationInput (Origin/Destination)
│   ├── DatePicker
│   ├── PassengerSelector
│   └── CabinClassSelector
├── ResultsContainer
│   ├── FilterPanel
│   │   ├── PriceRangeFilter
│   │   ├── StopsFilter
│   │   ├── AirlinesFilter
│   │   └── TimeFilter
│   ├── PriceGraph
│   └── FlightList
│       └── FlightCard (repeated)
└── ErrorBoundary
```

### 4.2 API Integration

#### Amadeus API Endpoints
- **Flight Offers Search**: `GET /v2/shopping/flight-offers`
- **Airport & City Search**: `GET /v1/reference-data/locations`
- **Authentication**: OAuth 2.0 client credentials flow

#### Request Flow
1. User submits search form
2. Validate input parameters
3. Fetch access token (cache for 30 minutes)
4. Call flight offers endpoint with parameters
5. Transform response data for UI consumption
6. Update application state
7. Render results, filters, and graph

#### Error Handling
- API rate limiting: Display friendly message, implement retry with exponential backoff
- Invalid credentials: Log error, provide setup instructions
- Malformed requests: Client-side validation to prevent
- Timeout: 30-second timeout, show error with retry option
- Network errors: Detect offline state, queue requests

#### Data Transformation
```javascript
// Raw Amadeus response → App state
{
  rawFlight: AmadeusFlightOffer,
  transformed: {
    id: string,
    airline: { code, name, logo },
    departure: { airport, time, date },
    arrival: { airport, time, date },
    duration: number (minutes),
    stops: number,
    stopLocations: string[],
    price: { amount, currency },
    cabinClass: string,
    aircraft: string,
    segments: [...], // For multi-leg flights
  }
}
```

### 4.3 Performance Optimization

#### Target Metrics
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.0s
- Filter update latency: < 300ms
- Search result render: < 500ms

#### Optimization Strategies
- Debounce filter inputs (300ms)
- Memoize expensive computations (useMemo)
- Virtualize long flight lists (react-window optional)
- Lazy load images (airline logos)
- Code splitting for non-critical components
- Minimize bundle size (tree-shaking, compression)
- Cache API responses in session storage
- Optimize graph re-renders (React.memo)

### 4.4 Responsive Design

#### Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

#### Mobile Adaptations
- Single-column layout
- Filters in slide-out drawer or bottom sheet
- Stacked flight cards with simplified information
- Collapsible sections to save vertical space
- Touch-friendly tap targets (min 44x44px)
- Horizontal scrollable tabs for filter categories
- Simplified graph (fewer data points, larger touch targets)

#### Desktop Enhancements
- Two or three-column layout (filters | results | details)
- Sticky filter panel
- Expandable flight details on hover/click
- Multiple flights visible without scrolling
- Larger, more detailed price graph
- Keyboard shortcuts for power users

---

## 5. User Experience Design

### 5.1 Design Principles

1. **Speed & Efficiency**: Minimize clicks and cognitive load to complete searches
2. **Transparency**: Show all costs, constraints, and trade-offs clearly
3. **Flexibility**: Support various search strategies (price-focused, time-focused, etc.)
4. **Confidence**: Provide enough information for informed decisions
5. **Delight**: Smooth interactions, thoughtful micro-animations, polished visuals

### 5.2 Visual Design Direction

#### Inspiration (Not Cloning)
- Google Flights: Clean information hierarchy, effective use of whitespace
- Improvements over Google Flights:
  - More prominent price graph integration
  - Clearer filter affordances
  - Better mobile filtering experience
  - Stronger visual hierarchy in flight cards

#### Color Palette Suggestions
- Primary: Modern blue or purple for CTAs
- Success: Green for best deals
- Warning: Amber for price alerts
- Neutral: Gray scale for text hierarchy
- Background: White or very light gray, optional dark mode

#### Typography
- Clear hierarchy: Distinct sizes for headings, body, labels
- Readable font size: Min 14px body text on mobile
- Monospace for times and prices (optional)
- Sans-serif primary font for modern aesthetic

#### Interactive States
- Hover: Subtle background color change, slight elevation
- Active/Selected: Border or background highlight
- Disabled: Reduced opacity, cursor not-allowed
- Loading: Skeleton screens or pulse animations
- Focus: Visible outline for keyboard navigation

### 5.3 Micro-interactions

- Smooth filter slider transitions
- Flight card hover elevation
- Graph animations on data update (300ms ease-in-out)
- Loading spinners for async operations
- Success confirmation after search
- Subtle animation when flights load
- Filter count badge pulse on change

---

## 6. Quality Assurance

### 6.1 Testing Checklist

#### Functional Testing
- [ ] All search form validations work correctly
- [ ] API integration returns expected data
- [ ] Filters correctly reduce result set
- [ ] Multiple simultaneous filters work together
- [ ] Price graph updates when filters change
- [ ] Sort functionality reorders results
- [ ] Clear filters resets to full result set
- [ ] Error states display appropriately
- [ ] Loading states show during async operations

#### Cross-browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

#### Responsive Testing
- [ ] iPhone SE (375px width)
- [ ] iPhone 12/13/14 (390px width)
- [ ] iPad (768px width)
- [ ] Desktop 1440px
- [ ] Desktop 1920px

#### Performance Testing
- [ ] Lighthouse score > 90 (Performance, Accessibility, Best Practices)
- [ ] No memory leaks during extended use
- [ ] Filter interactions complete in < 300ms
- [ ] Graph updates smoothly without jank

#### Accessibility Testing
- [ ] Keyboard navigation works throughout
- [ ] Screen reader announces key information
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators visible
- [ ] Form labels properly associated
- [ ] ARIA attributes used correctly

### 6.2 Edge Cases

- Very long flight durations (15+ hours)
- No flights available for search criteria
- Single flight result
- 100+ flight results
- Slow network connections
- API rate limiting
- Invalid API credentials
- Extremely low or high price outliers
- Midnight departure/arrival times
- Multi-leg flights with complex routing

---

## 7. Deployment & Documentation

### 7.1 GitHub Repository Structure

```
flight-search-engine/
├── README.md                 # Setup, features, tech stack
├── .env.example              # Environment variables template
├── package.json
├── public/
│   └── assets/              # Images, logos
├── src/
│   ├── components/
│   ├── services/            # API integration
│   ├── utils/               # Helper functions
│   ├── hooks/               # Custom React hooks
│   ├── constants/           # Config, enums
│   └── App.jsx
└── docs/
    └── DECISIONS.md         # Architecture decisions log
```

### 7.2 README Requirements

Include in repository README:
- Project description and features
- Tech stack with versions
- Setup instructions (clone, install, env vars)
- Amadeus API setup guide
- Development commands
- Deployment instructions
- Known limitations or future enhancements
- Link to live demo
- Link to Loom walkthrough

### 7.3 Loom Demo Script (3-4 minutes)

**Structure**:
1. **Introduction** (30s): Name, project overview, tech stack
2. **Core Functionality** (90s): 
   - Demonstrate complete search flow
   - Show filter interactions updating graph and results
   - Highlight responsive design (resize window)
3. **Technical Implementation** (60s):
   - Brief code walkthrough of key components
   - Explain API integration approach
   - Discuss one interesting technical challenge and solution
4. **Design Decisions** (30s):
   - UX improvements over traditional flight search
   - Why certain libraries or patterns were chosen
5. **Closing** (10s): Summary and thank you

---

## 8. Stretch Goals & Enhancements

### Priority 1 (If time permits)
- Multi-city search support
- Flexible date search (±3 days grid view)
- Price alert suggestions
- Flight comparison (side-by-side)

### Priority 2 (Nice to have)
- Dark mode toggle
- Save favorite searches
- Export results to PDF/email
- Accessibility shortcuts panel
- Advanced filters (aircraft type, alliance)

### Priority 3 (Future iterations)
- User accounts and saved searches
- Price tracking and notifications
- Integration with booking platforms
- Social sharing of flight deals
- Alternative airport suggestions

---

## 9. Constraints & Assumptions

### Constraints
- Must use Amadeus API (test environment)
- Must complete in 16 work hours over 4 days
- Must use Recharts or D3 for graphing
- Must be fully responsive
- Must include live hosted version

### Assumptions
- Users have modern browsers (last 2 versions)
- Test API has sufficient rate limits for development
- Amadeus test data is representative
- Users have JavaScript enabled
- Basic internet connectivity available

---

## 10. Success Criteria

### Minimum Viable Product (Must Have)
✅ Functional search with origin, destination, dates  
✅ Display list of flight results  
✅ Price range, stops, and airline filters working  
✅ Live updating price graph  
✅ Filters affect both results and graph  
✅ Responsive mobile and desktop layouts  
✅ Deployed and accessible online  
✅ Clean GitHub repository  
✅ Loom demo video  

### Polished Product (Should Have)
- Fast filter interactions (< 300ms)
- Smooth animations and transitions
- Thoughtful empty and error states
- Clear visual hierarchy
- Accessible to keyboard users
- Well-documented code
- Professional visual design

### Exceptional Product (Could Have)
- Innovative UX improvements
- Delightful micro-interactions
- Advanced filtering options
- Performance optimizations
- Comprehensive error handling
- Additional value-add features
- Production-ready code quality

---

## Appendix

### A. Amadeus API Resources
- Documentation: https://developers.amadeus.com/
- Test credentials: Sign up at developer portal
- Rate limits: Check current tier limits
- Sample requests: Included in API docs

### B. Design Resources
- Airline logos: OpenFlights or similar
- Airport codes: IATA/ICAO databases
- Icons: Lucide React (included in Claude artifacts)

### C. Helpful Libraries (Already Available)
- Recharts: Visualization
- Lodash: Data manipulation
- date-fns or similar: Date utilities (if needed beyond native)

---

**Document Version**: 1.0  
**Last Updated**: January 19, 2026  
**Author**: Product Requirements for Flight Search Engine Take-Home Assignment