export declare class DistinctPoints {
    name: any;
    changes: Array<any>;
    legendInfo: Array<any>;
    last: any;
    asc: boolean;
    transitionCount: number;
    distinctValuesCount: number;
    elapsed: number;
    constructor(name: any);
    add(ts: number, val: any, dispVal: any, additionalValues: Array<any>): void;
    finish(ctrl: any): void;
}
