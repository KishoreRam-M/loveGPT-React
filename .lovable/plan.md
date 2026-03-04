

## LoveGPT Tamil ❤️ — Full Build Plan

### Design System
- **Dark romantic theme**: Deep purple (`#1a0a2e`) to dark rose gradients
- **Accent colors**: Rose pink (`#e91e63`), soft red, deep purple
- **Glassmorphism cards**: Semi-transparent backgrounds with backdrop blur and subtle borders
- **Glowing buttons**: Box-shadow glow on hover using rose/purple tones

### Components to Create

1. **Hero Section** — Full-viewport dark gradient with CSS-animated floating hearts (absolute positioned, keyframe animations for drift/fade), title "LoveGPT Tamil ❤️", subtitle text, and two CTA buttons that smooth-scroll to the input and guide sections

2. **Story Input Section** — Glassmorphism card with:
   - Password input for Gemini API Key
   - Textarea for love story with placeholder text
   - "Generate Love Plan" button with loading spinner
   - Validation: toast error if story is empty
   - Disabled state during API call

3. **Example Love Story** — Animated fade-in card showing the Arjun & Meera sample story with romantic styling

4. **User Guide Section** — 7 numbered steps displayed as icon cards explaining how to get a Gemini API key, with staggered fade-in animations on scroll (using Intersection Observer)

5. **Result Section** — Conditionally shown after API response with:
   - Typing animation effect revealing the love plan text
   - Glowing border container
   - "Copy Result" button (clipboard API) and "Generate Again" button

6. **Footer** — Creator credits for Kishore Ram M with GitHub and LinkedIn icon links

### API Integration
- Service module using `fetch` to POST to `http://127.0.0.1:8000/api/generate_love_plan`
- Request body: `{ story: string }`
- Loading state management, error handling with toast notifications

### Animations (CSS/Tailwind keyframes)
- Floating hearts: Multiple heart emojis with randomized float-up animations
- Fade-in-up for cards on scroll
- Button glow pulse on hover
- Typing cursor effect for result text reveal

### Page Structure
- Single-page `Index.tsx` composing all section components
- Smooth scroll navigation between sections

