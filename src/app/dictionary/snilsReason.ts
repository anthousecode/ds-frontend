import {NoSnilsReasonModel} from '../models/noSnilsReason.model';

export const SnilsReasons: NoSnilsReasonModel[] = [
    {
        id: 1,
        name: 'Иностранный гражданин'
    },
    {
        id: 2,
        name: 'Новорожденный'
    },
    {
        id: 3,
        name: 'Другое'
    }
];

export enum ReasonNumber {
    INTERNAL = 1,
    NEW_BORN = 2,
    ANOTHER = 3
}
