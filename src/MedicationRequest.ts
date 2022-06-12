interface MedicationRequestParams {
    id: string,
    code: {coding: Array<any>, text: string},
    authoredOn: string,
    requester: {
        display: string
    },
    valueCodeableConcept?: {text: string}
}

export type { MedicationRequestParams }