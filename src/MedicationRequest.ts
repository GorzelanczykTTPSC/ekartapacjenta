interface MedicationRequestParams {
    id: string,
    code: {coding: Array<any>, text: string},
    authoredOn: string,
    requester: {
        display: string
    },
    medicationCodeableConcept?: {text: string}
}

class MedicationRequest {
    data: MedicationRequestParams
    _date: string
    author: string
    medication: string

    constructor(data: MedicationRequestParams) {
        this.data = data
        this._date = data.authoredOn
        this.author = data.requester.display
        this.medication = data.medicationCodeableConcept ? data.medicationCodeableConcept.text: ''
    }

    get date(): string {
        return this._date
    }
}

export { MedicationRequest }
export type { MedicationRequestParams }