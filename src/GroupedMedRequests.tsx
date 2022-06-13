import { Accordion, Table } from 'react-bootstrap'
import { MedicationRequest } from './MedicationRequest'

function GroupedMedRequests({data}: any) {

    // @ts-ignore
    return data.map((go, idx, arr) => {
      return (
        <Accordion.Item eventKey={idx.toString()}>
          <Accordion.Header>{go[0]?.date.split('T')[0]}</Accordion.Header>
          <Accordion.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Request</th>
                  <th>Author</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
              {
                  
                // @ts-ignore
                go.map((p: MedicationRequest, id, arr) =>  (
                <tr>
                  <td>{id+1}</td>
                  <td>{p.medication}</td>
                  <td>{p.author}</td>
                  <td>{p.date.split('T')[1].split("+")[0].split('-')[0]}</td>
                </tr>
                )
                )
              }
              </tbody>
            </Table>
          </Accordion.Body>
        </Accordion.Item>
      )
  })
}

export { GroupedMedRequests }