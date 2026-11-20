"""Refresh the installed skill from the master SKILL.md, and install the agents. Run after EVERY change to SKILL.md or agents/:
    python tools/refresh_installed_skill.py
Master = this folder. It regenerates the rule slices (rules/dept/), then writes the installed copy of SKILL.md and of every
agents/*.md: on a PC into ~/.claude/ with absolute paths, in a cloud session into the repo's own .claude/ with repo-relative
paths (commit them). One code path with tools/install.py, so the two can never drift apart."""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import install
install.install()
print("refreshed")
