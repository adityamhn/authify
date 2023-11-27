![Authify logo](https://i.postimg.cc/9FXtgQ4B/authify-full.png)
# Authify: Role-Based Access Control Simplified (Under development)

**Authify** is an innovative Role-Based Access Control (RBAC) platform designed to streamline the process of building and managing permissions. 

#### Key features:
- **Authify** features an intuitive web interface for easy authorization management – think ticking a checkbox simple!
- Plus, an easy-to-implement SDK to integrate access control seamlessly into your applications. - https://www.npmjs.com/package/authify

## Getting Started

### System Requirements

- Node.js version 18.17 or later
- Docker for managing databases and services

### Setting Up Your Local Environment

#### 1. Clone the Repository

Start by cloning the Authify repository into your local environment:

```bash
git clone git@github.com:adityamhn/authify.git
```

#### 2. Initialize Local Servers (MongoDB and Redis)

We will use Docker to start your local MongoDB and Redis servers. Go to the directory where you have cloned the repo and run:

```bash
docker-compose up
```

#### 3. Launch the Backend

Now, launch a new terminal and navigate into the backend directory in the repository: 

```bash
cd ./backend
```

Now once you are in the backend directory, execute the command below to start the backend server:

```bash
# run "npm install" to install all the dependency packages

npm run dev & npm run watch
```

Verify the backend is running by visiting [http://127.0.0.1:8080](http://127.0.0.1:8080).

#### 4. Start the Frontend

Now, launch a new terminal and navigate into the frontend directory in the repository: 

```bash
cd ./frontend
```

Now once you are in the frontend directory, execute the command below to start the frontend server:

```bash
# run "npm install" to install all the dependency packages

npm run dev
```

Confirm the frontend is operational by navigating to [http://127.0.0.1:3000](http://127.0.0.1:3000).  

#### YAY!!! NOW YOU ARE SET TO START HACKING!
![Random GIF](https://media.tenor.com/YbmQHDSJvbkAAAAC/thumbs-up-hacker.gif)



### Contributing to Authify
We welcome contributions from the community! If you want to contribute through code or documentation, the [Contributing guide](https://github.com/adityamhn/authify/blob/main/CONTRIBUTING.md) is the best place to start. If you have questions, feel free to ask.

### License
Authify is open-sourced under the [MIT License](https://choosealicense.com/licenses/mit/). See our [LICENSE](https://raw.githubusercontent.com/adityamhn/authify/main/LICENSE) file for more details.

