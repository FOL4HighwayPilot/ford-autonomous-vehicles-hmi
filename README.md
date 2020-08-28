# Ford L4 Autonomous Trucks HMI
A web-based Human-Machine Interface for Level 4 autonomous trucks using the open-source Uber AVS toolkit.

Uber AVS: [xviz](https://github.com/uber/xviz) & [streetscape.gl](https://github.com/uber/streetscape.gl)

## To Build & Run:
### ros-to-xviz:
Build: `yarn bootstrap` <br>
Run: `node index.js server -d [path/to/rosbag/] --rosConfig config-test-custom.json`
### react-app:
Build: `yarn` <br>
Run: `yarn start-streaming`
### Browser:
`localhost:8080/[name_of_rosbag]`



