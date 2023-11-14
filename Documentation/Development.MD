# Development Documentation

## Prerequisites

- ### Install Git

  - Go to <https://git-scm.com/book/en/v2/Getting-Started-Installing-Git> to find Git, follow the instructions to install it for your enviroment.

- ### Install Node.js

  - Go to https://nodejs.org/en/ and install the recommended version of Node.js

- ### Install PostgreSQL Version 16

  - Go to https://www.postgresql.org/download/ and install version 16 of PostgreSQL for your environment.

- ### Get the App!

  - Using your preferred terminal interface, navigate to your desired install location and run the command **git clone https://github.com/tsnicholas/PersonaliziedLearningPlanWebApp.git**

## Setup

- ### Setting up the database

  - Create a database using the psql shell
  - Use \i path-to/database/learningPlanDB.pgsql to set up the database on your local device.
  
  - run command npm install in the project folder

- ### Setting up the Node.js Node Package Manager

  - All steps will be completed using the terminal interface of your choice.
  - Navigate to the root directory of the project and run the **npm install** command.
  - Navigate to the client folder of the project and run the **npm install** command.
  - Navigate to the server folder of the project and run the **npm install** command.

## Tests

- ### How to Run Tests

  - navigate to the server directory in the project using your preferred terminal and type the command **npm run test**

- ### What to Expect from tests

  - Tests should always result in success, if they are not successful something has gone wrong with the code.

## Running the App

- ### How to Run the App

  - CD one command shell to server and another one to client
  - Make sure to write your own .env file inside the parser folder with your login information for the sql database
  - Run command "npm install" on both shells to install the necessary dependencies on each
  - run command "npm run dev" to open the server
  - run command "npm run start" to open the react app
