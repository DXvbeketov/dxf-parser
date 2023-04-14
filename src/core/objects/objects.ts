import DxfArrayScanner, { IGroup } from "src/core/DxfArrayScanner";
import { IMLineStyle } from "./mlinestyle";

export type ObjectsName = 'MLINESTYLE';

export interface IObjects {
	//mlinestyles: Array<IMLineStyle>;
	mlinestyles: Record<string,IMLineStyle>;
}

export interface IObject {
	handle: number;
    //type: string;
	mlinestyles: Array<IMLineStyle>;
}

export default interface IMethodObject {
	ForObjectName: ObjectsName;
	parseObject(scanner: DxfArrayScanner, curr: IGroup): IMLineStyle;
}
