# Claude Code Statusline: Everything I Need on One Line

When working with Claude Code, I often opened `/usage` to check how much of my allowance I had used and when my limits would reset.

Over time, I had Claude add a few details directly to my status line. It was better, but something was still missing.

Then I came across a post by David Grudl showing his setup. It inspired me to adjust my own status line and create a skill to make it easy to install and customize.

Since then, I hardly ever use `/usage`.

## What it shows

![Claude Code status line demo](https://raw.githubusercontent.com/FilipMessa/claude-code-statusline/main/demo/demo.gif)

One line shows the information I care about while I work:

- **Model and context window** – the current model and context usage.
- **Prompt cache** – time remaining until the cache expires.
- **Subscription usage** – limit usage and time until it resets. An arrow appears when I'm using the allowance faster than time is passing.
- **Project and Git worktree** – the project and worktree I'm working in.
- **Scratchpad** – access to files Claude created during the session.

## Installation

I published the status line on GitHub together with a Claude Code skill.

The skill handles installation and lets you customize it further. For example, you can change the width of the context indicator, remove information you don't need, or add the Git branch.

You'll find installation instructions, examples, and the source code in the repository:

**[FilipMessa/claude-code-statusline](https://github.com/FilipMessa/claude-code-statusline)**

I wish I had a similar setup in Codex. I hope it's only a matter of time.
