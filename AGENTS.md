
# FarmGrid Project Instructions

## Project Overview
FarmGrid is a web application that coordinates agricultural resource sharing between farmers and equipment owners.

The application has three roles:
1. Farmer
2. Resource Owner
3. Administrator

## Technology Stack
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- Lucide React
- Recharts

## Architecture Rules
- Use reusable React components.
- Keep pages, components, types, utilities and services separate.
- Use TypeScript interfaces for important data structures.
- Keep business logic separate from UI components.
- Use React Router for navigation.
- Use local demo data initially.
- Do not connect to a backend yet.
- Do not create unnecessary duplicate components.
- Do not put the entire application in one file.

## Design Rules
- Build a professional, modern agricultural technology dashboard.
- Use a consistent green, white and neutral colour palette.
- Use clean typography and readable layouts.
- Make the application responsive for desktop, tablet and mobile.
- Use consistent spacing, buttons, cards, tables and forms.
- Use Lucide icons.
- Avoid excessive gradients and decorative animations.
- Make the application look like a real software product, not a generic AI-generated template.

## Functional Rules
- All navigation links must work.
- Forms must validate required fields.
- Buttons must perform meaningful actions.
- Use realistic demo data.
- Store frontend demo changes in localStorage where appropriate.
- Add clear success, error and empty-state messages.
- Do not display fake live weather, maps, SMS or external API results.
- Label simulated data clearly.

## FarmGrid Business Rules
- Farmers submit requests for agricultural resources.
- Owners register and manage resources.
- Admins review requests and allocations.
- One resource cannot have overlapping confirmed bookings.
- Priority scores must be explainable.
- Do not claim that a machine-learning model is being used.
- The allocation score will use transparent deterministic rules.

## Development Rules
- Before implementing a major module, explain the plan.
- Make changes in small stages.
- Run the application after each major stage.
- Fix TypeScript errors and build errors before proceeding.
- Do not delete working functionality without asking.
- Explain important files and changes in simple English.
