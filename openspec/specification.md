# Random Destination Wheel Specification v2.5.0

## 1. Overview
A web application built with Next.js that allows users to spin a wheel to select a random travel destination. It integrates Gemini AI to provide insights about the selected location.

## 2. Core Features
- **Wheel Component**: SVG-based spinning wheel with customizable segments.
- **Destination Management**: Support for preset lists and user-created custom lists.
- **AI Integration**: Uses Gemini 3 Flash to generate destination intros and image keywords.
- **Budgeting**: Calculates estimated travel costs based on a predefined dataset and user-input duration.
- **Persistence**: Uses LocalStorage to save user lists, history, and favorites.
- **i18n**: Multi-language support (English and Chinese) with dynamic switching.
- **Robustness**: AI request timeout handling, error boundaries, and network failure recovery.

## 3. Technical Stack
- **Frontend**: Next.js 15, React 19, Tailwind CSS 4.
- **Animations**: Motion (framer-motion).
- **Icons**: Lucide React.
- **AI SDK**: @google/genai.

## 4. UI/UX
- Responsive design for mobile, tablet, and desktop.
- Semantic IDs for debugging and testing.
- Dark/Light mode support.
