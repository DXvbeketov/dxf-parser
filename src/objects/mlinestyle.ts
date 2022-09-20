import { IObject } from 'src/DxfParser.js';
import DxfArrayScanner, { IGroup } from '../DxfArrayScanner.js';

export type ObjectsName = 'MLINESTYLE'

;

export interface IMLineStyle extends IObject {
    flags: number;
    description: string;
    color: number;
    startAngle: number;
    endAngle: number;
    elements: Array<IMLineStyleElement>;	//todo
}

export interface IMLineStyleElement {
    offset: number;
    color: number;
    //lineType: ILineType;
}

export default class MLineStyle implements IObject {
    public ForObjectName = 'MLINESTYLE' as const;

    public parseEntity(scanner: DxfArrayScanner, curr: IGroup) {
        const entity = {
            elements: [] as Array<IMLineStyleElement>,
        } as IMLineStyle;

        curr = scanner.next();
        console.info('MLINESTYLE {')
        while (!scanner.isEOF()) {

            curr = scanner.next();

            console.info('code: ' + curr.code + '; value: ' + curr.value);
            switch (curr.code) {
                case 2:
                    //name = curr.value as string;
                    break;
                case 3:
                    entity.description = curr.value as string;
                    break;
                case 62:
                    entity.color = curr.value as number;
                    break;
                case 420:
                    entity.color = curr.value as number;
                    break;
                case 70:
                    entity.flags = curr.value as number;
                    break;
                case 51:
                    entity.startAngle = curr.value as number;
                    break;
                case 52:
                    let endAngle = curr.value as number;
                    if (endAngle < 10.0 || endAngle > 170.0) {
                        endAngle = 90.0;
                    }
                    entity.endAngle = endAngle;
                    break;
                case 71:
                    //entity.numElements = curr.value as number;

                    // read mlinestylelement

                    break;
                case 1001:
                    //ignored;
                    break;
                default:
                    console.info('code:' + curr.code + '; value' + curr.value);
                    curr = scanner.next();
            }
            console.info('}');
        }
        return entity;
    }
}