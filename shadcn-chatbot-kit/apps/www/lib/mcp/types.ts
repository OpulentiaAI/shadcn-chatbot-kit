export interface MCPToolConfig {
  id: string
  name: string
  description: string
  enabled: boolean
  requiresAuth?: boolean
  authConfig?: MCPAuthConfig
}

export interface MCPAuthConfig {
  type: 'api_key' | 'oauth' | 'custom'
  fields: AuthField[]
}

export interface AuthField {
  key: string
  label: string
  type: 'text' | 'password' | 'secret'
  placeholder?: string
  required?: boolean
  description?: string
}

export interface MCPToolCredentials {
  toolId: string
  credentials: Record<string, string>
}

export interface MCPToolProvider {
  id: string
  name: string
  description: string
  icon?: string
  tools: MCPToolConfig[]
}

// Apple MCP specific types
export interface AppleMCPConfig {
  enabled: boolean
  tools: {
    messages: boolean
    notes: boolean
    contacts: boolean
    emails: boolean
    reminders: boolean
    calendar: boolean
    webSearch: boolean
    maps: boolean
  }
}
