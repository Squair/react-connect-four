## react-connect-four
react test coverage:
[![codecov](https://codecov.io/gh/Squair/react-connect-four/branch/main/graph/badge.svg?token=HV8VXV8OYS)](https://codecov.io/gh/Squair/react-connect-four)

This is a little fun project that incorperates react, node and socket.io to create a multiplayer version of connect four!

##  How to build and run:
### React:

1. `cd ./react`

2. Restore dependencies:
`yarn install`

3. Populate `.env` with host address running node server.

4. Run the front-end:
`yarn start`

### Node
1. `cd ./node`
2. Restore dependencies
`yarn install`

3. Populate `.env` with host running react and port you want the socket.io server to run on.

4. Run the backend:
`yarn start`

## How to test
### React
1. `cd ./react`
`yarn test`

Have fun!