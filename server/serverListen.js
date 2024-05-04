const express= require('express');
const app=express();

const startServer = (port) => {
 const server= app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  return server;
};

module.exports = startServer;
