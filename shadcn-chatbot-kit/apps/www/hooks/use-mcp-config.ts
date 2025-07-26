"use client"

import { useCallback, useEffect, useState } from 'react'
import { MCPToolConfig, MCPToolCredentials } from '@/lib/mcp/types'
import { mcpProviders } from '@/lib/mcp/config'

const MCP_CONFIG_KEY = 'mcp-tools-config'
const MCP_CREDENTIALS_KEY = 'mcp-tools-credentials'

export function useMCPConfig() {
  const [enabledTools, setEnabledTools] = useState<Record<string, boolean>>({})
  const [credentials, setCredentials] = useState<MCPToolCredentials[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load configuration from localStorage
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(MCP_CONFIG_KEY)
      const savedCredentials = localStorage.getItem(MCP_CREDENTIALS_KEY)

      if (savedConfig) {
        setEnabledTools(JSON.parse(savedConfig))
      }

      if (savedCredentials) {
        setCredentials(JSON.parse(savedCredentials))
      }
    } catch (error) {
      console.error('Failed to load MCP configuration:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save configuration to localStorage
  const saveConfig = useCallback((newEnabledTools: Record<string, boolean>) => {
    try {
      localStorage.setItem(MCP_CONFIG_KEY, JSON.stringify(newEnabledTools))
      setEnabledTools(newEnabledTools)
    } catch (error) {
      console.error('Failed to save MCP configuration:', error)
    }
  }, [])

  // Toggle tool enabled state
  const toggleTool = useCallback((toolId: string) => {
    const newEnabledTools = {
      ...enabledTools,
      [toolId]: !enabledTools[toolId],
    }
    saveConfig(newEnabledTools)
  }, [enabledTools, saveConfig])

  // Save credentials for a tool
  const saveToolCredentials = useCallback((toolId: string, toolCredentials: Record<string, string>) => {
    try {
      const newCredentials = credentials.filter(c => c.toolId !== toolId)
      newCredentials.push({ toolId, credentials: toolCredentials })

      localStorage.setItem(MCP_CREDENTIALS_KEY, JSON.stringify(newCredentials))
      setCredentials(newCredentials)
    } catch (error) {
      console.error('Failed to save tool credentials:', error)
    }
  }, [credentials])

  // Get credentials for a tool
  const getToolCredentials = useCallback((toolId: string) => {
    const toolCreds = credentials.find(c => c.toolId === toolId)
    return toolCreds?.credentials || {}
  }, [credentials])

  // Clear all credentials
  const clearAllCredentials = useCallback(() => {
    try {
      localStorage.removeItem(MCP_CREDENTIALS_KEY)
      setCredentials([])
    } catch (error) {
      console.error('Failed to clear credentials:', error)
    }
  }, [])

  // Get all enabled tools with their configurations
  const getEnabledTools = useCallback(() => {
    const allTools: MCPToolConfig[] = []

    mcpProviders.forEach(provider => {
      provider.tools.forEach(tool => {
        if (enabledTools[tool.id]) {
          allTools.push({ ...tool, enabled: true })
        }
      })
    })

    return allTools
  }, [enabledTools])

  return {
    enabledTools,
    credentials,
    isLoading,
    toggleTool,
    saveToolCredentials,
    getToolCredentials,
    clearAllCredentials,
    getEnabledTools,
    providers: mcpProviders,
  }
}
