import React, { useState, useEffect } from 'react';
import { Observation, ObservationParams } from './Observation';
import dateFormat from 'dateformat'
import { Card, Form, Button, Stack } from 'react-bootstrap';
import { Graph } from './Graph';


function GraphWidget({observations}: {observations: Observation[][]}) {
  const [observationType, setObservationType] = useState("");

  return (
    <Card>
      <Card.Body>
        <Card.Title>Plot observations</Card.Title>
          <Form.Select value={observationType} onChange={ (event) => { setObservationType(event.target.value) } }>
            <option value="">Chose an observation type to plot</option>
            <option>Body Height</option>
            <option>Body Weight</option>
            <option>Body Mass Index</option>
          </Form.Select>
          <Graph observations={observations} observationType={observationType} />
      </Card.Body>
    </Card>
  );
}


export { GraphWidget };
