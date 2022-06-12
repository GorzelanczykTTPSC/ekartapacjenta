import React, { useState, useEffect } from 'react';
import './MainPage.css';
import { Link } from 'react-router-dom'

import Client from 'fhir-kit-client'
import { Patient } from './Patient'
import { Button, Table, InputGroup, Form} from 'react-bootstrap'
import type { PatientParams } from './Patient';

function MainPage() {

  const [patients, setPatients] = useState<Array<Patient>>([])

  const client = new Client({baseUrl: process.env.BASE_URL || 'http://localhost:8080/baseR4'})
  const [searchPhrase, setSearchPhrase] = useState("")


  // @ts-ignore
  const listAllResources = async (bundle) => {
      
      // @ts-ignore
      const nextLink = bundle.link.filter((el: {relation: string, url: string}) =>{ return el.relation == "next" })
      console.log('next link', nextLink)
      if (nextLink.length > 0) {
        // @ts-ignore
        return [bundle].concat(await listAllResources(await client.nextPage(bundle)))
      } else {
        return [bundle]
      }
  }

  const filterPatients = (patients: Array<Patient>):  Array<Patient> => {
    if (!searchPhrase){
      return patients
    }
    else{
      return patients.filter(e => {return e._lastName.toLowerCase().includes(searchPhrase.toLowerCase())})
    }
  }

  useEffect(() => {
    client.search({
      resourceType: 'Patient'
    }).then( async (data) => {
      // @ts-ignore
      console.log("Patients: ", )
      const more = await listAllResources(data)
      const patients: Array<Patient> = more.reduce((arr: Array<Patient>, bundle: {entry: [{resource: PatientParams}]}) => {
        bundle.entry.forEach(patient => {
          arr.push(new Patient({
            "name": patient.resource.name,
            "gender": patient.resource.gender,
            "birthDate": patient.resource.birthDate,
            "identifier": patient.resource.identifier,
            "id": patient.resource.id
          }))
        })
        return arr
      }, [])
      
      console.log("all patients: ", patients)
      
      setPatients(patients)
    })
  }, [])



  return (
    <div className="App">
      <h1>Patients</h1>
      <InputGroup className="mb-3" style={{width: "50%", marginLeft: "25%"}}>
        <Form.Control
          placeholder="Last name"
          aria-label="Lastname"
          aria-describedby="basic-addon1"
          onChange={e=>setSearchPhrase(e.target.value)}
        />
      </InputGroup>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Full name</th>
            <th>Gender</th>
            <th>Birth date</th>
            <th>Identifiers</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {
          filterPatients(patients).map((p, idx, arr) =>  (
          <tr>
            <td>{idx+1}</td>
            <td>{p.fullname}</td>
            <td>{p.gender}</td>
            <td>{p.birthDate}</td>
            <td><span>{p.identifiers.at(-1)}</span></td>
            <td><Link to={`/patient/${p.id}`}><Button>View</Button></Link></td>  
          </tr>
          )
          )
        }
        </tbody>
      </Table>
        
    </div>
  );
}

export default MainPage;
