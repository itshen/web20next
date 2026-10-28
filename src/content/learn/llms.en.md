---
title: "llms.txt: a starting point for agents."
description: Help agents discover your website, understand its content, and find the next step.
---
## A short guide to your website

`llms.txt` is a proposal for a Markdown file that gives agents a concise introduction to a website and links to useful resources. People can read it too. See the [llms.txt proposal](https://llmstxt.org).

## How Web 2.0 Next uses it

Our [llms.txt — For agents](https://web20next.com/llms.txt) introduces the project and links to the manifesto, directory, contribution guide, entry format, and PR template. It is maintained in English and shared across all interface languages.

When you ask your agent to share your website here, this file points it to the submission instructions. The agent prepares the information you approve and opens a GitHub PR. Your entry appears in the directory after maintainer review, merge, and a successful deployment. Reading the file does not submit anything automatically.

## How agents find it

We publish the file at `/llms.txt` and link to it from each page’s HTML head using `rel="describedby"`. Whether an agent checks it depends on the agent and its tools. Publishing the file does not guarantee discovery, recommendations, or traffic.

## Give your own website an introduction

Ask your agent to prepare an `llms.txt` file using information you want to share publicly: who you are, what you make, and where to find your work. Keep it concise and update it when your website changes. It provides guidance; it does not grant permission to act on your behalf or replace access controls.
