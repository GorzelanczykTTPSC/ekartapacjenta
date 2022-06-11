import React, { useState, useEffect } from 'react';

import Client from 'fhir-kit-client'
import { Patient, PatientParams } from './Patient'

import { useParams } from 'react-router-dom'

import { BASE_URL } from './constants'

function PatientPage() {

  const [patient, setPatient] = useState<Patient>()

  const { id } = useParams()

  const client = new Client({baseUrl: BASE_URL })

  useEffect(() => {
    console.log(process.env)
    client.search({
      resourceType: 'Patient',
      searchParams: {
        "_id": id || ""
      } 
    }).then(data => {
      console.log(data)
      setPatient(new Patient(data.entry[0].resource))
    })
  }, [])


  return (
    <div> siema {id} {patient?.gender}</div>
  )

}

export default PatientPage;