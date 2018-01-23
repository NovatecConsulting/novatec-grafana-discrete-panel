## Discrete Panel

This panel is an extension of https://github.com/NatelEnergy/grafana-discrete-panel

Metrics may have two values one for color encoding, the other for the display text in the panel. 


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

