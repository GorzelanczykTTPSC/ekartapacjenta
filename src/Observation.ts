import { mapToStyles } from "@popperjs/core/lib/modifiers/computeStyles"

interface valueQuantityStruct {
    value: number | string,
    unit: string
}

interface ObservationParams {
    id: string,
    code: {coding: Array<any>, text: string},
    effectiveDateTime: string
    valueQuantity?: valueQuantityStruct
    component?: Array<{code: {text: string}, valueQuantity: valueQuantityStruct}>
    valueCodeableConcept?: {text: string}
}



class Observation {
    data: ObservationParams
    _parameter: string
    _date: string
    _value: Array<string>

    constructor(data: ObservationParams) {
        this.data = data
        this._parameter = data.code.text
        this._date = data.effectiveDateTime
        // @ts-ignore
        this._value = data.valueQuantity ? 
            [`${data.valueQuantity.value.toString()} ${data.valueQuantity!.unit.replace('{score}', '')}`]
            : 
            data.component ? data.component.map(el => `${el.code.text}: ${el.valueQuantity.value.toString()} ${el.valueQuantity.unit}`)
            : [data.valueCodeableConcept!.text]
    }

    get parameter(): string {
        return this._parameter
    }

    get id(): string {
        return this.data.id
    }

    get date(): string {
        return this._date
    }

    get value(): Array<string> {
        return this._value
    }

}

export {Observation}
export type {ObservationParams}