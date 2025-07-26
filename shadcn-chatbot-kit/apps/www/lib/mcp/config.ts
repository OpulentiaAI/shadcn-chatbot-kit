import { MCPToolProvider } from './types'

export const appleMCPProvider: MCPToolProvider = {
  id: 'apple-mcp',
  name: 'Apple MCP Tools',
  description: 'Collection of Apple-native tools for messaging, notes, calendar, and more',
  icon: '🍎',
  tools: [
    {
      id: 'apple-messages',
      name: 'Messages',
      description: 'Send and read messages using Apple Messages app',
      enabled: false,
      requiresAuth: false,
    },
    {
      id: 'apple-notes',
      name: 'Notes',
      description: 'List, search, read, and create notes in Apple Notes app',
      enabled: false,
      requiresAuth: false,
    },
    {
      id: 'apple-contacts',
      name: 'Contacts',
      description: 'Search contacts for sending messages',
      enabled: false,
      requiresAuth: false,
    },
    {
      id: 'apple-emails',
      name: 'Emails',
      description: 'Send, search, and schedule emails with attachments',
      enabled: false,
      requiresAuth: false,
    },
    {
      id: 'apple-reminders',
      name: 'Reminders',
      description: 'List, search, and create reminders with due dates',
      enabled: false,
      requiresAuth: false,
    },
    {
      id: 'apple-calendar',
      name: 'Calendar',
      description: 'Search, list, and create calendar events',
      enabled: false,
      requiresAuth: false,
    },
    {
      id: 'apple-web-search',
      name: 'Web Search',
      description: 'Search the web using DuckDuckGo',
      enabled: false,
      requiresAuth: false,
    },
    {
      id: 'apple-maps',
      name: 'Maps',
      description: 'Search locations, get directions, and manage guides',
      enabled: false,
      requiresAuth: false,
    },
  ],
}

export const mcpProviders: MCPToolProvider[] = [
  appleMCPProvider,
]
