# Tools, guards and advisories

Tools are the runtime's contract with the model: what it can do, what that costs, and
what it cannot do even when asked nicely.

## Catalogue

| Family | Tools |
| --- | --- |
| Workspace | read, write, edit (compare-and-swap), list, glob, search text, stat, diff review |
| Command | `run_command`, bounded command sessions |
| Project | `detect_project`, `validate_project` |
| Memory | `memory_search`, `memory_remember` |
| Task | checkpoint updates, acceptance criteria, waivers |
| Skills | `skill_list`, `skill_load` |
| Discovery | `search_tools` (activates specialised tools on demand) |
| Research | provider web search/fetch (enabled with `--research`) |
| MCP | Framework tools, namespaced per server (`mcp_orbit_…`, `mcp_nebula_…`) |

## Effect profiles

Each tool declares its effects, and the runtime trusts the declaration:

| Tool | Effects |
| --- | --- |
| `project.validate` | `approval`, `state_version`, `validate`, `write` (build output counts as derived) |
| `workspace.write`, `workspace.edit` | `approval`, `state_version`, `write` |
| git diff / `review_changes` | `approval`, `diff_review`, `inspect` |
| `command.run` | `approval`, `state_version`, `write` — never `validate` |

That last line is the whole point: a command can change the workspace, but it cannot
*make* validation evidence. If you imitate a specialised tool with a shell command, the
gate sees exactly what happened.

## Guards

| Guard | Behaviour |
| --- | --- |
| **Dependency paths** | File tools refuse library source inside `node_modules`; a specific `package.json`, `README.md` or `*.d.ts` is readable, and a shell reader pointed at a dependency tree answers with the same advice |
| **No-progress policy** | The same call with the same arguments repeats twice → blocked; workspace content cycling back to an earlier hash → recorded; a second episode pauses the run and asks for direction |
| **Argument clamping** | A numeric argument above the schema maximum is clamped to the cap and the adjustment is reported in the tool result instead of failing the call |
| **Mutation preconditions** | Writes and edits carry a precondition (create-if-absent, or match-sha256); edits require `oldText` to match exactly once |
| **Output bounding** | Large outputs are truncated tail-first and spilled to an artifact file, so a runaway `cat` cannot consume the context |

## Advisories

The runtime answers specific mistakes with a note in the tool result rather than a
refusal, because a refusal costs a round and teaches nothing:

| Situation | Advisory says |
| --- | --- |
| A whole-project check run through the shell | Which `validate_project` call to make instead, with the path and check inferred from the command |
| A long-running server or watcher | Servers are not evidence; use the bounded session capability if a task truly needs one |
| A package-manager scaffold verb | `bun create vite` scaffolds a project; it is not a Vite server |
| A shell reader pointed into `node_modules` | Read a declaration or manifest instead, or use framework MCP knowledge |
| An argument above a host cap | The value used, and why |

## Designing a tool for this runtime

1. **Declare effects honestly.** If it cannot be trusted as evidence, do not claim
   `validate` or `diff_review`.
2. **Prefer preconditions over hope.** Compare-and-swap beats "I read it a moment ago".
3. **Bound the output.** A tool that can return a megabyte will, eventually.
4. **Answer mistakes with advice.** A model that knows the right call next time is worth
   more than a model that was simply stopped.
