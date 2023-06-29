# Unit 2 Project: Library API

## Technologies Used
 - Javascript, Node.js

## Dependencies
- express: 
- mongoose: 
- morgan: 
- bcrypt: 
- dotenv: 
- jsonwebtoken: 

## Pseudocode
### Models
- This API features three mongoose schemas as the models for database entries: users, books, and checkouts.
#### Users
- the users schema allows for a user to create an account with the library that records basic user information (name, email, and password), and allows the user to perform basic actions, such as login, update user profile, and check out and check in books.
- When creating a new user, the user is automatically logged in and can perform these other user actions.
#### Books
#### Checkout

### Controllers
#### bookController

#### userController

### app.js and server.js
#### app

#### server

## Wireframe
![Image shows an early sketch of how the API would function](Figure_1.png)
- Above is the wireframe I made to map out the functionality of my API.

![Image shows the web of connected documents created by the API](Figure_2.jpg)

- [Here](https://trello.com/b/ycKT7465/library-api) is a link to the Trello I made for the API.

## How to use this application on your local machine
### Fork this git repository onto your machine
- Towards the upper right of this page, you should see three buttons: "watch", "fork", and "star". Feel free to watch and star my work, but for now all you will need to do  is click the fork button to create a clone of all my project's folders and files into a git repository on your github account. 
- The next page will give you the option to change the repository name and add a description if you would like; I recommend leaving those as is and clickign the green 'create' fork button.
It will take you to your forked copy of the code (check to see that it says Unit-2-Project forked from m-j-terry/Unit-2-Project). Click the green < code > button toward the upper right of the screen. Copy the link to your clipboard. 
- Next, open up your command line: on Mac press "shift" + "space bar" to open the spotlight search, type "terminal", press enter. 
- Now, enter the following commands:
    1. mkdir library-api
    2. cd library-api
    3. pwd     (this one is to print the working directory; it is the "you are here" command)
    4. git clone <--insert link here-->
    5. ls      (lists files and folders; there should be a unit-2-project directory here)
    6. cd unit-2-project
    7. code .  (this will open the directory and its subdirectories/files in VisualStudio Code)

### Install dependencies
- Next, you need to install the necessary dependencies to make the application run. 
- press control + `  (this is the backtick next to the number one, not the apostrophe next to return)
- This will open up a commandline in VScode, making it easier to manipulate the application and its files. type the following command:
- npm install
- This will install all of the dependencies necessary to make the program work. To read more about the dependencies, check out the dependencies section above for more information on each of the dependencies used. VScode will know which dependencies to install because they are recorded in the package.json file.

- Make sure you are in the main unit-2-folder (pwd), then type the following command:
- touch .env     (this will create a new environment file in the unit-2-project directory. The one I created did not get passed onto you forked repository because it has sensitive information that can't be shared (such as the secret for hashing passwords and the mongoURI))
- You'll see this file has popped up in the explorer tab on the left. Click on it to open it in the editor. 
- Write the following three lines in the .env:
- MONGO_URI=
- JWT_SECRET=
- PORT=8000 

##