# Token Security Notes

- Never paste `GITHUB_TOKEN` in code, commit messages, or chat.
- Store tokens only in local `.env.local` and Vercel Environment Variables.
- Keep `.env.local` untracked by git.
- If a token is exposed, revoke it immediately and create a new one.
