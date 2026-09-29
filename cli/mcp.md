# MCP servers

Model Context Protocol servers give the agent specialised tools — a framework's
knowledge base, a component catalogue, a security review — under the same evidence rules
as the built-in tools.

## Bundled servers

Two first-party servers are configured by default:

| Name | Command | What it provides |
| --- | --- | --- |
| `orbit` | `npx -y @galaxy-stack/orbit-mcp` | Orbit knowledge topics, module scaffolding content, security review |
| `nebula` | `npx -y @galaxy-stack/nebula-mcp` | Galaxy UI component catalogue, component sources, search |

Skip them with `--no-galaxy-mcp` (useful for a fully offline run or a workspace that
does not use those frameworks).

## Configuring your own

Servers are declared in the agent config (`~/.galaxy/agent.json`, or `--agent-config`):

```json
{
  "mcpServers": [
    {
      "name": "linear",
      "transport": "stdio",
      "command": "npx",
      "args": ["-y", "mcp-linear"],
      "timeoutMs": 60000
    },
    {
      "name": "remote",
      "transport": "http",
      "url": "https://mcp.example.com",
      "auth": "oauth"
    }
  ]
}
```

Up to 16 servers are accepted. A server that fails to connect is logged as
`mcp_connect_failed` and does not stop the run; its tools simply do not appear.

## Listing and diagnosing

```sh
blackhole mcp                 # connect configured servers and list their tools
blackhole logs 20 | grep mcp  # connect errors and OAuth events
```

Tools from a server arrive namespaced (`mcp_orbit_orbit_knowledge_read`), and the
model can discover more with `search_tools` instead of guessing names — the CLI keeps
the tool surface small on purpose so the model is not buried in schemas.

## OAuth for HTTP servers

```sh
blackhole mcp login remote    # opens the browser, captures the localhost callback
blackhole mcp logout remote   # forgets the stored tokens
```

Tokens are stored in `<state-dir>/mcp-auth.json` with mode 0600 and refreshed
automatically. The flow never sees them.

## Working with MCP documentation

Two rules that keep framework work honest — both learned the hard way:

1. **Read before you write.** The component catalogue and knowledge topics are the
   authoritative API reference; the bundled skills say so, and the model is expected to
   consult them before writing framework code.
2. **Declarations are readable, source is not.** `read_file` on a specific
   `package.json`, `README.md` or `*.d.ts` inside `node_modules` is allowed and
   encouraged when you need the installed API. Grepping the whole dependency tree —
   through file tools *or* a shell reader — is refused and now answered with an
   advisory that says which read is allowed.
