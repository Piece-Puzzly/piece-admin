module.exports = {
  apps: [
    {
      name: "next-app",
      script: "npm",
      args: "start",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
