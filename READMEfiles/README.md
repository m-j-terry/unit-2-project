![](books.jpeg)
# Unit 2 Project: Library API

## Technologies Used
 - Javascript
 - Node.js
 - Postman
 - MongoDB

## Dependencies
- express: configures the router, allowing for specialization in files
- mongoose: uses Schemas when sending documents to mongoDB, which effectively allows developers to create classes and use OOP principles in back end code
- morgan: allows us to see (and minimize) latency
- bcrypt: Used for web authentication. Encrypts dataWorks with SHA256
- dotenv: zero-dependency modules that loads environment variables from a secure ".env" file
- jsonwebtoken: implements jwt tokens for user authentication in API

## Pseudocode
### Models
- This API features three mongoose schemas as the models for database entries: users, books, and checkouts.
#### Users
- The users schema allows for a user to create an account with the library that records basic user information (name, email, and password), and allows the user to perform basic actions, such as login, update user profile, and check out and check in books.
- When creating a new user, the user is automatically logged in and can perform these other user actions.
#### Books
- The books schema allows for the (in this instance, the user, but librarian authentication could easily be employed) user to add books to the library's online database. 
#### Checkout
- The checkout schema allows for flexibility in creating receipts for when checked out books will be due and whether or not books are available to be checked out by storing a reference to the corresponding book _id. 

### Routers
#### userRoutes and bookRoutes
- The routes connect the built in express.Router() to the controllers.
### Controllers
#### bookController
- The bookController allows for CRUD functionality on documents corresponding to the '/books' route. 
#### userController
- The userController creates a RESTful framework for user functionality.
### app.js and server.js
#### app
- app.js sets up the express app, defines userRoutes and bookRoutes, and tells the app whhich dependencies it is required to run
#### server
- server.js connects to mongoose and makes sure the computer is listening on the PORT.
## Wireframe
![Image shows an early sketch of how the API would function](Figure_1.png)
- Above is the wireframe I made to map out the functionality of my API.

![Image shows the web of connected documents created by the API](Figure_2.jpg)

- [Here](https://trello.com/b/ycKT7465/library-api) is a link to the Trello I made for the API.




![](books.jpeg)
# How to use this application on your local machine
## Fork this git repository onto your machine
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

## Install dependencies
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
- For the MONGO_URI
    - You'll have to use your own MongoURI. It should look something like this: mongodb+srv://YOUR_MONGO_USERNAME:rANd0mcHar5@cluster_name.m0r3RanD0MchAr5.mongodb.net/project_name?retryWrites=true&w=majority - Where YOUR_MONGO_USERNAME is... your mongoDB username, clustername is the nane of the cluster where you will be storing the data, and project_name is the name of the application where the data is coming from.
- For the JWT_SECRET
    - You'll need to come up with a secret for hashing your saved passwords. Save your JWT_SECRET as a string.

## Postman
- Next, you should be ready to start adding users and library books to the API!
- In your terminal, run the command: npm run dev
- You should get two messages in your console that will let you know you're ready to start posting:
    1. "We in the building at 8000", which signals that this application is listening on PORT 8000 (as defined in our .env)
    2. "Mongo showing love", which signals that the mongoose has successfully connected to the database specified by the MONGO_URI.
- Go to postman and send some post requests to '/books' to add a few of your favorite books to the library's collection. Be sure to include everything specified by the schema in the book model. Title, Author, Genre, and Condition are all string fields and are required. ISBN is a number but is not required.
- Once you've added these, you may create yourself a library user account by makign a post request to '/users'. There are three elements and all are required: name ('string'), email ('string'), and password ('string'). once you've made an account, you can login the newly generated user by  sending the email and password to '/users/login.
- Once logged in, be sure to copy down the user token and user._id in the notes app. After setting the 'Authorization Bearer Token' to th users jwt token, it is time to start checking out some books! Make a put request to '/users/:id/books/:id/checkout", where the first :id is the user id and the second is the book id.
- this will return a new checkout document that will have the following information autofilled in: due date (two weeks in advance), available (not for other users), and borrower (your user).
- to check the book back in, just change the put request to '/users/:id/books/:id/checkin'.
- Lastly, to update the details of the book, such as condition, simply make a put request to '/books/:id', including the key-values you'd like to change in the json.
- To close the application, simply press 'ctrl + c' twice.