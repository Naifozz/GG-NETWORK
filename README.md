# GG NETWORK

Creation of a REST API for a Fictional Social Network

The network is centered around the world of video games and offers various features: the creation of community groups, whether by YouTubers or players, the management of contests and a marketplace, as well as the announcement of live streams and new videos. It also includes a badge system, profile customization, and friend suggestions based on connected platforms.

## How to use

Clone the repo

- `git clone https://github.com/Naifozz/GG-NETWORK.git`

Install project dependencies

- `npm install`
- `npm install @prisma/client cors dotenv express process zod vitest`

Initiate database

- `prisma generate`

Launch the API

- `npm run dev`, it will become available at http://localhost:3000

## Architecture

📂 GG New Project  
├── 📂 [.husky](./.husky)<br>
├── 📂 [config](./config)<br>
├── 📂 [controllers](./controllers) <br>
├── 📂 [prisma](./hello-prisma) <br>
├── 📂 [src](./src) <br>
&emsp;&emsp; ├── 📂 [models](./src/models) <br>
&emsp;&emsp; ├── 📂 [repositories](./src/repositories) <br>
&emsp;&emsp; ├── 📂 [routes](./src/routes) <br>
&emsp;&emsp; └──📂 [services](./src/services) <br>
├── 📂 [tests](./tests) <br>
├── 📂 [utils](./utils) <br>
├── 📄 [.gitignore](.gitignore) <br>
├── 📦 [package.json](package.json) <br>
└── 📖 [README.md](README.md)<br>
