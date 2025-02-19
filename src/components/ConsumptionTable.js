import React, { useState, useRef } from 'react';
import { Container, Row, Col, Table, Form, Button, Alert, Image } from 'react-bootstrap';
import { BsFillPencilFill, BsFillTrash3Fill, BsFillInfoCircleFill} from 'react-icons/bs';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const ConsumptionTable = ({ consumptions, onDelete, onEdit, onAddNew }) => {
  const [search, setSearch] = useState('');
  const [showChart, setShowChart] = useState(false);
  const chartRef = useRef(null);
  const maxConsumptions = 13;

  // Calcular promedios
  const calculateAverages = () => {
    if (consumptions.length === 0) return { consumption: 0, price: 0, monthlyCost: 0 };
    
    const totals = consumptions.reduce((acc, curr) => ({
      consumption: acc.consumption + Number(curr.consumption),
      price: acc.price + Number(curr.price),
      monthlyCost: acc.monthlyCost + (Number(curr.consumption) * Number(curr.price))
    }), { consumption: 0, price: 0, monthlyCost: 0 });

    return {
      consumption: totals.consumption / consumptions.length,
      price: totals.price / consumptions.length,
      monthlyCost: totals.monthlyCost / consumptions.length
    };
  };

  // Calcular proyección
  const calculateProjection = () => {
    const currentAverage = consumptions.reduce((acc, curr) => 
      acc + (curr.consumption * curr.price), 0) / consumptions.length;

    return Array.from({length: 25}, (_, i) => 
      Number((currentAverage * Math.pow(1.06, i)).toFixed(2))
    );
  };

  // Configuración del gráfico  
  const chartData = {
    labels: Array.from({length: 25}, (_, i) => i + 1),
    datasets: [{
      label: 'Proyección de precio mensual',
      data: calculateProjection(),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      borderRadius: 20,
      borderSkipped: false,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { 
        display: true,
        text: 'Proyección a 25 años (6% inflación anual)'
      }
    },
    scales: {
      y: { title: { display: true, text: 'Precio mensual (USD)' } },
      x: { title: { display: true, text: 'Años' } }
    }
  };

  const averages = calculateAverages();
  const filteredConsumptions = consumptions.filter(c => 
    c.month.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{width: '95%'}}>
      {!showChart ? (
        filteredConsumptions.length === 0 ? (
          <div className="text-center">
            <Container>
              <Row className="justify-content-center">
                <Col className="col-lg-8">
                  <Image src="consumptions-example.png" fluid rounded className="mb-3 border-none"/>
                  <Alert variant="light">
                    <Alert.Heading className='mb-0'><BsFillInfoCircleFill className="mx-3 align-center" /><b>Añade los Consumos del Bill de Luz del Cliente</b></Alert.Heading>
                    <hr />
                    <p className="mb-0 text-start px-3">
                      <b>Coloca:</b>
                      <ul>
                        <li>Consumo Mensual por kWh "Recuadro Rojo en Imagen"</li>
                        <li>Precio Mensual kWh "Circulo Azúl en Imagen"</li>
                      </ul>
                    </p>
                  </Alert>
                  <Button 
                    variant="btn btn-outline-light w-100 py-2" 
                    onClick={onAddNew}
                  >
                    + Nuevo
                  </Button>
                </Col>
              </Row>
            </Container>
          </div>
        ) : (
          <div>
            <Container>
              <Row className='justify-content-center'>
              <Col className="col-lg-8 d-lg-flex d-none mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Buscar..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-75 d-inline me-lg-2"
                  />
                  {/* Botón Nuevo oculto cuando se muestra el gráfico */}
                  {consumptions.length < maxConsumptions && (
                  <Button 
                    variant="outline-primary" 
                    onClick={onAddNew}
                    className="d-none d-lg-inline"
                  >
                    + Nuevo Consumo
                  </Button>
                  )}
                </Col>
                <Col className="d-lg-none d-flex">
                  <Form.Control
                    type="text"
                    placeholder="Buscar..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-3 d-inline"
                  />
                  {/* Botón Nuevo oculto cuando se muestra el gráfico */}
                  {consumptions.length < maxConsumptions && (
                  <Button 
                    variant="primary" 
                    onClick={onAddNew}
                    className="d-none d-lg-inline"
                  >
                    + Nuevo Consumo
                  </Button>
                  )}
                </Col>
              </Row>
            </Container>
            <Container fluid>
              <Table striped responsive bordered hover variant="dark" className="rounded">
                <thead>
                  <tr>
                    <th>Mes</th>
                    <th>Consumo (kWh)</th>
                    <th>Precio (kWh)</th>
                    <th>Al Mes</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConsumptions.map((consumption) => (
                    <tr key={consumption.id}>
                      <td>{consumption.month}</td>
                      <td>{Number(consumption.consumption).toFixed(2)}</td>
                      <td>${Number(consumption.price).toFixed(2)}</td>
                      <td>${(Number(consumption.consumption) * Number(consumption.price)).toFixed(2)}</td>
                      <td>
                        <BsFillPencilFill
                          className="pe-auto"
                          onClick={() => onEdit(consumption)}
                          />{' '}
                        <BsFillTrash3Fill onClick={() => onDelete(consumption.id)} />
                      </td>
                    </tr>
                  ))}
                  <tr className="average-row table-light">
                    <td><strong>Promedios:</strong></td>
                    <td>{averages.consumption.toFixed(2)} kWh</td>
                    <td>${averages.price.toFixed(2)}</td>
                    <td>${averages.monthlyCost.toFixed(2)}</td>
                    <td className="text-muted">-</td>
                  </tr>
                </tbody>
              </Table>
            </Container>
            
            <div className="text-center mt-4">
              {consumptions.length < maxConsumptions && (
              <Button 
              variant="outline-info" 
              onClick={onAddNew}
              className="d-block w-100 mb-3 d-lg-none"
              >
                + Nuevo Consumo
              </Button>
              )}
              <Button 
                variant="outline-light"
                onClick={() => setShowChart(true)}
                className="mb-3"
                >
                Generar Proyección a 25 años
              </Button>
            </div>
          </div>
        )
      ) : (
        <div className="chart-container">
          <div className="text-center mb-4">
            <Button 
              variant="outline-secondary"
              onClick={() => setShowChart(false)}
            >
              Volver a la tabla
            </Button>
          </div>
          <Bar 
            ref={chartRef}
            data={chartData} 
            options={chartOptions} 
          />
          <Alert variant="light d-flex d-lg-none">
            <Alert.Heading className='mb-0'><BsFillInfoCircleFill className="mx-3 align-center" /><b>Dale clic a la barra para saber el precio especifico</b></Alert.Heading>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default ConsumptionTable;