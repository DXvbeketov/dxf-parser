import DxfArrayScanner, { IGroup } from '../DxfArrayScanner.js';
import IMethodObject, { IObject } from './objects.js';

export interface IMLineStyle extends IObject {
    flags: number;
    name: string;
    description: string;
    color: number;
    startAngle: number;
    endAngle: number;
    mlineStyleElements: Array<IMLineStyleElement>;	//todo
}

export interface IMLineStyleElement {
    offset: number;
    color: number;
    lineTypeName: string;
}

export default class MLineStyle implements IMethodObject {
    public ForObjectName = 'MLINESTYLE' as const;

    public parseObject(scanner: DxfArrayScanner, curr: IGroup) {

        const entity = {
            //type: curr.value,
            mlineStyleElements: [] as Array<IMLineStyleElement>,
        } as IMLineStyle;

        curr = scanner.next();
        console.debug('MLINESTYLE {')
        while (curr.code != 0) {
            console.debug('code: ' + curr.code + '; value: ' + curr.value);
            switch (curr.code) {
                case 2:
                    entity.name = curr.value as string;
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
                    let numElements = curr.value as number;
                    entity.mlineStyleElements = ReadMLineStylElements(scanner, numElements);
                    break;
                case 1001:
                    break;
                default:
                    break;
            }
            curr = scanner.next();
        }
        console.debug('} END MLINESTYLE')
        return entity;
    }
}

function ReadMLineStylElements(scanner: DxfArrayScanner, numElements: number){
    let elements: Array<IMLineStyleElement> = [];

    console.debug('MLINESTYLEELEMENTS {');
    for(let i = 0; i < numElements; i++){
        let curr = scanner.next();
        console.debug('ELEMENT [' + i + '] {');
        let offset = curr.value as number; // code 49
        curr = scanner.next();
        console.debug('code: ' + curr.code + '; value: ' + curr.value);
        let color = curr.value as number;
        curr = scanner.next();
        console.debug('code: ' + curr.code + '; value: ' + curr.value);
        if (curr.code === 420) {
            color = curr.value as number;
            curr = scanner.next();
        }
        let linetypename = curr.value as string;
        console.debug('code: ' + curr.code + '; value: ' + curr.value);
        let element = {} as IMLineStyleElement;
        element.color = color;
        element.offset = offset;
        element.lineTypeName = linetypename;
        elements.push(element);
        console.debug('} END ELEMENT');
    }
    console.debug('} END MLINESTYLEELEMENT');
    return elements;
}