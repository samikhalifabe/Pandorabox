# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pandorabox is a sophisticated WhatsApp automation platform for automotive sales and communication management. It's a full-stack monorepo with a Next.js frontend and Express.js backend that helps car dealers manage customer conversations, vehicle listings, and sales processes through WhatsApp integration with AI-powered responses.

## Architecture

### Monorepo Structure
- **Frontend**: Next.js 15.2.4 with App Router (`/frontend`) - Port 3000
- **Backend**: Express.js 5.1.0 server (`/backend`) - Port 3001
- **Workspaces**: Root package.json manages both frontend and backend

### Key Technologies
- **Frontend**: Next.js, React 18, TypeScript, Tailwind CSS, Shadcn/ui, Socket.IO Client
- **Backend**: Express.js, WhatsApp Web.js, Puppeteer, Socket.IO, Supabase
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **AI Integration**: OpenAI and Grok APIs for intelligent responses
- **Communication**: WhatsApp Web automation via Puppeteer

## Development Commands

### Root Level (use these for development)
```bash
npm run dev                  # Start both frontend and backend concurrently
npm run build               # Build both applications
npm start                   # Start both in production
npm run install:all         # Install all dependencies
```

### Frontend Specific (`/frontend`)
```bash
npm run dev                 # Next.js development server
npm run build              # Build Next.js app
npm start                  # Production Next.js server  
npm run lint               # ESLint checking
```

### Backend Specific (`/backend`)
```bash
npm run dev                # Development with hot reload (ts-node-dev)
npm start                  # Production server
npm run build              # Backend build
```

### Docker
```bash
docker-compose up          # Start containerized application
```

## Database Schema

Core tables in Supabase:
- **vehicles**: Vehicle listings (brand, model, price, phone, etc.)
- **conversations**: WhatsApp conversation management
- **messages**: Individual message storage and history
- **contact_records**: Customer interaction tracking
- **contact_history**: Detailed interaction logs
- **ai_config**: AI response configuration
- **message_templates**: Reusable message templates

## Key Components & Architecture Patterns

### Backend Architecture
- **MVC Pattern**: Models (`/models`), Controllers (`/controllers`), Routes (`/routes`)
- **Services Layer**: Business logic in `/services` (WhatsApp, AI, database)
- **Message Handler**: Core WhatsApp message processing (`/handlers/messageHandler.js`)
- **Real-time Communication**: Socket.IO for live updates
- **Error Handling**: Centralized error handling middleware

### Frontend Architecture
- **App Router**: Next.js 15 file-based routing in `/app`
- **Component Organization**: Feature-based components in `/components`
- **Custom Hooks**: State management in `/hooks`
- **Type Safety**: Comprehensive TypeScript types in `/types`
- **Real-time State**: Socket.IO client integration for live data

### WhatsApp Integration
- **Browser Automation**: Puppeteer with headless Chrome
- **Session Management**: Persistent WhatsApp Web sessions
- **QR Authentication**: QR code flow for WhatsApp Web login
- **Message Processing**: Real-time message handling and storage
- **Anti-spam Features**: Rate limiting and message variations

## Important Development Patterns

### Phone Number Handling
- Always use utilities from `backend/utils/phoneNumber.js` for normalization
- Phone numbers are the primary key for linking conversations to vehicles

### Message Deduplication
- System prevents duplicate messages via SQL constraints
- Check `prevent_duplicate_messages.sql` for implementation

### AI Response System
- Configuration stored in database (`ai_config` table)
- Uses both OpenAI and Grok APIs with fallback logic
- Context-aware responses for automotive sales scenarios

### Error Handling
- Use custom logger from `backend/utils/logger.js`
- Comprehensive error middleware in `backend/middleware/errorHandler.js`
- Frontend error boundaries for React components

### Environment Configuration
- Backend requires: `SUPABASE_URL`, `SUPABASE_KEY`, `GROK_API_KEY`, `OPENAI_API_KEY`
- Frontend requires: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Testing & Debugging

### Available Test Files
- `test_*.js` files in backend for various components
- Use `/logs` page in frontend for real-time debugging
- VS Code debug configurations available

### Common Development Tasks
- **WhatsApp Connection**: Check status via `/api/whatsapp/status`
- **Message Sending**: Use `/api/whatsapp/send` endpoint
- **Database Operations**: All Supabase operations go through service layer
- **Real-time Updates**: Socket.IO events for live data synchronization

## Security Considerations

- **Row Level Security**: Enabled on all Supabase tables
- **API Authentication**: Supabase Auth integration
- **Sensitive Data**: Never commit API keys or credentials
- **Docker Security**: Non-root user in containers

## Multi-platform Support

- **Windows & macOS**: Cross-platform Puppeteer configuration
- **Chrome Detection**: Automatic Chrome binary detection
- **User Data Directory**: Configurable Chrome user data paths

## Performance Notes

- **Message Processing**: Efficient batching and deduplication
- **Database Queries**: Optimized Supabase operations with proper indexing
- **Real-time Updates**: Socket.IO rooms for targeted updates
- **Memory Management**: Proper cleanup of WhatsApp sessions and browser instances