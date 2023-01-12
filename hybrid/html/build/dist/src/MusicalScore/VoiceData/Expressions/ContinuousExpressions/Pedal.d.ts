import { MultiExpression } from "../MultiExpression";
export declare class Pedal {
    constructor(line?: boolean, sign?: boolean);
    private line;
    private sign;
    StaffNumber: number;
    ParentStartMultiExpression: MultiExpression;
    ParentEndMultiExpression: MultiExpression;
    ChangeEnd: boolean;
    ChangeBegin: boolean;
    get IsLine(): boolean;
    get IsSign(): boolean;
}
