[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-f059dc9a6f8d3a56e377f745f24479a46679e63a5d9fe6f495e02850cd0d8118.svg)](https://classroom.github.com/online_ide?assignment_repo_id=6384638&assignment_repo_type=AssignmentRepo)
![logo_ironhack_blue 7](https://user-images.githubusercontent.com/23629340/40541063-a07a0a8a-601a-11e8-91b5-2f13e4e6b441.png)

# Rooms App with Reviews - final practice for project #2

<br><br>

## Introduction

<br>

In previous lessons, we covered all the basics one full-stack app can have. Now is the time for you to implement all these features one more time.

<br>

## Instructions

The app needs to have users (signup, login, and logout functionality) and full CRUD on at least one of the models, but that one model can't be just users (you can have CRUD on users as well, but that can't be the only one). So let's summarize the requirements:

- **Models**: User, Room, Reviews
- **Routes**: auth, rooms, reviews, users (optional, in case you want to add CRUD on users as well)
- **Views**: all the necessary pages so the users can auth themselves and do the CRUD. For easier navigation through your files and consistent naming please organize all the pages into folders (ex. _auth-views_, _room-views_, _comment-views_, ...)

<br>

### Iteration 0 | Create the project

Once more, let's use our friend `IronLauncher` and create a new app:

```bash
$ ironlauncher rooms-app
$ cd rooms-app
$ npm run dev
```

<br>

## Iteration #1: The Signup & Login & Logout Features

Our app will have users, and they will use `email` and `password` to authenticate themselves. They will also have to input their full name when signing in. In addition to this way, please feel free to use any of the social strategies (this is a bonus feature).

So your user schema should look somewhat like this:

```js
const userSchema = new Schema(
  {
    email: String,
    password: String,
    fullName: String,
    // slack login - optional
    slackID: String,
    // google login - optional
    googleID: String
  },
  {
    timestamps: true
  }
);
```

Now create all the routes and views needed to have users successfully signup/login/logout. For auth, you can use `passport.js` and its local strategy or the `sessions & cookies` setup.

💡 Make sure you install all the packages:

For `passport.js`: _bcrypt_, _passport_, _passport-local_,

For `sessions & cookies`: _bcryptjs_, _express-session_, _connect-mongo_.

And if you have `social login`: _passport-google-oauth_ and/or _passport-slack_.

**Hint**: You have already everything set up in the previous lessons + class examples, be resourceful 🥳.

<br>

## Iteration #2: The CRUD on the `room` model

Great, we have users so let's start adding some more functionality to our app.
Our rooms will have following schema:

```js
const roomSchema = new Schema({
  name: { type: String },
  description: { type: String },
  imageUrl: { type: String },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  reviews: [] // we will update this field a bit later when we create review model
});
```

Our users can:

- create new rooms only when logged in
- edit and delete the rooms only if they created them (if they are the owners)
- see the list of the rooms even though they are not logged in

Please proceed to create all the routes and files necessary to display forms and see the results after the submission.

<br>

## Iteration #3: The `review` model and (optional) CRUD on it

Great, you already have a fully functioning CRUD app with users but we will go one more step: let's create _reviews section_ for each room.

The review schema can look like this:

```js
const reviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  comment: { type: String, maxlength: 200 }
});
```

Now we can go ahead and update `reviews` property in the _roomSchema_:

```js
// ...
reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }];
// ...
```

Our users can:

- when logged in, make reviews for all the rooms but the ones they created
- when logged in, edit and/or delete their comments (optional)
- when logged out, see the rooms and all the comments

<br><br>

**Happy coding!** :heart:
