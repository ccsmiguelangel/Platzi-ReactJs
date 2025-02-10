import React, { useState } from 'react';
import { Table, Form, Button, Alert } from 'react-bootstrap';
import { BsFillPencilFill, BsFillTrash3Fill } from 'react-icons/bs';

const ConsumptionTable = ({ consumptions, onDelete, onEdit, onAddNew }) => {
  const [search, setSearch] = useState('');

  const filteredConsumptions = consumptions.filter((consumption) =>
    consumption.month.toLowerCase().includes(search.toLowerCase())
  );

  return (
    filteredConsumptions.length === 0 ? (
      <div className="text-center p-4">
        <Alert variant="light"><Alert.Heading className='mb-0'>Añade los Consumos del Bill de Luz del Cliente</Alert.Heading></Alert>
        <Button variant="primary" onClick={onAddNew}>
          + Nuevo
        </Button>
      </div>
    ) : (
      <div>
        <Form.Control
        type="text"
        placeholder="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3"/>
        <Table striped bordered hover responsive variant="dark" className="rounded">
          <thead>
            <tr>
              <th>Consumo</th>
              <th>Mes</th>
              <th>Precio kWh</th>
              <th>Pago del Mes</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredConsumptions.map((consumption) => (
              <tr key={consumption.id}>
                <td>{consumption.consumption}kWh</td>
                <td>{consumption.month}</td>
                <td>${consumption.price}</td>
                <td>${consumption.consumption * consumption.price}</td>
                <td>
                  <BsFillPencilFill
                    className="pe-auto"
                    onClick={() => onEdit(consumption)}
                  />{' '}
                  <BsFillTrash3Fill onClick={() => onDelete(consumption.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    ))
};

export default ConsumptionTable;