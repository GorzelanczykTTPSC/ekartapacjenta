import React, { useState, useEffect } from 'react';
import Client from 'fhir-kit-client'
import { Patient, PatientParams } from './Patient'
import DatePicker from "react-datepicker"
import { Observation, ObservationParams } from './Observation';
import { useParams, Link } from 'react-router-dom'
import dateFormat from 'dateformat'
import { BASE_URL } from './constants'
import { Card, Accordion, Container, Row, Table, Button, Tabs, Tab} from 'react-bootstrap';
import { GroupedObservations } from './GroupedObservations';
import { GroupedMedRequests } from './GroupedMedRequests';
import { MedicationRequest } from './MedicationRequest';
import { MedicationRequestParams } from './MedicationRequest'

function subtractYears(numOfYears: number, date = new Date()) {
  const dateCopy = new Date(date.getTime());

  dateCopy.setFullYear(dateCopy.getFullYear() - numOfYears);

  return dateCopy;
}

function groupReducer<Type>(acc: Array<Array<Type>>, curr: Type): Array<Array<Type>> {
  // @ts-ignore
  if (acc.at(-1)!.length==0) {
    acc.at(-1)!.push(curr)
    return acc
  }
  // @ts-ignore
  if (acc.at(-1)?.at(-1)?.date.split('T')[0] == curr.date.split('T')[0]) {
    acc.at(-1)?.push(curr)
    return acc
  }
  acc.push([curr])
  return acc
}

function PatientPage() {

  const [patient, setPatient] = useState<Patient>()

  const { id } = useParams()

  const client = new Client({baseUrl: BASE_URL })
  const [startDate, setStartDate] = useState(subtractYears(10, new Date()))
  const [endDate, setEndDate] = useState(new Date())

  const [observations, setObservations] = useState<Array<Observation>>([])
  const [groupedObservations, setGroupedObservations] = useState<Array<Array<Observation>>>([[]])

  const [medRequests, setMedRequests] = useState<Array<MedicationRequest>>([])
  const [groupedMedRequests, setGroupedMedRequests] = useState<Array<Array<MedicationRequest>>>([[]]) 

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

  const getDates = () => {
      const dates = []
      if (endDate){
        dates.push("<=" + dateFormat(endDate, "yyyy-mm-dd"))
      }
      if (startDate){
        dates.push(">=" + dateFormat(startDate, "yyyy-mm-dd"))
      }
      console.log("Dates:", dates)
      return dates
  }

  const loadData = async () => {
    client.search({
      resourceType: 'Patient',
      searchParams: {
        "_id": id || ""
      } 
    }).then(data => {
      //console.log("Patient:",data)
      setPatient(new Patient(data.entry[0].resource))
      return client.search({
        resourceType: 'Observation',
        searchParams: {
          subject: id!,
          "date": getDates()
        }
      });
    }).then(async data => {
      //console.log("Observations:",data)
      const observations: Array<Observation> = (await listAllResources(data)).reduce((arr: Array<Observation>, bundle: {entry: [{resource: ObservationParams}]}) => {
        bundle.entry?.forEach((obs: {resource: ObservationParams}) => {
          arr.push(new Observation(obs.resource))
        })
        return arr
      }, [])
      setObservations(observations.reverse())
      return client.search({
        resourceType: 'MedicationRequest',
        searchParams: {
          subject: id!,
          authoredon: getDates()
        }
      })
    }).then(async reqs => {
      const medReqs: Array<MedicationRequest> = (await listAllResources(reqs)).reduce((arr: Array<MedicationRequest>, bundle: {entry: [{resource: MedicationRequestParams}]}) => {
        console.log("MEDREQS: ", bundle)
        bundle.entry?.forEach((obs: {resource: MedicationRequestParams}) => {
          arr.push(new MedicationRequest(obs.resource))
        })
        return arr
      }, [])
      console.log('reduced medreqs', medReqs)
      setMedRequests(medReqs.reverse())
    })

  }

  useEffect(() => {
    console.log(observations)
    // @ts-ignore
    setGroupedObservations(observations.reduce(groupReducer, [[]] ))
  }, [observations])

  useEffect(() => {
    // @ts-ignore
    const reduced = medRequests.reduce(groupReducer, [[]] )
    console.log('reeduced', reduced)
    // @ts-ignore
    setGroupedMedRequests(reduced)
  }, [medRequests])
  

  useEffect(() => {
    loadData()
  }, [])
  
  
  return (
    <Container>
      <h1 style={{textAlign: "center"}}>Details</h1>
      <Row>
        <Card>
          <Card.Body>
            <h2>Patient: {patient?.fullname}</h2>
            <h4>Birth date: {patient?.birthDate}</h4>
            <h4>Gender: {patient?.gender}</h4>
            <div>
            {
              patient?.identifiers.reverse().map(el => {
                return (<h6>{el}</h6>)
              })
            }
            </div>
          </Card.Body>
        </Card>
      </Row>
      <Row>
        <Card>
          <Card.Body>
          <div style={{"float": "left"}}>
            From date:
            <DatePicker selected={startDate} onChange={(date:Date) => setStartDate(date)} />
          </div>
          <div style={{"float": "left"}}>
            To date:
            <DatePicker selected={endDate} onChange={(date:Date) => {setEndDate(date)}} />
          </div>
          <div style={{"float": "left", height: "100%", display: "flex"}}>
            <Button style={{width: "100px"}} onClick={loadData}>Filter</Button>
          </div>
        </Card.Body>
        </Card>
      </Row>
      <Row style={{marginTop: "30px"}}>
        <Tabs defaultActiveKey="observations">
          <Tab eventKey="observations" title="Observations">
            <Accordion defaultActiveKey="0" style={{marginTop: '15px'}}>
              <GroupedObservations data={groupedObservations} />
            </Accordion>
          </Tab>
          <Tab eventKey="requests" title="Medication requests">
            <Accordion defaultActiveKey="0" style={{marginTop: '15px'}}>
              <GroupedMedRequests data={groupedMedRequests} />
            </Accordion>
          </Tab>
        </Tabs>
      </Row>
      
    </Container>
  )

}

export default PatientPage;