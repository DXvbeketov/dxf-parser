import * as helpers from '../ParseHelpers.js';
import IGeometry, { IEntity, IPoint } from './geomtry.js';
import DxfArrayScanner, { IGroup } from '../DxfArrayScanner.js';

export interface IMLineEntity extends IEntity {
	styleName: string;
	handlerId: number;

	numberOfVertices: number;
	numberOfElementsInMLineStyle: number;

	segments: IMlineVertex[];

	extrusionDirection: IPoint;
	scale: number;
	justification: number;
	flags: number;
	numberOfParameters: number;
}

export interface IMlineVertex {
	position: IPoint,
	direction: IPoint,					// direction to next point
	offset: IPoint,						// offset for next line
	distances: Array<Array<number>>,	// dimensions of offsets
}


function getValue(group: IGroup) {
	//console.log('code: ' + group.code + '; value: ' + group.value);
	return group.value;
}

function ReadMLineSegments(
	scanner: DxfArrayScanner,
	numberOfVertices: number,
	numberStyleElements: number
) {

	scanner.rewind();
	let segments: Array<IMlineVertex> = [];
	for (let i = 0; i < numberOfVertices; i++) {
		let point = {} as IPoint;
		point.x = getValue(scanner.next()) as number;	// code 11
		point.y = getValue(scanner.next()) as number;	// code 21
		point.z = getValue(scanner.next()) as number;	// code 31

		let direction = {} as IPoint;
		direction.x = getValue(scanner.next()) as number;	// code 12
		direction.y = getValue(scanner.next()) as number;	// code 22
		direction.z = getValue(scanner.next()) as number;	// code 32

		let miter = {} as IPoint;
		miter.x = getValue(scanner.next()) as number;	// code 13
		miter.y = getValue(scanner.next()) as number;	// code 23
		miter.z = getValue(scanner.next()) as number;	// code 33

		let distances: Array<Array<number>> = [];
		for (let j = 0; j < numberStyleElements; j++) {
			// code 74
			let _distances: Array<number> = [];
			let current = scanner.next();
			if (current.code === 74) {
				let numDistances = current.value as number;
				for (let index: number = 0; index < numDistances; index++) {
					let value = getValue(scanner.next());
					_distances.push(value as number);
				}
			}
			current = scanner.next();
			if (current.code === 75) {
				// ignored
				let numDistances = current.value as number;
				for (let k = 0; k < numDistances; k++) {
					scanner.next();
				}
			}
			distances.push(_distances)
		}
		let segment = {} as IMlineVertex;
		segment.position = point;
		segment.direction = direction;
		segment.offset = miter;
		segment.distances = distances;

		segments.push(segment);
	}

	return segments;
}

export default class MLine implements IGeometry {
	public ForEntityName = 'MLINE' as const;
	public parseEntity(scanner: DxfArrayScanner, curr: IGroup) {
		const entity = {
			type: curr.value,
			segments: [] as IMlineVertex[]
		} as IMLineEntity;
		curr = scanner.next();
		while (!scanner.isEOF()) {
			if (curr.code === 0) break;

			switch (curr.code) {
				case 2:
					entity.styleName = curr.value as string;
					break;
				case 40:
					entity.scale = curr.value as number;
					break
				case 70:
					entity.justification = curr.value as number;
					break
				case 71:
					entity.flags = curr.value as number;
					break
				case 72:
					entity.numberOfVertices = curr.value as number;
					break
				case 73:
					entity.numberOfElementsInMLineStyle = curr.value as number;
					break
				case 10:
					break;
				case 210:
					entity.extrusionDirection = helpers.parsePoint(scanner);
					break;
				case 340:
					entity.handlerId = curr.value as number;
					break;
				case 11:
					entity.segments = ReadMLineSegments(scanner, entity.numberOfVertices, entity.numberOfElementsInMLineStyle);
					break;
				default:
					helpers.checkCommonEntityProperties(entity, curr, scanner);
					break;
			}

			curr = scanner.next();
		}
		return entity;
	}
}
