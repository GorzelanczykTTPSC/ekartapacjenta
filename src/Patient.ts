interface Identifier {system: string, type?: {text: string}, value: string}

interface PatientParams {
    "name": Array<any>,
    "gender": string,
    "birthDate": string,
    identifier: Array<Identifier>,
    id: string
}


class Patient {
    data: PatientParams
    _fullname: string
    _firstName: string
    _lastName: string
    _gender: string
    _birthDate: string
    _identifiers: Array<Identifier>
    _id: string

    constructor(data: PatientParams) {
        this.data = data
        //console.log(data.name[0]['given'].join(' ')+' '+data.name[0]['family'])
        // (data.name[0]['prefix'] || ['']).join(' ')+
        this._firstName = data.name[0]['given'].join(' ')
        this._lastName = data.name[0]['family']
        this._fullname = [(data.name[0]['prefix'] || ['']).join(' '), data.name[0]['given'].join(' '), data.name[0]["family"]].join(' ')
        this._gender = data.gender
        this._birthDate = data.birthDate
        this._identifiers = data.identifier
        this._id = data.id
    }

    get fullname(): string {
        return this._fullname
    }

    get gender(): string {
        return this._gender
    }

    get birthDate(): string {
        return this._birthDate
    }

    get identifiers(): Array<string> {
        return this._identifiers.filter(obj  => obj['type']).map((obj)=>{
            return `${obj.type!.text}: ${obj.value}`
        })
    }

    get id(): string {
        return this._id
    }

}; 

export { Patient };
export type { PatientParams };