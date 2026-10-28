---
title: XFN adds meaning to links.
description: Simple relationship labels make connections between personal websites easier to understand.
---
## The relationships behind the links

XFN stands for XHTML Friends Network. It uses a few words in an ordinary link’s `rel` attribute to describe personal relationships: friends, people you have met, and colleagues. The link still works as usual, with extra meaning that software can read. See the [official XFN introduction](https://gmpg.org/xfn/intro).

## A few common labels

- `friend`: a friend you know.
- `met`: someone you have met in person.
- `colleague`: someone in the same field of work or activity.
- `me`: another URL belonging to you. It cannot be combined with other XFN values.

These meanings come from the [XFN 1.1 profile](https://gmpg.org/xfn/11). You can ask your agent to add appropriate labels to your own links page, based on real relationships.

This example describes a friend you have met. The name and address are placeholders.

<pre><code>&lt;a href="https://friend.example" rel="friend met"&gt;
  A friend
&lt;/a&gt;</code></pre>

## Let real relationships guide the labels

An ordinary link is enough to share a website you appreciate. Use XFN only when the relationship applies. Being listed in the same directory does not make two people friends. XFN records the publisher’s claim; it is not identity verification or a certification of trust.

Web 2.0 Next does not assign friendships to website owners or require XFN. We introduce it so people can describe their connections more clearly on their own websites. Agents that read these labels can use them to understand what a link means.
