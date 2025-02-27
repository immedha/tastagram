# Tastagram
Tastagram is a social media app for food. It is meant to help people find restaurants they want to eat at by scrolling through photos of different dishes offered by restaurants. A user can swipe right or left based on whether they would want to eat that dish or finding appetizing. Each user has a feed, and I used an algorithm to optimize the user's feed based on what they swiped right or left on. 
Viewing the website: https://tastagram-30c8c.web.app/.


Running it locally:
1. Clone it with `git clone <url>`
1. do `cd <repo_name>`
1. run `npm install`
1. Create a `.env` in the root directory and fill it with the firebase environment variables:
`VITE_API_KEY`, `VITE_AUTH_DOMAIN`, `VITE_PROJECT_ID`, `VITE_STORAGE_BUCKET`, `VITE_MESSAGING_SENDER_ID`, `VITE_APP_ID`.
1. do `npm run dev` to run this locally.

To build/deploy, do `npm run build` and `firebase deploy` from the root directory.