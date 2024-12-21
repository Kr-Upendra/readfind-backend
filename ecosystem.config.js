module.exports = {
  apps: [
    {
      name: "readfind-dev",
      script: "nodemon",
      args: "./src/server.ts",
      watch: ["./src"],
      ext: "ts,js",
      ignore_watch: ["node_modules", "dist"],
      env: {
        NODE_ENV: "development",
      },
    },
    {
      name: "readfind-prod",
      script: "node",
      args: "./dist/server.js",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
