### Development Documentation

## Frontend and Backend

- # Install Prerequisites for Webapp

  - node.js and npm
    - <https://nodejs.org/en/download>

- # Clone Repository

  - run command git clone <https://github.com/tsnicholas/PersonaliziedLearningPlanWebApp.git>
  - run command npm install in the project folder

## Database

- # Install Prerequisites for Database

  - PostreSQL version 16
    - <https://www.postgresql.org/download/>

- # Setting up Database

  - Open the psql shell with your username and password and create a database
  - Use \i path-to/database/learningPlanDB.pgsql to set up the database on your local device.

## Starting the App

    - Open two command shells and cd one to the server folder and one to the client folder.
    - On each, make sure to run npm install to add all the dependencies that's needed for running the app
    - On the server shell, use command "npm run dev" to start up the server.
    - On the client shell, use command "npm run start" to start up the react app.
    - If the react app doesn't automatically open on your browser, open the link provided in the shell.
