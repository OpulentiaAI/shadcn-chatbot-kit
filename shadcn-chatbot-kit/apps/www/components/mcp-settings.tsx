"use client"

import { useState } from "react"
import { Button } from "@/registry/new-york/ui/button"
import { Label } from "@/registry/new-york/ui/label"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Settings2, Shield, Eye, EyeOff } from "lucide-react"
import { useMCPConfig } from "@/hooks/use-mcp-config"
import { MCPToolConfig } from "@/lib/mcp/types"

export function MCPSettings() {
  const { providers, enabledTools, toggleTool, saveToolCredentials, getToolCredentials } = useMCPConfig()
  const [selectedTool, setSelectedTool] = useState<MCPToolConfig | null>(null)
  const [showCredentials, setShowCredentials] = useState<Record<string, boolean>>({})

  const handleCredentialsSave = (toolId: string, formData: FormData) => {
    const credentials: Record<string, string> = {}

    formData.forEach((value, key) => {
      if (key !== 'toolId') {
        credentials[key] = value.toString()
      }
    })

    saveToolCredentials(toolId, credentials)
    setSelectedTool(null)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="mr-2 h-4 w-4" />
          MCP Tools
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Model Context Protocol Tools</DialogTitle>
          <DialogDescription>
            Configure external tools and services that the AI can use to help you.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {providers.map((provider) => (
            <Card key={provider.id} className="p-4">
              <div className="mb-4 flex items-start space-x-3">
                <span className="text-2xl">{provider.icon}</span>
                <div className="flex-1">
                  <h3 className="font-semibold">{provider.name}</h3>
                  <p className="text-sm text-muted-foreground">{provider.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                {provider.tools.map((tool) => (
                  <div key={tool.id} className="flex items-center justify-between py-2">
                    <div className="flex-1">
                      <Label htmlFor={tool.id} className="cursor-pointer font-normal">
                        {tool.name}
                        <span className="block text-sm text-muted-foreground">
                          {tool.description}
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      {tool.requiresAuth && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedTool(tool)}
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                      )}
                      <Switch
                        id={tool.id}
                        checked={enabledTools[tool.id] || false}
                        onCheckedChange={() => toggleTool(tool.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Credentials Dialog */}
        {selectedTool && selectedTool.requiresAuth && selectedTool.authConfig && (
          <Dialog open={!!selectedTool} onOpenChange={() => setSelectedTool(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configure {selectedTool.name}</DialogTitle>
                <DialogDescription>
                  Enter your credentials for {selectedTool.name}. These are stored locally in your browser.
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleCredentialsSave(selectedTool.id, new FormData(e.currentTarget))
                }}
                className="space-y-4"
              >
                {selectedTool.authConfig.fields.map((field) => {
                  const existingValue = getToolCredentials(selectedTool.id)[field.key] || ''
                  const showField = showCredentials[field.key] || false

                  return (
                    <div key={field.key} className="space-y-2">
                      <Label htmlFor={field.key}>
                        {field.label}
                        {field.required && <span className="ml-1 text-red-500">*</span>}
                      </Label>
                      <div className="relative">
                        <Input
                          id={field.key}
                          name={field.key}
                          type={field.type === 'secret' && !showField ? 'password' : 'text'}
                          placeholder={field.placeholder}
                          defaultValue={existingValue}
                          required={field.required}
                        />
                        {field.type === 'secret' && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2"
                            onClick={() => setShowCredentials({
                              ...showCredentials,
                              [field.key]: !showField
                            })}
                          >
                            {showField ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        )}
                      </div>
                      {field.description && (
                        <p className="text-sm text-muted-foreground">{field.description}</p>
                      )}
                    </div>
                  )
                })}

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setSelectedTool(null)}>
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  )
}
