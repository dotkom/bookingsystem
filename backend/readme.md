# what is this

I have made a backend with node, typescript and express, atm there are only two endpoints.
To extend the functionality you need to add new functions to the database in the databasefunctions file, and/or make new endpoints in the server.ts file.

This backend runs with nodemon, so it refreshes when you save files. I have also added eslint-typescript with prettier. As long as you have Prettier and Eslint in your VScode you should be.

My settings for VScode is as follows

```json
{
  "typescript.updateImportsOnFileMove.enabled": "always",
  "window.zoomLevel": 2,
  "eslint.autoFixOnSave": true,
  "editor.formatOnSave": true,
  "eslint.validate": [
    "javascript",
    {
      "language": "typescript",
      "autoFix": true
    }
  ]
}
```

# how to setup

```js
npm install
```

# How to run

```js
npm run start:dev
```
