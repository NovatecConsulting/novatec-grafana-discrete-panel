## Discrete Panel

This panel is an extension of https://github.com/NatelEnergy/grafana-discrete-panel

### Enhencements
* Per displayed row multiple metric series can be used (separate series for the displayed value)
* Configurable indents for row headers
* Option of showing a time line
* Option of configuring dynamic links (using different metric data) for on-click action for the rows

### Screenshots

![example](https://raw.githubusercontent.com/NovaTecConsulting/novatec-grafana-discrete-panel/master/src/img/screenshot-single-1.png)
![example](https://raw.githubusercontent.com/NovaTecConsulting/novatec-grafana-discrete-panel/master/src/img/screenshot-single-2.png)
![example](https://raw.githubusercontent.com/NovaTecConsulting/novatec-grafana-discrete-panel/master/src/img/screenshot-single-3.png)
![example](https://raw.githubusercontent.com/NovaTecConsulting/novatec-grafana-discrete-panel/master/src/img/screenshot-single-4.png)
![example](https://raw.githubusercontent.com/NovaTecConsulting/novatec-grafana-discrete-panel/master/src/img/screenshot-multiple.png)
![options](https://raw.githubusercontent.com/NovaTecConsulting/novatec-grafana-discrete-panel/master/src/img/screenshot-options-1.png)
![options](https://raw.githubusercontent.com/NovaTecConsulting/novatec-grafana-discrete-panel/master/src/img/screenshot-options-2.png)


### Building

To complie, run:
```
npm install -g yarn
yarn install --pure-lockfile
grunt
```

To Check tslint:
```
yarn global add tslint typescript

tslint  -c tslint.json 'src/**/*.ts'
```

